$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Building dist\run.exe ..."

python -m PyInstaller `
    --onefile `
    --noconsole `
    --clean `
    --name run `
    --icon "泰文鍵盤練習.ico" `
    --add-data "index.html;." `
    --add-data "app.js;." `
    --add-data "style.css;." `
    --add-data "thai_words.db;." `
    --add-data "泰文鍵盤練習.ico;." `
    server.py

Write-Host ""
Write-Host "Done: dist\run.exe"
Write-Host "run.exe includes thai_words.db; no external .db file is required."
