$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$logDir = Join-Path $env:TEMP "opencode"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

function Log($msg) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
  Add-Content -Path (Join-Path $logDir "keeper.log") -Value $line
  Write-Host $line
}

function IsListening($port) {
  return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

Log "keeper started (backend 5000 / dev 5173)"

while ($true) {
  try {
    if (-not (IsListening 5000)) {
      Log "starting backend"
      Start-Process -FilePath "$backendDir\start-backend.cmd" -WindowStyle Hidden
      Start-Sleep -Seconds 2
    }
    if (-not (IsListening 5173)) {
      Log "starting vite dev"
      Start-Process -FilePath "$backendDir\start-dev.cmd" -WindowStyle Hidden
      Start-Sleep -Seconds 2
    }
  } catch {
    Log "keeper error: $_"
  }
  Start-Sleep -Seconds 10
}