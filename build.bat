@echo off
chcp 65001 > nul
echo 正在打包 run.exe...
pyinstaller --onefile --noconsole --name run ^
  --icon "泰文鍵盤練習.ico" ^
  --add-data "index.html;." ^
  --add-data "app.js;." ^
  --add-data "style.css;." ^
  --add-data "char_audio;audio" ^
  --add-data "泰文鍵盤練習.ico;." ^
  server.py
echo.
echo 完成！
echo 執行檔位於 dist\run.exe
echo 請將 dist\run.exe 複製到與 thai_words.db 相同的目錄後執行。
pause
