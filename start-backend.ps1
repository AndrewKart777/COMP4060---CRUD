$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$root\backend"

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env - update DATABASE_URL before continuing."
}

if (-not (Test-Path .venv)) {
    Write-Host "Creating virtual environment..."
    python -m venv .venv
}

.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt -q
uvicorn app.main:app --reload
