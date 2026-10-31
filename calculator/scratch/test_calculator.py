import subprocess
import time
import urllib.request
import json
import sys
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
index_html = os.path.abspath("index.html")
file_url = f"file:///{index_html.replace(os.sep, '/')}"

print(f"Testing URL: {file_url}")

# Launch Edge with remote debugging
proc = subprocess.Popen([
    edge_path,
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    file_url
])

try:
    # Wait for CDP to be available
    time.sleep(2)
    tabs_url = "http://127.0.0.1:9222/json"
    with urllib.request.urlopen(tabs_url, timeout=5) as resp:
        tabs = json.loads(resp.read().decode())
    
    print(f"Opened tabs count: {len(tabs)}")
    target_tab = None
    for tab in tabs:
        if "calculator" in tab.get("url", "").lower() or "file:" in tab.get("url", ""):
            target_tab = tab
            break
    
    if not target_tab:
        target_tab = tabs[0]
        
    ws_url = target_tab.get("webSocketDebuggerUrl")
    print(f"Tab title: {target_tab.get('title')}")
    print(f"Debugger WS URL: {ws_url}")

finally:
    proc.terminate()
    proc.wait()
