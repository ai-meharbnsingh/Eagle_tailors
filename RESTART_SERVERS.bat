@echo off
echo ========================================
echo Eagle Tailors - Restarting Servers
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server...
start "Eagle Tailors Backend" cmd /k "cd /d D:\Amit_Jiju\Eagle_taliors\backend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Eagle Tailors Frontend" cmd /k "cd /d D:\Amit_Jiju\Eagle_taliors\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Opening Browser...
start http://localhost:3000

echo.
echo ========================================
echo Servers Started & Browser Opened!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Both servers are now running in separate windows.
echo The browser should open automatically.
echo Close the server windows to stop the servers.
echo.
pause
