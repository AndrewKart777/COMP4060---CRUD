$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$root\frontend"

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

npm install --silent
npm run dev
