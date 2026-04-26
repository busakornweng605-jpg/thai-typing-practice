import os
import sys
import json
import urllib.request
import urllib.parse
import hashlib
import threading
import webview
from http.server import SimpleHTTPRequestHandler
import socketserver

def get_base_path():
    """靜態資源目錄：PyInstaller 打包後在 _MEIPASS，開發時在腳本所在目錄"""
    if getattr(sys, 'frozen', False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

def get_writable_dir():
    """可寫入目錄：exe 打包後在 exe 旁邊，開發時在腳本所在目錄"""
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

VOICE_DIR = os.path.join(get_writable_dir(), 'VoiceData')
INDEX_FILE = os.path.join(VOICE_DIR, 'index.json')

# 確保快取目錄存在
if not os.path.exists(VOICE_DIR):
    os.makedirs(VOICE_DIR)

def load_index():
    if os.path.exists(INDEX_FILE):
        try:
            with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_index(index_data):
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)

# 讀入常駐記憶體字典
index_cache = load_index()
# 全域下載鎖定，防止併發下載衝突
download_lock = threading.Lock()

class BackendHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"[DEBUG] Received GET request for path: {self.path}")
        # 攔截自訂 API
        if self.path.startswith('/api/tts'):
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            if 'text' in query_params:
                text = query_params['text'][0]
                if not text.strip():
                    self.send_error(400, "Text is empty")
                    return
                
                # 再次驗證檔案是否存在機制
                if text in index_cache:
                    filepath = os.path.join(VOICE_DIR, index_cache[text])
                    if not os.path.exists(filepath):
                        del index_cache[text] # 若實體檔案遺失，剔除快取索引
                
                # 若無快取，進行遠端下載
                if text not in index_cache:
                    with download_lock:
                        # 雙重檢查鎖定 (Double-checked locking)
                        if text not in index_cache:
                            file_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
                            filename = f"tts_{file_hash}.mp3"
                            filepath = os.path.join(VOICE_DIR, filename)
                            
                            google_url = f"https://translate.googleapis.com/translate_tts?ie=UTF-8&q={urllib.parse.quote(text)}&tl=th&client=tw-ob"
                            req = urllib.request.Request(google_url, headers={'User-Agent': 'Mozilla/5.0'})
                            
                            try:
                                print(f"[CACHE MISS] Downloading TTS for: {filename}")
                                with urllib.request.urlopen(req) as response:
                                    with open(filepath, 'wb') as f:
                                        f.write(response.read())
                                
                                # 儲存成功後更新索引
                                index_cache[text] = filename
                                save_index(index_cache)
                            except Exception as e:
                                print(f"[ERROR] Failed fetching from Google TTS: {e}")
                                self.send_error(500, "TTS Fetch Error")
                                return
                else:
                    print(f"[CACHE HIT] Serving local audio")

                # 讀取並回應音檔
                filepath = os.path.join(VOICE_DIR, index_cache[text])
                try:
                    with open(filepath, 'rb') as f:
                        self.send_response(200)
                        self.send_header('Content-type', 'audio/mpeg')
                        self.send_header('Cache-Control', 'max-age=86400')
                        self.end_headers()
                        self.wfile.write(f.read())
                    return
                except Exception as e:
                    print(f"[ERROR] Failed reading local file: {e}")
                    self.send_error(500, "Local read error")
                    return
            
            # 參數缺失
            self.send_error(400, "Missing text parameter")
            return

        # 預設 HTML 靜態伺服器行為
        return super().do_GET()

if __name__ == '__main__':
    PORT = 8000
    URL = f"http://localhost:{PORT}"

    # 切換工作目錄為靜態資源目錄
    os.chdir(get_base_path())

    # 在背景執行緒啟動 HTTP Server
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), BackendHandler)

    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[INFO] 伺服器啟動：{URL}")

    # 用 pywebview 開啟原生桜面視窗（內嵌 Edge/WebView2）
    window = webview.create_window(
        title='泰文輸入練習',
        url=URL,
        width=1280,
        height=820,
        resizable=True,
        min_size=(800, 600),
    )
    webview.start()  # 視窗關閉後此行返回

    # 視窗關閉後停止 Server
    httpd.shutdown()

