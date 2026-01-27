@echo off
echo ========================================
echo Eagle Tailors - SQLite Quick Setup
echo ========================================
echo.
echo This will set up Eagle Tailors with SQLite
echo (No PostgreSQL installation needed!)
echo.
pause

echo Installing SQLite dependency...
cd backend
call npm install better-sqlite3
cd ..

echo.
echo Creating SQLite database...
node -e "const Database=require('better-sqlite3');const db=new Database('./backend/eagle_tailors.db');console.log('Database created!');"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm run dev
echo.
echo Database file: backend\eagle_tailors.db
echo.
pause
