# Run PatientCare Development Server
Write-Host "🚀 Starting PatientCare Development Server" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Add Node.js to PATH for this session
$env:PATH += ";C:\Program Files\nodejs"

# Check if Node.js is available
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from: https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = & npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies if needed..." -ForegroundColor Yellow

# Install root dependencies
if (Test-Path "package.json") {
    & npm install
}

# Install frontend dependencies
if (Test-Path "frontend/package.json") {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    & npm install
    Set-Location ..
}

# Install backend dependencies
if (Test-Path "backend/package.json") {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    & npm install
    Set-Location ..
}

Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start the development server
& npm run dev