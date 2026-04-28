import os
import sys
import json
import sqlite3
import threading
import urllib.parse
import urllib.request
from urllib.parse import urlparse, parse_qs
from http.server import SimpleHTTPRequestHandler
import socketserver
import webview

# 簡易記憶體快取：避免重複 TTS 請求 Google
_tts_cache = {}
_TTS_CACHE_MAX = 500
# TTS 可用旗標：失敗或啟動時偵測到離線就關閉，避免後續請求逾時
_tts_disabled = False


def check_online(timeout=2):
    """快速偵測是否能連到 Google（HEAD /generate_204）。"""
    try:
        req = urllib.request.Request(
            'https://www.google.com/generate_204',
            headers={'User-Agent': 'Mozilla/5.0'},
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return 200 <= resp.status < 400
    except Exception:
        return False


def get_base_path():
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))


def get_writable_dir():
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


DB_PATH = os.path.join(get_writable_dir(), "thai_words.db")


def query_words():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, rank, thai_word, kbd_seq, chinese, english "
        "FROM thai_words ORDER BY rank"
    )
    rows = cur.fetchall()
    conn.close()
    result = []
    for id_, rank, thai_word, kbd_seq, chinese, english in rows:
        seq = kbd_seq[1:-1] if kbd_seq and kbd_seq.startswith("【") else (kbd_seq or "")
        result.append({
            "id": id_, "rank": rank, "thai_word": thai_word,
            "kbd_seq": seq, "chinese": chinese, "english": english,
        })
    return result


def query_audio(word_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT audio FROM thai_words WHERE id=?", (word_id,))
    row = cur.fetchone()
    conn.close()
    if row and row[0]:
        return bytes(row[0])
    return None


def fetch_tts(text):
    """從 Google Translate TTS 取得泰文整體合成音（記憶體快取）。
    離線或上次失敗則直接回 None，避免每次都等網路逾時。
    """
    global _tts_disabled
    if _tts_disabled or not text:
        return None
    if text in _tts_cache:
        return _tts_cache[text]
    url = (
        'https://translate.googleapis.com/translate_tts'
        f'?ie=UTF-8&q={urllib.parse.quote(text)}&tl=th&client=tw-ob'
    )
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        # 短逾時：3 秒，離線時快速失敗
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = resp.read()
    except Exception:
        _tts_disabled = True   # 一次失敗後關閉，避免後續每次等 timeout
        return None
    # 控制快取大小
    if len(_tts_cache) >= _TTS_CACHE_MAX:
        _tts_cache.pop(next(iter(_tts_cache)))
    _tts_cache[text] = data
    return data


def query_cons_audio(cp_hex):
    """依 codepoint hex（如 '0e0d'）查 cons_audio 表的字母誦讀音訊。"""
    try:
        char = chr(int(cp_hex, 16))
    except (ValueError, TypeError):
        return None
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    # 容錯：表不存在時回 None
    try:
        cur.execute("SELECT audio FROM cons_audio WHERE char=?", (char,))
        row = cur.fetchone()
    except sqlite3.OperationalError:
        row = None
    conn.close()
    if row and row[0]:
        return bytes(row[0])
    return None


class BackendHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/words":
            self._serve_words()
        elif self.path.startswith("/api/cons_audio"):
            self._serve_cons_audio()
        elif self.path.startswith("/api/tts"):
            self._serve_tts()
        elif self.path.startswith("/api/audio"):
            self._serve_audio()
        else:
            super().do_GET()

    def _serve_words(self):
        data = json.dumps(query_words(), ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", len(data))
        self.send_header("Cache-Control", "max-age=3600")
        self.end_headers()
        self.wfile.write(data)

    def _serve_audio(self):
        params = parse_qs(urlparse(self.path).query)
        if "id" not in params:
            self.send_error(400, "Missing id")
            return
        audio_data = query_audio(params["id"][0])
        if not audio_data:
            self.send_error(404, "Not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", "audio/mpeg")
        self.send_header("Content-Length", len(audio_data))
        self.send_header("Cache-Control", "max-age=86400")
        self.end_headers()
        self.wfile.write(audio_data)

    def _serve_tts(self):
        """代理 Google TTS：給定文字回傳泰文整體合成音 mp3。"""
        params = parse_qs(urlparse(self.path).query)
        text = params.get("text", [None])[0]
        if not text:
            self.send_error(400, "Missing text")
            return
        data = fetch_tts(text)
        if not data:
            self.send_error(502, "TTS upstream failed")
            return
        self.send_response(200)
        self.send_header("Content-Type", "audio/mpeg")
        self.send_header("Content-Length", len(data))
        self.send_header("Cache-Control", "max-age=86400")
        self.end_headers()
        self.wfile.write(data)

    def _serve_cons_audio(self):
        params = parse_qs(urlparse(self.path).query)
        if "cp" not in params:
            self.send_error(400, "Missing cp")
            return
        audio_data = query_cons_audio(params["cp"][0])
        if not audio_data:
            self.send_error(404, "Not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", "audio/mpeg")
        self.send_header("Content-Length", len(audio_data))
        self.send_header("Cache-Control", "max-age=86400")
        self.end_headers()
        self.wfile.write(audio_data)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    PORT = 8000
    URL = f"http://localhost:{PORT}"

    os.chdir(get_base_path())

    # 啟動時偵測網路：離線則直接關閉 TTS，避免每次請求都等逾時
    if not check_online(timeout=2):
        _tts_disabled = True
        print("[INFO] 離線模式：TTS 已停用，課程 3-4 將以本地逐字音訊播放。")

    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), BackendHandler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    window = webview.create_window(
        title="泰文輸入練習",
        url=URL,
        width=1280,
        height=820,
        resizable=True,
        min_size=(800, 600),
    )
    webview.start()
    httpd.shutdown()
