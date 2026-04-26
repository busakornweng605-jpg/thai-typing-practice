@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo 正在啟動泰文輸入練習伺服器...
python server.py
pause
