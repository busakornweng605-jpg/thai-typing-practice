import os
import sys
import json
import sqlite3
import threading
from urllib.parse import urlparse, parse_qs
from http.server import SimpleHTTPRequestHandler
import socketserver
import webview


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
