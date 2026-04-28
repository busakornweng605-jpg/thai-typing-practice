# 建立桌面捷徑（明確指定 icon，避免 Windows 快取問題）
# 用法：右鍵此檔 → 用 PowerShell 執行；或在 PowerShell 中：
#   powershell -ExecutionPolicy Bypass -File "建立桌面捷徑.ps1"

$ErrorActionPreference = 'Stop'

# 路徑（請保持本檔位於專案根目錄）
$ProjectDir  = $PSScriptRoot
$ExePath     = Join-Path $ProjectDir 'dist\run.exe'
$IconPath    = Join-Path $ProjectDir '泰文鍵盤練習.ico'
$DbPath      = Join-Path $ProjectDir 'thai_words.db'

# 檢查必要檔案
if (-not (Test-Path $ExePath))  { Write-Host "[ERROR] 找不到 $ExePath，請先執行 build.bat" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $IconPath)) { Write-Host "[ERROR] 找不到 $IconPath" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $DbPath))   { Write-Host "[WARN]  找不到 $DbPath，EXE 將無法載入單字資料" -ForegroundColor Yellow }

# 確保 dist/ 同層也有 thai_words.db（EXE 從同目錄讀取）
$DbInDist = Join-Path $ProjectDir 'dist\thai_words.db'
if ((Test-Path $DbPath) -and -not (Test-Path $DbInDist)) {
    Copy-Item $DbPath $DbInDist
    Write-Host "[OK]   複製 thai_words.db 到 dist\" -ForegroundColor Green
}

# 建立捷徑
$Desktop      = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop '泰文鍵盤練習.lnk'

# 若舊捷徑存在先刪掉（避免 icon 快取殘留）
if (Test-Path $ShortcutPath) {
    Remove-Item $ShortcutPath -Force
    Write-Host "[INFO] 已移除舊捷徑" -ForegroundColor Cyan
}

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath       = $ExePath
$Shortcut.WorkingDirectory = (Split-Path $ExePath -Parent)
$Shortcut.IconLocation     = "$IconPath, 0"   # 0 = 第一張 icon
$Shortcut.Description      = '泰文 Kedmanee 鍵盤練習'
$Shortcut.Save()

Write-Host "[OK]   桌面捷徑已建立：$ShortcutPath" -ForegroundColor Green
Write-Host "       Target  : $ExePath"
Write-Host "       Icon    : $IconPath"
Write-Host "       WorkDir : $(Split-Path $ExePath -Parent)"

# 強制刷新 Windows icon 快取
Write-Host ""
Write-Host "[INFO] 正在刷新 Windows icon 快取..." -ForegroundColor Cyan
ie4uinit.exe -show 2>$null
Start-Sleep -Milliseconds 500
# 觸發 Explorer 重新讀取 icon
$Shell = New-Object -ComObject Shell.Application
$null  = $Shell.Namespace($Desktop)
Write-Host "[OK]   完成。若 icon 仍未更新，可重啟 explorer.exe（工作管理員 → 結束 → 重新執行）" -ForegroundColor Green
