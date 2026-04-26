# 泰文輸入練習 改版設計規格

**日期：** 2026-04-26  
**狀態：** 已核准

---

## 目標

1. 可部署至 GitHub Pages（純靜態）
2. 本地執行 `run.exe` 開啟原生視窗，不需瀏覽器
3. 資料來源：`thai_words.db`（1000 個泰文單字，含音訊 BLOB）
4. 不使用 Google Translate TTS
5. 音訊按需下載（使用者練習到該字才取得音檔）

---

## 資料庫結構

```
thai_words (1000 筆)
  id          INTEGER  PRIMARY KEY
  rank        INTEGER  排序（1=最常用）
  thai_word   TEXT     泰文單字
  kbd_seq     TEXT     鍵盤序列，格式【sequence】，大寫=Shift
  chinese     TEXT     繁體中文翻譯
  english     TEXT     英文翻譯
  audio       BLOB     MP3 音訊資料（1000 筆全有）
```

`kbd_seq` 範例：`【gxHo】` → g=เ, x=ป, H=Shift+H=็, o=น → เป็น

---

## 檔案結構

```
根目錄/
├── index.html          # 微調（移除 Kanit 字型，改 Sarabun）
├── app.js              # 全面改寫
├── style.css           # 不變
├── words.json          # 由 export_db.py 產生，加入 git
├── audio/              # 由 export_db.py 產生，加入 git（~9MB）
│   ├── 1.mp3           # id 對應 thai_words.id
│   └── ...
├── server.py           # 改寫（移除 TTS 下載，改為 DB API）
├── export_db.py        # 一次性匯出腳本（不加入 git）
├── build.bat           # PyInstaller 打包腳本
├── thai_words.db       # 加入 .gitignore（僅本地使用）
├── .gitignore
└── 備份/
    ├── 課程內容.json
    ├── 啟動.bat
    ├── server.log
    └── VoiceData/
```

---

## 兩種執行環境

### GitHub Pages（靜態）

```
使用者開啟網頁
  → fetch('words.json')         → 載入 1000 個單字
  → 隨機抽字出題
  → fetch('audio/{id}.mp3')    → 使用者答對該字時才下載音檔
```

- 無後端，純靜態托管
- 音檔按需載入，首次開啟 < 100KB
- 無 Google Translate 依賴

### run.exe（本地桌面）

```
執行 run.exe
  → Python HTTP server 在 port 8000 啟動
  → pywebview 開原生視窗（內嵌 Edge/WebView2）

前端請求
  → GET /api/words              → Python 查 DB 回傳全部單字 JSON
  → GET /api/audio?id=1         → Python 讀 DB BLOB 回傳 MP3
```

- 完全離線可用
- 音訊從 DB BLOB 即時提供，無需 `audio/` 資料夾
- `thai_words.db` 與 `run.exe` 放在同一目錄

---

## 前端環境偵測

```javascript
const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

async function loadWords() {
    const url = IS_LOCAL ? '/api/words' : 'words.json';
    const res = await fetch(url);
    return res.json();
}

function playAudio(wordId) {
    const url = IS_LOCAL ? `/api/audio?id=${wordId}` : `audio/${wordId}.mp3`;
    new Audio(url).play();
}
```

---

## app.js 核心改變

### 完整 keyMap（Kedmanee 雙層）

從現有 `keyboardLayout` 自動建立，涵蓋全鍵盤：

```javascript
const keyMap = { lower: {}, upper: {} };
keyboardLayout.forEach(row => row.forEach(key => {
    if (!key.special) {
        if (key.thLower) keyMap.lower[key.code] = key.thLower;
        if (key.thUpper) keyMap.upper[key.code] = key.thUpper;
    }
}));
keyMap.lower['Space'] = ' ';
```

### Shift 狀態追蹤

```javascript
let shiftDown = false;
window.addEventListener('keydown', e => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftDown = true;
});
window.addEventListener('keyup', e => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') shiftDown = false;
});
```

### 出題邏輯

- 啟動時從 `words.json` / `/api/words` 載入全部單字
- 每回合從 1000 個單字中隨機抽取（可依 `rank` 加權，常用字出現頻率高）
- 顯示泰文字、中文翻譯、英文翻譯
- 使用者按 Kedmanee 對應按鍵輸入，逐字比對

### 音訊播放時機

- 使用者正確輸入整個單字後播放該單字音訊
- 呼叫 `playAudio(word.id)`

---

## server.py 改寫

移除舊有 TTS 下載邏輯，新增兩個 API 端點：

```
GET /api/words
  → SELECT id, rank, thai_word, kbd_seq, chinese, english FROM thai_words ORDER BY rank
  → 回傳 JSON array

GET /api/audio?id=1
  → SELECT audio FROM thai_words WHERE id=1
  → 回傳 audio/mpeg BLOB
  → Cache-Control: max-age=86400
```

靜態檔案服務與 pywebview 邏輯維持不變。

---

## export_db.py 功能

執行一次，產生 GitHub Pages 所需的靜態資源：

```
python export_db.py
  → words.json      （不含 audio BLOB，欄位：id, rank, thai_word, kbd_seq, chinese, english）
  → audio/1.mp3
  → audio/2.mp3
  → ...（1000 個）
```

---

## build.bat 功能

```bat
pyinstaller --onefile --noconsole --name run server.py
```

產生 `dist/run.exe`，與 `thai_words.db` 放在同一目錄即可執行。

---

## .gitignore

```
thai_words.db
dist/
build/
*.spec
__pycache__/
```

> `export_db.py` 和 `build.bat` 保留在 repo 中，供開發者重新產生資源或打包使用。

---

## 搬移至備份的檔案

| 檔案 | 原因 |
|---|---|
| `課程內容.json` | 自由練習模式不需要課程結構 |
| `啟動.bat` | 由 `run.exe` 取代 |
| `server.log` | 空白，無用 |
| `VoiceData/` | 音檔改從 DB 提供，不再快取 Google TTS |
