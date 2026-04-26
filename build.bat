@echo off
chcp 65001 > nul
echo 正在打包 run.exe...
pyinstaller --onefile --noconsole --name run server.py
echo.
echo 完成！
echo 執行檔位於 dist\run.exe
echo 請將 dist\run.exe 複製到與 thai_words.db 相同的目錄後執行。
pause
