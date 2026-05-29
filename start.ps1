$root = $PSScriptRoot

Start-Process powershell -ArgumentList "-NoExit", "-File", "$root\start-backend.ps1" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-File", "$root\start-frontend.ps1" -WindowStyle Normal

Write-Host "Launching..."
Write-Host "  Backend  -> http://localhost:8000"
Write-Host "  Frontend -> http://localhost:5173"
