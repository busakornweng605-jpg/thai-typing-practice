# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

本專案同時支援 Claude Code 與 Codex。共通的專案架構、執行方式與維護規範請以 `AGENTS.md` 為準，避免兩份工具指引內容分叉。

## 快速啟動

```powershell
# 靜態模式：等同 GitHub Pages，音訊來自 audio/
.\start-codex.ps1 -Port 8000

# API 模式：需 thai_words.db，不開桌面視窗
.\start-codex.ps1 -Api -Port 8000

# 桌面視窗模式：需 pywebview + thai_words.db
python server.py

# 建置 GitHub Pages / 本機靜態輸出
python build_pages.py
```

## Claude Code 注意事項

- 使用 PowerShell 指令與 Windows 路徑。
- 優先保持 Vanilla JS、無建置流程、無前端框架。
- 修改專案規則時，先更新 `AGENTS.md`，再讓本檔保持簡短引用。
