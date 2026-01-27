@echo off
echo ========================================
echo Eagle Tailors Setup Script
echo ========================================
echo.

REM Check if PostgreSQL is installed
echo Checking PostgreSQL...
psql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first
    pause
    exit /b 1
)

REM Check if Node.js is installed
echo Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js first
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installing Frontend Dependencies...
echo ========================================
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create PostgreSQL database: createdb eagle_tailors
echo 2. Run database migrations: cd backend ^&^& node scripts\migrate.js
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm run dev
echo.
pause
