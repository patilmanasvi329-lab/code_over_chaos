import subprocess, time, urllib.request, json, socket, os, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
file_url = 'file:///' + os.path.abspath('index.html').replace(os.sep, '/')
proc = subprocess.Popen([edge_path, '--headless=new', '--remote-debugging-port=9225', '--disable-gpu', file_url])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9225/json').read())
    target = [t for t in tabs if "calculator" in t.get("url", "")][0]
    ws_url = target['webSocketDebuggerUrl']
    path = ws_url.split('9225')[1]
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('127.0.0.1', 9225))
    key = base64.b64encode(os.urandom(16)).decode()
    handshake = f'GET {path} HTTP/1.1\r\nHost: 127.0.0.1:9225\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'
    sock.sendall(handshake.encode())
    res = sock.recv(4096).decode()
    
    def send(msg):
        p = msg.encode('utf-8')
        length = len(p)
        mask = os.urandom(4)
        header = bytearray([0x81])
        if length <= 125:
            header.append(0x80 | length)
        else:
            header.append(0x80 | 126)
            header.extend(length.to_bytes(2, 'big'))
        header.extend(mask)
        masked = bytearray(p[i] ^ mask[i%4] for i in range(length))
        sock.sendall(header + masked)

    def recv_msg():
        h = sock.recv(2)
        if len(h) < 2: return None
        l = h[1] & 0x7f
        if l == 126:
            l = int.from_bytes(sock.recv(2), 'big')
        elif l == 127:
            l = int.from_bytes(sock.recv(8), 'big')
        data = bytearray()
        while len(data) < l:
            data.extend(sock.recv(l - len(data)))
        return data.decode('utf-8', errors='ignore')

    # Enable console
    send(json.dumps({'id': 1, 'method': 'Console.enable'}))
    send(json.dumps({'id': 2, 'method': 'Runtime.enable'}))
    time.sleep(0.5)

    # Now evaluate a click directly:
    eval_cmd = {
        'id': 3,
        'method': 'Runtime.evaluate',
        'params': {
            'expression': """
            (function() {
                try {
                    var btn7 = document.querySelector("button[data-value='7']");
                    var before = document.getElementById("mainDisplay").textContent;
                    btn7.click();
                    var after = document.getElementById("mainDisplay").textContent;
                    return { before: before, after: after, btn7Text: btn7.textContent };
                } catch(e) {
                    return { error: e.toString() };
                }
            })()
            """,
            'returnByValue': True
        }
    }
    send(json.dumps(eval_cmd))
    
    for _ in range(15):
        m = recv_msg()
        if m:
            j = json.loads(m)
            if j.get("id") == 3:
                print("EVAL RESULT:", j.get("result", {}).get("result", {}).get("value"))
            elif "method" in j:
                print("BROWSER EVENT:", j["method"], j.get("params"))

finally:
    proc.terminate()
