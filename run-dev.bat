@echo off
echo 🚀 Starting PatientCare Development Server
echo =========================================
echo.

:: Add Node.js to PATH for this session
set "PATH=%PATH%;C:\Program Files\nodejs"

:: Check Node.js
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

:: Install dependencies if needed
echo 📦 Installing dependencies...
if exist "package.json" npm install

if exist "frontend\package.json" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

if exist "backend\package.json" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

echo.
echo 🚀 Starting development servers...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
echo Press Ctrl+C to stop the servers
echo.

:: Start development server
npm run dev