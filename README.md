# 泰文輸入練習 Thai Typing Practice

泰文 Kedmanee 鍵盤打字練習應用，支援 **GitHub Pages 線上版** 及 **本地桌面版（run.exe）** 兩種執行模式。

🌐 **線上版：** https://busakornweng605-jpg.github.io/thai-typing-practice/

---

## 功能特色

- 從 1000 個常用泰文單字中隨機出題
- 顯示泰文單字、繁體中文、英文翻譯
- 完整 Kedmanee 雙層鍵盤佈局（含 Shift 上層字元）
- 虛擬鍵盤即時高亮提示下一個要按的按鍵
- 需要 Shift 的字元顯示橘色提示
- **逐字元發音**：每按對一個子音/母音/聲調即播放該字元音訊
- **單字發音**：全部輸入正確後播放完整單字音訊
- 打字速度（WPM）、正確率、錯誤數即時統計

---

## 執行方式

### GitHub Pages（線上，無需安裝）

直接開啟瀏覽器前往：

```
https://busakornweng605-jpg.github.io/thai-typing-practice/
```

- 純靜態托管，無後端
- 音訊按需載入（`audio/{id}.mp3`、`audio/char_{hex}.mp3`）

### 本地桌面版（run.exe）

1. 下載 `dist/run.exe` 與 `thai_words.db`，放在同一目錄
2. 雙擊 `run.exe` 執行

```
任意目錄/
├── run.exe
└── thai_words.db
```

- 完全離線可用
- 使用 pywebview 開啟原生視窗（內嵌 Edge/WebView2）
- 音訊直接從 `thai_words.db` BLOB 讀取，字元音訊已打包進 exe

### 本地開發（瀏覽器測試）

```powershell
# 靜態模式（音訊來自 audio/ 資料夾）
python -m http.server 8000
# 開啟 http://localhost:8000

# 桌面視窗模式（需 thai_words.db）
python server.py
```

---

## 專案結構

```
專案根目錄/
├── index.html              # 主頁面
├── app.js                  # 核心邏輯（鍵盤映射、遊戲狀態、音訊）
├── style.css               # Glassmorphism 深色主題
├── words.json              # 1000 個單字資料（由 export_db.py 產生）
├── audio/
│   ├── 1.mp3 … 1000.mp3    # 單字音訊（按 id 命名）
│   └── char_0e01.mp3 …     # 字元音訊（81 個，Unicode hex 命名）
├── server.py               # 本地 HTTP server + pywebview
├── export_db.py            # 從 thai_words.db 匯出 words.json 和 audio/
├── export_char_audio.py    # 從 Google TTS 下載字元音訊（一次性）
├── build.bat               # PyInstaller 打包腳本
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 自動部署
├── thai_words.db           # 本地資料庫（不進 git）
├── .gitignore
└── 備份/                   # 舊版檔案備份
```

---

## 資料庫結構

`thai_words.db`（SQLite，1000 筆）：

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵 |
| rank | INTEGER | 排序（1 = 最常用）|
| thai_word | TEXT | 泰文單字 |
| kbd_seq | TEXT | 鍵盤序列（Kedmanee）|
| chinese | TEXT | 繁體中文翻譯 |
| english | TEXT | 英文翻譯 |
| audio | BLOB | MP3 音訊資料 |

`kbd_seq` 格式範例：`【gxHo】`  
→ `g`=เ, `x`=ป, `H`=Shift+H=็, `o`=น → **เป็น**（大寫表示需按 Shift）

---

## 鍵盤佈局

Kedmanee 標準鍵盤（雙層）：

- **黃色** — 子音（th-cons）
- **紅色** — 母音（th-vow）
- **綠色** — 聲調符號（th-tone）

---

## 開發工具

### 匯出資料（DB 有更新時執行）

```powershell
python export_db.py
# 產生 words.json 和 audio/1.mp3 … audio/1000.mp3
```

### 下載字元音訊（首次或新增字元時）

```powershell
python export_char_audio.py
# 從 Google TTS 下載 81 個字元音訊到 audio/char_*.mp3
```

### 打包桌面版

```powershell
# 需先安裝 PyInstaller
pip install pyinstaller

.\build.bat
# 產生 dist/run.exe
```

---

## 部署

推送到 `master` 分支後，GitHub Actions 自動部署至 GitHub Pages。

首次設定：GitHub repo → Settings → Pages → Source 選擇 **GitHub Actions**。

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 前端 | Vanilla JS、HTML5、CSS3 |
| 後端（本地）| Python 3、sqlite3、http.server |
| 桌面視窗 | pywebview（WebView2）|
| 打包 | PyInstaller |
| 部署 | GitHub Pages + GitHub Actions |
| 字型 | Sarabun（Google Fonts）|

---

## 系統需求

### GitHub Pages 版
- 現代瀏覽器（Chrome、Edge、Firefox、Safari）

### 桌面版（run.exe）
- Windows 10/11（需安裝 WebView2 Runtime，Edge 內建已含）

### 本地開發
- Python 3.8+
- `pip install pywebview pyinstaller`
