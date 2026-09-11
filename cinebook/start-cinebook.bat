@echo off
title CineBook - Movie Ticket Booking System
color 0C

echo ==========================================================
echo    CINEBOOK - PREMIUM MOVIE TICKET BOOKING SYSTEM
echo ==========================================================
echo.

REM Locate Cinebook Directory
set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%cinebook\package.json" (
    set "PROJECT_DIR=%PROJECT_DIR%cinebook"
)

cd /d "%PROJECT_DIR%"
echo Working Directory: %PROJECT_DIR%
echo.

REM Check dependencies
if not exist "node_modules" (
    echo [1/3] Installing dependencies... Please wait.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies. Please verify Node.js and npm.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

REM Start Angular Dev Server
echo [1/3] Starting CineBook Angular Development Server on http://localhost:4200...
echo.

start "CineBook Angular Server" cmd /k "npx ng serve --port 4200 --open=false"

REM Wait for server to become responsive
echo [2/3] Waiting for CineBook server to be ready...
powershell -Command "$ready = $false; for ($i=0; $i -lt 40; $i++) { try { $res = Invoke-WebRequest -Uri 'http://localhost:4200' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if ($res.StatusCode -eq 200) { $ready = $true; break } } catch { Start-Sleep -Seconds 1 } }; if (-not $ready) { Write-Host 'Launching browser...' }"

echo [3/3] Opening CineBook in Full-Screen Cinematic Mode...

REM Try Microsoft Edge Fullscreen mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --start-fullscreen "http://localhost:4200"
    goto RUNNING
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --start-fullscreen "http://localhost:4200"
    goto RUNNING
)

REM Try Google Chrome Fullscreen mode
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:4200"
    goto RUNNING
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:4200"
    goto RUNNING
)

REM Fallback to default browser
start "" "http://localhost:4200"

:RUNNING
echo.
echo ==========================================================
echo    CINEBOOK IS RUNNING AT: http://localhost:4200
echo    Full-screen browser window has been launched!
echo ==========================================================
echo.
echo  * Tip: Press F11 in your browser anytime to toggle full-screen.
echo  * To stop CineBook, close the "CineBook Angular Server" window.
echo.
pause
