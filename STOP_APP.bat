@echo off
title Eagle Tailors - Stop All Services
color 0C

echo.
echo ============================================================
echo     EAGLE TAILORS - STOPPING ALL SERVICES
echo ============================================================
echo.

:: Kill processes on port 3000 (Frontend)
echo Stopping Frontend (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
    echo   Stopped process %%a
)

:: Kill processes on port 3001 (Backend)
echo.
echo Stopping Backend (Port 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
    echo   Stopped process %%a
)

echo.
echo ============================================================
echo     ALL SERVICES STOPPED
echo ============================================================
echo.
echo Note: PostgreSQL database is still running (not stopped)
echo.
pause
