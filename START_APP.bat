@echo off
title Eagle Tailors - Application Starter
color 0A

echo.
echo ============================================================
echo        EAGLE TAILORS - DIGITIZATION SYSTEM
echo        Starting All Services...
echo ============================================================
echo.

cd /d "%~dp0"

:: ============================================================
:: Step 1: Check PostgreSQL
:: ============================================================
echo [1/5] Checking PostgreSQL...
set PG_FOUND=0

:: Try to find and start PostgreSQL service
for %%s in (postgresql-x64-18 postgresql-x64-17 postgresql-x64-16 postgresql-x64-15 postgresql) do (
    sc query "%%s" >nul 2>&1
    if not errorlevel 1 (
        set PG_FOUND=1
        sc query "%%s" | find "RUNNING" >nul 2>&1
        if errorlevel 1 (
            echo       Starting PostgreSQL [%%s]...
            net start "%%s" >nul 2>&1
        ) else (
            echo       PostgreSQL is running [%%s]
        )
        goto :pg_check_done
    )
)

:pg_check_done
if %PG_FOUND%==0 (
    color 0C
    echo.
    echo       [ERROR] PostgreSQL service not found!
    echo       Please make sure PostgreSQL is installed.
    echo       The application requires PostgreSQL to work.
    echo.
    echo       Press any key to continue anyway...
    pause >nul
    color 0A
)

timeout /t 2 /nobreak >nul

:: ============================================================
:: Step 2: Clean up old processes
:: ============================================================
echo.
echo [2/5] Stopping old processes on ports 3000 and 3001...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000.*LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001.*LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo       Done

:: ============================================================
:: Step 3: Check/Install dependencies
:: ============================================================
echo.
echo [3/5] Checking dependencies...

if not exist "backend\node_modules\express" (
    echo       Installing backend dependencies...
    cd /d "%~dp0backend"
    call npm install --silent
    cd /d "%~dp0"
    echo       Backend dependencies installed
) else (
    echo       Backend dependencies OK
)

if not exist "frontend\node_modules\vite" (
    echo       Installing frontend dependencies...
    cd /d "%~dp0frontend"
    call npm install --silent
    cd /d "%~dp0"
    echo       Frontend dependencies installed
) else (
    echo       Frontend dependencies OK
)

:: ============================================================
:: Step 4: Start Backend
:: ============================================================
echo.
echo [4/5] Starting Backend Server (Port 3001)...
cd /d "%~dp0backend"
start "Eagle Tailors - BACKEND (Port 3001)" cmd /k "color 0B && title Eagle Tailors - BACKEND && npm run dev"
cd /d "%~dp0"

:: Wait for backend
timeout /t 3 /nobreak >nul

:: ============================================================
:: Step 5: Start Frontend
:: ============================================================
echo.
echo [5/5] Starting Frontend Server (Port 3000)...
cd /d "%~dp0frontend"
start "Eagle Tailors - FRONTEND (Port 3000)" cmd /k "color 0E && title Eagle Tailors - FRONTEND && npm run dev"
cd /d "%~dp0"

:: Wait for frontend
timeout /t 4 /nobreak >nul

:: ============================================================
:: Done!
:: ============================================================
echo.
echo ============================================================
echo        ALL SERVICES STARTED SUCCESSFULLY!
echo ============================================================
echo.
echo        Frontend:  http://localhost:3000
echo        Backend:   http://localhost:3001
echo        Database:  PostgreSQL (port 5432)
echo.
echo        Two terminal windows are now running:
echo          - BACKEND (Blue window) - Keep open!
echo          - FRONTEND (Yellow window) - Keep open!
echo.
echo        DO NOT close those windows while using the app.
echo.
echo ============================================================
echo        Press any key to open browser...
echo ============================================================
pause >nul

start "" "http://localhost:3000"
exit
