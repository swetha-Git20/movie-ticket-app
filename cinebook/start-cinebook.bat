@echo off
title CineBook - Movie Ticket Booking Application
color 0A

echo ============================================
echo    CineBook - Movie Ticket Booking App
echo ============================================
echo.
echo Starting CineBook application...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if node_modules exists, if not run npm install
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing dependencies. Please check npm installation.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start Angular development server
echo Starting Angular development server...
echo The application will be available at http://localhost:4200
echo.
echo Please wait while the server starts...
echo.

REM Start ng serve in background
start "CineBook Server" cmd /k "ng serve"

REM Wait for server to start (simple wait)
ping 127.0.0.1 -n 15 > nul

REM Open browser
echo Opening browser...
start "" http://localhost:4200

echo.
echo ============================================
echo CineBook is running at http://localhost:4200
echo ============================================
echo.
echo The server is running in a separate window.
echo To stop the server, close the "CineBook Server" window.
echo.
pause
