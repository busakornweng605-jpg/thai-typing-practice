# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 專案概述

泰文 Kedmanee 鍵盤打字練習應用，支援 44 個子音、母音、子音+母音、子音+母音+聲調，以及 1000 個常用單字練習。前端是純靜態 Vanilla JS；本地桌面版使用 Python `server.py` + pywebview。

**Codex 建議開啟方式：** 使用靜態伺服器，不直接用 `file://` 開啟，避免 `fetch('words.json')` 受瀏覽器限制。

```powershell
# 靜態模式：GitHub Pages 同等路徑，音訊來自 audio/
.\start-codex.ps1 -Port 8000

# API 模式：使用 thai_words.db，且不開啟桌面視窗
.\start-codex.ps1 -Api -Port 8000
```

## 架構

主要檔案：

- **`index.html`** — 靜態骨架，鍵盤區 (`#keyboard`) 和文字區 (`#text-display`) 由 JS 動態填充
- **`app.js`** — 所有邏輯：鍵盤映射、遊戲狀態、渲染、事件處理、TTS
- **`style.css`** — Glassmorphism 深色主題，使用 CSS 變數
- **`words.json`** — GitHub Pages/靜態模式使用的單字資料
- **`audio/`** — 靜態模式使用的單字與字元 MP3
- **`server.py`** — 本地 API + pywebview 桌面版；`--serve-only` 可給 Codex/CI 無 GUI 測試
- **`start-codex.ps1`** — Codex 友善的 PowerShell 啟動腳本

### `app.js` 核心資料結構

| 名稱 | 說明 |
|------|------|
| `keyboardLayout` | 5列完整 Kedmanee 鍵盤資料（含英文/泰文上下層字元、CSS class 類別）|
| `keyMap` | `event.code` → 泰文字元（lower/upper 兩層 + Space）|
| `LESSON_CONFIG` | 5 個課程的標題與說明 |
| `words` | 單字資料，優先從 `/api/words` 載入，失敗則 fallback 到 `words.json` |
| `state` | 遊戲狀態物件（targetText、currentIndex、startTime、errors、totalKeystrokes、isFinished）|

### 鍵盤字元顏色規則（CSS class）
- `th-cons` → 黃色（子音）
- `th-vow` → 紅色（母音）
- `th-tone` → 綠色（聲調符號）

### 事件流程
1. `window keydown` → `handleKeyDown()` — 對照 `keyMap`，更新 `state`，更新 DOM
2. 正確輸入字元 → 播放本地字元音訊或 API 音訊
3. 完成單字 → 播放完整單字音訊，更新輪次進度

### TTS
靜態模式會使用 `audio/` 內的 MP3，課程 3-4 可能 fallback 到 `translate.googleapis.com` 的非官方 TTS 端點。API 模式會透過 `server.py` 代理 TTS，離線時自動停用以避免逾時。

## 擴展重點

新增課程：更新 `LESSON_CONFIG` 與對應的出題/輪次邏輯。
新增鍵盤映射：同步更新 `keyMap`（輸入邏輯）和 `keyboardLayout`（視覺顯示）。

## Codex 工作規範

- 預設使用繁體中文回覆。
- Shell 指令使用 PowerShell 語法與 Windows 路徑。
- 優先做小而直接的改動，不引入建置流程或前端框架。
- `thai_words.db`、`dist/`、`build/`、備份與音訊暫存資料不應提交。
- 測試靜態頁面時先用 `.\start-codex.ps1 -Port 8000`；需要 API/DB 行為時用 `.\start-codex.ps1 -Api -Port 8000`。

## 常用命令

### 本地開發
```powershell
# 靜態測試（GitHub Pages 模式，音訊來自 audio/ 資料夾）
.\start-codex.ps1 -Port 8000

# API 測試（不開桌面視窗，需 thai_words.db）
.\start-codex.ps1 -Api -Port 8000

# 桌面視窗模式（需 pywebview + thai_words.db）
python server.py
```

### 資料匯出（DB 有更新時執行）
```powershell
# 匯出單字資料
python export_db.py

# 下載字元音訊（首次或新增字元時）
python export_char_audio.py

# 匯入課程一/二音訊到 DB；課程三/四可用 --with-combos 預先抓取
python import_lesson_audio.py

# 完整離線靜態版：產生課程三/四 combo_*.mp3
python import_lesson_audio.py --with-combos --export-combo-files

# 建置 GitHub Pages / 本機靜態輸出
python build_pages.py
```

### 打包桌面版
```bat
build.bat    # 產生 dist/run.exe（需安裝 PyInstaller：pip install pyinstaller）
```

### GitHub Pages 部署
推送到 master 分支後，GitHub Actions 自動部署。
需在 GitHub repo Settings → Pages → Source 選擇 GitHub Actions。
