@echo off
echo ========================================
echo Eagle Tailors - Complete Database Setup
echo ========================================
echo.
echo This script will:
echo 1. Test PostgreSQL connection
echo 2. Create database
echo 3. Run migrations
echo 4. Verify everything works
echo.
pause

echo.
echo Step 1: Testing PostgreSQL connection...
echo ========================================
cd backend
node scripts\create-database.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Database creation failed!
    echo.
    echo Common fixes:
    echo 1. Update password in backend\.env file
    echo 2. Make sure PostgreSQL service is running
    echo 3. Check SETUP_DATABASE.md for detailed help
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Running migrations...
echo ========================================
node scripts\migrate.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Migration failed!
    echo Check the error above for details.
    echo.
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo SUCCESS! Database is ready!
echo ========================================
echo.
echo Application URLs:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Next steps:
echo 1. Open http://localhost:3000 in your browser
echo 2. Click "Books" and create your first book
echo 3. Start adding customers and bills!
echo.
echo Enjoy your Eagle Tailors system!
echo.
pause
