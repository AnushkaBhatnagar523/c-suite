@echo off
setlocal

echo 🚀 Starting C-Suite Project...

:: Add Node.js to PATH if it exists in the default location
if exist "C:\Program Files\nodejs" (
    set "PATH=%PATH%;C:\Program Files\nodejs"
)

:: Check if node is available
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo 📦 Starting Backend Server...
start "C-Suite Backend" cmd /k "cd backend && npm start"

echo ⏳ Waiting for server to initialize...
timeout /t 5 /nobreak >nul

echo 🌐 Opening Frontend...
start index.html
start admin.html

echo ✅ Project is running!
echo Backend: http://localhost:5000
echo Frontend: index.html
echo Admin: admin.html
