# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

泰文 Kedmanee 鍵盤打字練習應用，目前專注於首列 (Home Row)。純靜態前端，無建置流程、無相依套件、無框架。

**開啟方式：** 直接用瀏覽器開啟 `index.html`，或用任何靜態伺服器。

```powershell
# 使用 Python 開啟本地伺服器
python -m http.server 8080
# 或使用 Node.js
npx serve .
```

## 架構

三個檔案，全部邏輯在 `app.js`：

- **`index.html`** — 靜態骨架，鍵盤區 (`#keyboard`) 和文字區 (`#text-display`) 由 JS 動態填充
- **`app.js`** — 所有邏輯：鍵盤映射、遊戲狀態、渲染、事件處理、TTS
- **`style.css`** — Glassmorphism 深色主題，使用 CSS 變數

### `app.js` 核心資料結構

| 名稱 | 說明 |
|------|------|
| `THAI_CHARS` | 首列8個泰文字元 |
| `keyMap` | `event.code` → 泰文字元（僅首列 + Space）|
| `keyboardLayout` | 5列完整鍵盤資料（含英文/泰文上下層字元、CSS class 類別）|
| `LESSON_EXERCISES` | 6條預設練習句 |
| `state` | 遊戲狀態物件（targetText、currentIndex、startTime、errors、totalKeystrokes、isFinished）|

### 鍵盤字元顏色規則（CSS class）
- `th-cons` → 黃色（子音）
- `th-vow` → 紅色（母音）
- `th-tone` → 綠色（聲調符號）

### 事件流程
1. `window keydown` → `handleKeyDown()` — 對照 `keyMap`，更新 `state`，更新 DOM
2. 正確輸入字元 → `speakThaiWord()` 播放 Google TTS
3. 完成整句 → 1500ms 後自動呼叫 `initGame()` 重置

### TTS
使用 `translate.googleapis.com` 的非官方 TTS 端點，無 API Key 需求，但可能受 CORS 或網路限制。

## 擴展重點

新增課程：在 `LESSON_EXERCISES` 陣列新增字串，並更新 `keyMap` 以支援新字元。
新增鍵盤映射：同步更新 `keyMap`（輸入邏輯）和 `keyboardLayout`（視覺顯示）。

## 常用命令

### 本地開發
```powershell
# 靜態測試（GitHub Pages 模式，音訊來自 audio/ 資料夾）
python -m http.server 8000

# 桌面視窗模式（需 pywebview + thai_words.db）
python server.py
```

### 資料匯出（DB 有更新時執行）
```powershell
# 匯出單字資料
python export_db.py

# 下載字元音訊（首次或新增字元時）
python export_char_audio.py
```

### 打包桌面版
```bat
build.bat    # 產生 dist/run.exe（需安裝 PyInstaller：pip install pyinstaller）
```

### GitHub Pages 部署
推送到 main 分支後，GitHub Actions 自動部署。
需在 GitHub repo Settings → Pages → Source 選擇 GitHub Actions。
