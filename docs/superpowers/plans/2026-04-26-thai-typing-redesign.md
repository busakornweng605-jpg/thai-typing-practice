# 泰文輸入練習 改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將泰文打字練習 App 改版為可部署 GitHub Pages（靜態）及本地 run.exe（pywebview）兩種執行模式，資料來自 thai_words.db，音訊按需下載，不依賴 Google Translate TTS。

**Architecture:** GitHub Pages 使用預先匯出的 words.json + audio/*.mp3（按需下載）；run.exe 透過本地 Python HTTP server 直接讀取 thai_words.db，提供 /api/words 和 /api/audio 兩個端點；前端自動偵測執行環境選擇正確的資料來源。

**Tech Stack:** Python 3 (sqlite3, pywebview, http.server), PyInstaller, Vanilla JS, GitHub Pages, GitHub Actions

---

## 檔案異動總覽

| 檔案 | 動作 |
|---|---|
| `備份/課程內容.json` | 從根目錄搬移 |
| `備份/啟動.bat` | 從根目錄搬移 |
| `備份/server.log` | 從根目錄搬移 |
| `備份/VoiceData/` | 從根目錄搬移 |
| `.gitignore` | 新增 |
| `export_db.py` | 新增（一次性匯出腳本） |
| `words.json` | 新增（export_db.py 產生） |
| `audio/*.mp3` | 新增（export_db.py 產生，~1000 個） |
| `server.py` | 全面改寫（移除 TTS，加入 /api/words、/api/audio） |
| `app.js` | 全面改寫（完整 keyMap、Shift 支援、從 DB/JSON 載入） |
| `index.html` | 微調（加入翻譯顯示區） |
| `style.css` | 微調（加入 hint-shift 樣式） |
| `build.bat` | 新增（PyInstaller 打包腳本） |
| `.github/workflows/deploy.yml` | 新增（GitHub Pages 自動部署） |
| `thai_words.db` | 不變（加入 .gitignore，僅本地使用） |

---

## Task 1: 搬移備份檔案 + 建立 .gitignore

**Files:**
- Modify: `備份/`（搬移檔案進去）
- Create: `.gitignore`

- [ ] **Step 1: 搬移四個項目到備份/**

在 PowerShell 中執行（從專案根目錄）：
```powershell
Move-Item "課程內容.json" "備份\課程內容.json"
Move-Item "啟動.bat" "備份\啟動.bat"
Move-Item "server.log" "備份\server.log"
Move-Item "VoiceData" "備份\VoiceData"
```

- [ ] **Step 2: 建立 .gitignore**

建立 `.gitignore`，內容如下：
```
thai_words.db
dist/
build/
*.spec
__pycache__/
*.pyc
*.pyo
```

- [ ] **Step 3: 驗證目錄結構**

```powershell
Get-ChildItem -Name
```

預期根目錄只剩：`app.js`, `index.html`, `style.css`, `server.py`, `thai_words.db`, `.gitignore`, `CLAUDE.md`, `docs/`, `備份/`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: move unused files to 備份, add .gitignore"
```

---

## Task 2: 建立 export_db.py 並執行匯出

**Files:**
- Create: `export_db.py`
- Create: `words.json`（執行後產生）
- Create: `audio/`（執行後產生）

- [ ] **Step 1: 建立 export_db.py**

建立 `export_db.py`，內容如下：
```python
import sqlite3
import json
import os
import sys

DB_PATH = "thai_words.db"
WORDS_JSON = "words.json"
AUDIO_DIR = "audio"

if not os.path.exists(DB_PATH):
    print(f"錯誤：找不到 {DB_PATH}")
    sys.exit(1)

os.makedirs(AUDIO_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute(
    "SELECT id, rank, thai_word, kbd_seq, chinese, english FROM thai_words ORDER BY rank"
)
rows = cur.fetchall()

words = []
for id_, rank, thai_word, kbd_seq, chinese, english in rows:
    seq = kbd_seq[1:-1] if kbd_seq and kbd_seq.startswith("【") else (kbd_seq or "")
    words.append({
        "id": id_,
        "rank": rank,
        "thai_word": thai_word,
        "kbd_seq": seq,
        "chinese": chinese,
        "english": english
    })

with open(WORDS_JSON, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, separators=(",", ":"))

print(f"匯出 {len(words)} 個單字到 {WORDS_JSON}")

cur.execute("SELECT id, audio FROM thai_words WHERE audio IS NOT NULL")
audio_count = 0
for id_, audio_blob in cur:
    if audio_blob and audio_blob != b"none":
        path = os.path.join(AUDIO_DIR, f"{id_}.mp3")
        with open(path, "wb") as f:
            f.write(bytes(audio_blob))
        audio_count += 1

conn.close()
print(f"匯出 {audio_count} 個音訊檔到 {AUDIO_DIR}/")
```

- [ ] **Step 2: 執行匯出**

```powershell
python export_db.py
```

預期輸出：
```
匯出 1000 個單字到 words.json
匯出 1000 個音訊檔到 audio/
```

- [ ] **Step 3: 驗證輸出**

```powershell
(Get-ChildItem audio -Filter "*.mp3").Count
(Get-Content words.json | ConvertFrom-Json).Count
```

預期：兩者都顯示 1000

- [ ] **Step 4: 驗證 words.json 格式**

```powershell
$w = Get-Content words.json | ConvertFrom-Json
$w[0]
```

預期輸出類似：
```
id       : 1
rank     : 1
thai_word: เป็น
kbd_seq  : gxHo
chinese  : 作為
english  : as
```

- [ ] **Step 5: Commit**

```bash
git add export_db.py words.json audio/
git commit -m "feat: add export_db.py and generated words.json + audio files"
```

---

## Task 3: 改寫 server.py

**Files:**
- Modify: `server.py`

- [ ] **Step 1: 完整改寫 server.py**

將 `server.py` 全部替換為以下內容：
```python
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


class BackendHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/words":
            self._serve_words()
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
```

- [ ] **Step 2: 測試 server.py（不需要 pywebview，用瀏覽器驗證 API）**

開啟新的 PowerShell，執行：
```powershell
python -c "
import os, json, sqlite3, threading
from http.server import SimpleHTTPRequestHandler
import socketserver
exec(open('server.py').read().split('if __name__')[0])
PORT = 8000
os.chdir('.')
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('', PORT), BackendHandler)
print('Server at http://localhost:8000')
httpd.serve_forever()
"
```

在另一個 PowerShell 視窗執行：
```powershell
Invoke-WebRequest http://localhost:8000/api/words | Select-Object -ExpandProperty Content | ConvertFrom-Json | Select-Object -First 2
```

預期看到前兩個單字的 JSON。

```powershell
Invoke-WebRequest http://localhost:8000/api/audio?id=1 -OutFile test_audio.mp3
(Get-Item test_audio.mp3).Length
```

預期：檔案大小 > 0（表示音訊正常回傳）。

按 Ctrl+C 停止測試伺服器，並刪除 `test_audio.mp3`。

- [ ] **Step 3: Commit**

```bash
git add server.py
git commit -m "feat: rewrite server.py with /api/words and /api/audio endpoints"
```

---

## Task 4: 更新 index.html 和 style.css

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: 在 index.html 的 typing-section 加入翻譯顯示區**

找到這段：
```html
        <section class="typing-section">
            <div id="text-display" class="text-display">
                <!-- Javascript 將動態插入文字 -->
            </div>
            <!-- 隱藏的輸入框用於擷取移動裝置或特定輔助輸入（雖然主要依賴全局 keyDown） -->
            <input type="text" id="hidden-input" class="hidden-input" autocomplete="off" spellcheck="false" autofocus>
        </section>
```

替換為：
```html
        <section class="typing-section">
            <div id="text-display" class="text-display">
            </div>
            <div id="translation-display" class="translation-display"></div>
            <input type="text" id="hidden-input" class="hidden-input" autocomplete="off" spellcheck="false" autofocus>
        </section>
```

- [ ] **Step 2: 更新 index.html 的 h2 標題**

找到：
```html
            <h2>第一課：首列（Home Row - ฟ ห ก ด ่ า ส ว）</h2>
            <p>請將手指放在鍵盤中央的 ASDF 與 JKL; 區域，準備開始。</p>
```

替換為：
```html
            <h2>Kedmanee 鍵盤自由練習</h2>
            <p>從 1000 個常用泰文單字中隨機出題，請按對應的 Kedmanee 按鍵輸入。</p>
```

- [ ] **Step 3: 在 style.css 末尾加入新樣式**

在 `style.css` 最後加入：
```css

.translation-display {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-top: 0.75rem;
    text-align: center;
    letter-spacing: 1px;
}

.key.hint-shift {
    border-color: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.4), inset 0 0 0 1px rgba(245, 158, 11, 0.3);
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add translation display area and hint-shift style"
```

---

## Task 5: 全面改寫 app.js

**Files:**
- Modify: `app.js`

- [ ] **Step 1: 全部替換 app.js**

將 `app.js` 全部替換為以下內容：

```javascript
const keyboardLayout = [
  [
    { code: 'Backquote', enUpper: '~', enLower: '`', thUpper: '%', thLower: '_', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'Digit1', enUpper: '!', enLower: '1', thUpper: '+', thLower: 'ๅ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'Digit2', enUpper: '@', enLower: '2', thUpper: '๑', thLower: '/', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit3', enUpper: '#', enLower: '3', thUpper: '๒', thLower: '-', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit4', enUpper: '$', enLower: '4', thUpper: '๓', thLower: 'ภ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit5', enUpper: '%', enLower: '5', thUpper: '๔', thLower: 'ถ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit6', enUpper: '^', enLower: '6', thUpper: 'ู', thLower: 'ุ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'Digit7', enUpper: '&', enLower: '7', thUpper: '฿', thLower: 'ึ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'Digit8', enUpper: '*', enLower: '8', thUpper: '๕', thLower: 'ค', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit9', enUpper: '(', enLower: '9', thUpper: '๖', thLower: 'ต', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Digit0', enUpper: ')', enLower: '0', thUpper: '๗', thLower: 'จ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Minus', enUpper: '_', enLower: '-', thUpper: '๘', thLower: 'ข', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Equal', enUpper: '+', enLower: '=', thUpper: '๙', thLower: 'ช', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Backspace', label: 'Backspace', special: true, width: '80px' }
  ],
  [
    { code: 'Tab', label: 'Tab', special: true, width: '65px' },
    { code: 'KeyQ', enUpper: 'Q', enLower: 'q', thUpper: '๐', thLower: 'ๆ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyW', enUpper: 'W', enLower: 'w', thUpper: '"', thLower: 'ไ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'KeyE', enUpper: 'E', enLower: 'e', thUpper: 'ฎ', thLower: 'ำ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'KeyR', enUpper: 'R', enLower: 'r', thUpper: 'ฑ', thLower: 'พ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyT', enUpper: 'T', enLower: 't', thUpper: 'ธ', thLower: 'ะ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'KeyY', enUpper: 'Y', enLower: 'y', thUpper: 'ํ', thLower: 'ั', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'KeyU', enUpper: 'U', enLower: 'u', thUpper: '๊', thLower: 'ี', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
    { code: 'KeyI', enUpper: 'I', enLower: 'i', thUpper: 'ณ', thLower: 'ร', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyO', enUpper: 'O', enLower: 'o', thUpper: 'ฯ', thLower: 'น', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyP', enUpper: 'P', enLower: 'p', thUpper: 'ญ', thLower: 'ย', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'BracketLeft', enUpper: '{', enLower: '[', thUpper: 'ฐ', thLower: 'บ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'BracketRight', enUpper: '}', enLower: ']', thUpper: ',', thLower: 'ล', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Backslash', enUpper: '|', enLower: '\\', thUpper: 'ฅ', thLower: 'ฃ', thClassUpper: 'th-cons', thClassLower: 'th-cons', width: '65px' }
  ],
  [
    { code: 'CapsLock', label: 'Caps', special: true, width: '80px' },
    { code: 'KeyA', enUpper: 'A', enLower: 'a', thUpper: 'ฤ', thLower: 'ฟ', thClassUpper: 'th-vow', thClassLower: 'th-cons' },
    { code: 'KeyS', enUpper: 'S', enLower: 's', thUpper: 'ฆ', thLower: 'ห', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyD', enUpper: 'D', enLower: 'd', thUpper: 'ฏ', thLower: 'ก', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyF', enUpper: 'F', enLower: 'f', thUpper: 'โ', thLower: 'ด', thClassUpper: 'th-vow', thClassLower: 'th-cons' },
    { code: 'KeyG', enUpper: 'G', enLower: 'g', thUpper: 'ฌ', thLower: 'เ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'KeyH', enUpper: 'H', enLower: 'h', thUpper: '็', thLower: '้', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
    { code: 'KeyJ', enUpper: 'J', enLower: 'j', thUpper: '๋', thLower: '่', thClassUpper: 'th-tone', thClassLower: 'th-tone' },
    { code: 'KeyK', enUpper: 'K', enLower: 'k', thUpper: 'ษ', thLower: 'า', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'KeyL', enUpper: 'L', enLower: 'l', thUpper: 'ศ', thLower: 'ส', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Semicolon', enUpper: ':', enLower: ';', thUpper: 'ซ', thLower: 'ว', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Quote', enUpper: '"', enLower: "'", thUpper: '.', thLower: 'ง', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Enter', label: 'Enter', special: true, width: '90px' }
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', special: true, width: '100px' },
    { code: 'KeyZ', enUpper: 'Z', enLower: 'z', thUpper: '(', thLower: 'ผ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyX', enUpper: 'X', enLower: 'x', thUpper: ')', thLower: 'ป', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyC', enUpper: 'C', enLower: 'c', thUpper: 'ฉ', thLower: 'แ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'KeyV', enUpper: 'V', enLower: 'v', thUpper: 'ฮ', thLower: 'อ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'KeyB', enUpper: 'B', enLower: 'b', thUpper: 'ฺ', thLower: 'ิ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
    { code: 'KeyN', enUpper: 'N', enLower: 'n', thUpper: '์', thLower: 'ื', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
    { code: 'KeyM', enUpper: 'M', enLower: 'm', thUpper: '?', thLower: 'ท', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Comma', enUpper: '<', enLower: ',', thUpper: 'ฒ', thLower: 'ม', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'Period', enUpper: '>', enLower: '.', thUpper: 'ฬ', thLower: 'ใ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
    { code: 'Slash', enUpper: '?', enLower: '/', thUpper: 'ฦ', thLower: 'ฝ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
    { code: 'ShiftRight', label: 'Shift', special: true, width: '110px' }
  ],
  [
    { code: 'Space', label: 'Space', special: true, width: '300px' }
  ]
];

// 從 keyboardLayout 自動建立完整雙層 keyMap
const keyMap = { lower: {}, upper: {} };
keyboardLayout.flat().forEach(key => {
    if (!key.special) {
        if (key.thLower) keyMap.lower[key.code] = key.thLower;
        if (key.thUpper) keyMap.upper[key.code] = key.thUpper;
    }
});
keyMap.lower['Space'] = ' ';
keyMap.upper['Space'] = ' ';

// 狀態
let words = [];
let state = {
    word: null,
    targetText: '',
    currentIndex: 0,
    startTime: null,
    errors: 0,
    totalKeystrokes: 0,
    isFinished: false,
    shiftDown: false,
};

// DOM 元素
const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const keyboardContainer = document.getElementById('keyboard');
const textDisplay = document.getElementById('text-display');
const translationDisplay = document.getElementById('translation-display');
const statWpm = document.getElementById('stat-wpm');
const statAccuracy = document.getElementById('stat-accuracy');
const statErrors = document.getElementById('stat-errors');
const resetBtn = document.getElementById('reset-btn');
const hiddenInput = document.getElementById('hidden-input');

async function loadWords() {
    const url = IS_LOCAL ? '/api/words' : 'words.json';
    const res = await fetch(url);
    words = await res.json();
}

function getRandomWord() {
    const pool = words.slice(0, Math.min(300, words.length));
    return pool[Math.floor(Math.random() * pool.length)];
}

function playAudio(wordId) {
    const url = IS_LOCAL ? `/api/audio?id=${wordId}` : `audio/${wordId}.mp3`;
    new Audio(url).play().catch(e => console.error('Audio:', e));
}

function renderKeyboard() {
    keyboardContainer.innerHTML = '';
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';
        row.forEach(keyData => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            if (keyData.special) keyDiv.classList.add('special');
            keyDiv.dataset.code = keyData.code;
            if (keyData.width) keyDiv.style.width = keyData.width;
            if (keyData.special) {
                keyDiv.innerText = keyData.label;
            } else {
                keyDiv.innerHTML = `
                    <span class="en-upper">${keyData.enUpper}</span>
                    <span class="en-lower">${keyData.enLower}</span>
                    <span class="th-upper ${keyData.thClassUpper}">${keyData.thUpper}</span>
                    <span class="th-lower ${keyData.thClassLower}">${keyData.thLower}</span>
                `;
            }
            rowDiv.appendChild(keyDiv);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function renderText() {
    textDisplay.innerHTML = '';
    state.targetText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'char';
        if (index === state.currentIndex) {
            span.classList.add('current');
            highlightKeyHint(char);
        }
        textDisplay.appendChild(span);
    });
    if (state.currentIndex >= state.targetText.length) removeKeyHints();
}

function highlightKeyHint(targetChar) {
    removeKeyHints();
    for (const [code, char] of Object.entries(keyMap.lower)) {
        if (char === targetChar) {
            document.querySelector(`.key[data-code="${code}"]`)?.classList.add('hint');
            return;
        }
    }
    for (const [code, char] of Object.entries(keyMap.upper)) {
        if (char === targetChar) {
            document.querySelector(`.key[data-code="${code}"]`)?.classList.add('hint', 'hint-shift');
            document.querySelectorAll('.key[data-code="ShiftLeft"], .key[data-code="ShiftRight"]')
                .forEach(el => el.classList.add('hint'));
            return;
        }
    }
}

function removeKeyHints() {
    document.querySelectorAll('.key').forEach(el => el.classList.remove('hint', 'hint-shift'));
}

function updateStats() {
    statErrors.innerText = state.errors;
    let accuracy = 100;
    if (state.totalKeystrokes > 0) {
        accuracy = Math.max(0, Math.round(
            ((state.totalKeystrokes - state.errors) / state.totalKeystrokes) * 100
        ));
    }
    statAccuracy.innerText = `${accuracy}%`;
    if (state.startTime && state.currentIndex > 0) {
        const elapsed = (new Date() - state.startTime) / 1000 / 60;
        const wpm = Math.round((state.currentIndex / 5) / elapsed);
        statWpm.innerText = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
    }
}

function handleKeyDown(e) {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        state.shiftDown = true;
        return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space' || e.code === 'Tab') e.preventDefault();

    const keyEl = document.querySelector(`.key[data-code="${e.code}"]`);
    if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 150);
    }

    if (state.isFinished) return;

    const layer = state.shiftDown ? keyMap.upper : keyMap.lower;
    const mappedChar = layer[e.code];
    if (!mappedChar) return;

    if (!state.startTime) state.startTime = new Date();

    state.totalKeystrokes++;
    const targetChar = state.targetText[state.currentIndex];
    const spans = document.querySelectorAll('.char');
    const currentSpan = spans[state.currentIndex];

    if (mappedChar === targetChar) {
        currentSpan.classList.remove('current', 'error');
        currentSpan.classList.add('correct');
        state.currentIndex++;
    } else {
        currentSpan.classList.add('error');
        state.errors++;
        document.body.style.backgroundColor = '#1e1b2e';
        setTimeout(() => document.body.style.backgroundColor = '', 150);
    }

    updateStats();

    if (state.currentIndex >= state.targetText.length) {
        state.isFinished = true;
        playAudio(state.word.id);
        setTimeout(() => initGame(), 2000);
    } else {
        spans[state.currentIndex]?.classList.add('current');
        highlightKeyHint(state.targetText[state.currentIndex]);
    }
}

window.addEventListener('keyup', e => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') state.shiftDown = false;
});

function initGame() {
    if (words.length === 0) return;
    state.word = getRandomWord();
    state.targetText = state.word.thai_word;
    state.currentIndex = 0;
    state.startTime = null;
    state.errors = 0;
    state.totalKeystrokes = 0;
    state.isFinished = false;
    state.shiftDown = false;

    statWpm.innerText = '0';
    statAccuracy.innerText = '100%';
    statErrors.innerText = '0';

    if (translationDisplay) {
        translationDisplay.innerText = `${state.word.chinese} / ${state.word.english}`;
    }

    renderText();
    hiddenInput.value = '';
    hiddenInput.focus();
}

document.addEventListener('click', () => hiddenInput.focus());
window.addEventListener('keydown', handleKeyDown);
resetBtn.addEventListener('click', () => {
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => resetBtn.style.transform = '', 100);
    initGame();
});

renderKeyboard();
loadWords().then(() => initGame());
```

- [ ] **Step 2: Commit**

```bash
git add app.js
git commit -m "feat: rewrite app.js with full Kedmanee keyMap, word loading from DB/JSON"
```

---

## Task 6: 本地測試（python server.py）

**Files:** 無變更，純驗證步驟

- [ ] **Step 1: 啟動本地伺服器**

```powershell
python server.py
```

應看到 pywebview 視窗開啟（若 pywebview 未安裝：`pip install pywebview`）

若要不開視窗純測試，先用簡易方法：
```powershell
python -m http.server 8000
```
然後開瀏覽器前往 `http://localhost:8000`

- [ ] **Step 2: 驗證單字載入**

開啟瀏覽器開發者工具（F12）→ Console，確認無錯誤訊息，且畫面顯示泰文單字和中文/英文翻譯。

- [ ] **Step 3: 驗證打字功能**

按下對應 Kedmanee 按鍵輸入單字，確認：
- 正確輸入：字元變成白色（`.correct`）
- 錯誤輸入：字元變紅並閃爍背景
- 虛擬鍵盤正確高亮顯示下一個要按的鍵
- 需要 Shift 的字元：虛擬鍵盤顯示橘色提示（hint-shift）

- [ ] **Step 4: 驗證音訊播放**

完成一個單字輸入後，確認播放了該單字的音訊（約 1~2 秒後聽到發音）。

---

## Task 7: 建立 build.bat 並打包 run.exe

**Files:**
- Create: `build.bat`

- [ ] **Step 1: 安裝 PyInstaller（若尚未安裝）**

```powershell
pip install pyinstaller
```

- [ ] **Step 2: 建立 build.bat**

建立 `build.bat`，內容如下：
```bat
@echo off
chcp 65001 > nul
echo 正在打包 run.exe...
pyinstaller --onefile --noconsole --name run server.py
echo.
echo 完成！
echo 執行檔位於 dist\run.exe
echo 請將 dist\run.exe 複製到與 thai_words.db 相同的目錄後執行。
pause
```

- [ ] **Step 3: 執行打包**

```powershell
.\build.bat
```

等待 PyInstaller 完成（約 1~3 分鐘）。

- [ ] **Step 4: 測試 run.exe**

```powershell
Copy-Item "thai_words.db" "dist\thai_words.db"
.\dist\run.exe
```

確認：原生視窗開啟，單字正常顯示，打字功能正常，音訊播放正常。

- [ ] **Step 5: Commit**

```bash
git add build.bat
git commit -m "feat: add build.bat for PyInstaller packaging"
```

---

## Task 8: 建立 GitHub Actions 自動部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 建立目錄與 workflow 檔案**

```powershell
New-Item -ItemType Directory -Force ".github\workflows"
```

建立 `.github/workflows/deploy.yml`，內容如下：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for GitHub Pages deployment"
```

- [ ] **Step 3: 在 GitHub repo 設定啟用 Pages**

前往 GitHub repo → Settings → Pages → Source 選擇 **GitHub Actions**。

推送到 main 分支後，Actions 會自動觸發部署。

---

## Task 9: 最終驗證與清理

- [ ] **Step 1: 確認根目錄乾淨**

```powershell
Get-ChildItem -Name
```

預期只有：`index.html`, `app.js`, `style.css`, `server.py`, `words.json`, `audio/`, `export_db.py`, `build.bat`, `.gitignore`, `.github/`, `docs/`, `備份/`, `CLAUDE.md`, `thai_words.db`（本地，不進 git）

- [ ] **Step 2: 確認 .gitignore 生效**

```bash
git status
```

確認 `thai_words.db` 不出現在未追蹤檔案中。

- [ ] **Step 3: 更新 CLAUDE.md**

在 `CLAUDE.md` 的「命令」區塊加入：
```markdown
## 常用命令

### 本地開發
python server.py          # 啟動本地伺服器（pywebview 視窗）
python -m http.server 8000  # 純靜態伺服器（用瀏覽器測試）

### 資料匯出（DB 有更新時執行）
python export_db.py       # 重新產生 words.json 和 audio/

### 打包桌面版
build.bat                 # 產生 dist/run.exe（需 PyInstaller）
```

- [ ] **Step 4: 最終 Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new commands"
```

---

## 自我審查

**Spec 覆蓋檢查：**
- ✅ GitHub Pages 部署 → Task 8
- ✅ run.exe 本地桌面 → Task 7
- ✅ 資料來自 thai_words.db → Task 2（匯出）+ Task 3（API）
- ✅ 不使用 Google TTS → server.py 移除所有 TTS 下載邏輯
- ✅ 音訊按需下載 → app.js `playAudio()` 在完成單字後才觸發
- ✅ 搬移備份檔案 → Task 1
- ✅ 完整 Kedmanee keyMap + Shift → Task 5
- ✅ 翻譯顯示 → Task 4

**型別/名稱一致性：**
- `playAudio(wordId)` 在 Task 5 定義，Task 5 內呼叫 ✅
- `getRandomWord()` 回傳 word 物件，`initGame()` 使用 `state.word.id`、`state.word.thai_word` ✅
- `keyMap.lower` / `keyMap.upper` 在 `handleKeyDown` 和 `highlightKeyHint` 兩處使用一致 ✅
- `hint-shift` class 在 Task 4 CSS 定義，Task 5 JS 使用 ✅
