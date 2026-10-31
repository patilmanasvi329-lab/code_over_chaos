import subprocess, time, urllib.request, json, socket, os, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
file_url = 'file:///' + os.path.abspath('index.html').replace(os.sep, '/')
proc = subprocess.Popen([edge_path, '--headless=new', '--remote-debugging-port=9224', '--disable-gpu', file_url])
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9224/json').read())
    target = [t for t in tabs if "calculator" in t.get("url", "")][0]
    ws_url = target['webSocketDebuggerUrl']
    path = ws_url.split('9224')[1]
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('127.0.0.1', 9224))
    key = base64.b64encode(os.urandom(16)).decode()
    handshake = f'GET {path} HTTP/1.1\r\nHost: 127.0.0.1:9224\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'
    sock.sendall(handshake.encode())
    res = sock.recv(4096).decode()
    
    def send(msg):
        p = msg.encode('utf-8')
        m = os.urandom(4)
        h = bytearray([0x81, 0x80 | len(p)]) + m
        masked = bytearray(p[i] ^ m[i%4] for i in range(len(p)))
        sock.sendall(h + masked)
        
    code = """
    (function() {
        var btn7 = document.querySelector("button[data-value='7']");
        var btnEq = document.querySelector("#btnEquals");
        var disp = document.getElementById("mainDisplay");
        return {
            hasBtn7: !!btn7,
            hasBtnEq: !!btnEq,
            hasDisp: !!disp,
            gridKeypad: !!document.querySelector(".grid-keypad")
        };
    })()
    """
    cmd = {'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': code, 'returnByValue': True}}
    send(json.dumps(cmd))
    time.sleep(0.5)
    r = sock.recv(4096)
    print('RESPONSE:', r)
finally:
    proc.terminate()
