@echo off
echo ========================================
echo Eagle Tailors - Quick Start
echo ========================================
echo.

echo This will start the Eagle Tailors application.
echo.
echo Requirements Check:
echo.

REM Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js - NOT INSTALLED
    echo     Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js - Installed
)

REM Check PostgreSQL
psql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] PostgreSQL - NOT FOUND
    echo.
    echo PostgreSQL is required to run this application.
    echo.
    echo OPTIONS:
    echo 1. Install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo 2. Use SQLite version (lightweight, no installation needed)
    echo.
    set /p choice="Choose option (1 or 2): "

    if "!choice!"=="2" (
        echo.
        echo Switching to SQLite version...
        echo This requires code modifications. Creating SQLite setup...
        echo.
        echo Please run: node scripts\setup-sqlite.js
        pause
        exit /b 0
    ) else (
        echo.
        echo Please install PostgreSQL first, then run this script again.
        pause
        exit /b 1
    )
) else (
    echo [OK] PostgreSQL - Installed
)

echo.
echo ========================================
echo All requirements met! Starting services...
echo ========================================
echo.

REM Check if database exists
echo Checking database...
psql -U postgres -lqt | findstr eagle_tailors >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Creating database...
    psql -U postgres -c "CREATE DATABASE eagle_tailors;" 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Database created
    )
)

REM Run migrations
echo Running database migrations...
cd backend
node scripts\migrate.js
if %ERRORLEVEL% NEQ 0 (
    echo [!] Migration failed. Check database connection.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
start "Eagle Tailors Backend" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start "Eagle Tailors Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo The application will open in your browser shortly...
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq Eagle Tailors Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq Eagle Tailors Frontend*" /F >nul 2>&1

echo.
echo All servers stopped.
pause
