param(
    [int]$Port = 8000,
    [switch]$Api
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if ($Api) {
    python .\server.py --serve-only --port $Port
} else {
    python -m http.server $Port
}
