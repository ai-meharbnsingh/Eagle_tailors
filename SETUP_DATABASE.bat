@echo off
title Eagle Tailors - Database Setup
color 0B

echo.
echo ============================================================
echo        EAGLE TAILORS - DATABASE SETUP
echo ============================================================
echo.

cd /d "%~dp0"

:: Find PostgreSQL bin directory
set PGBIN=
for %%d in (
    "C:\Program Files\PostgreSQL\18\bin"
    "C:\Program Files\PostgreSQL\17\bin"
    "C:\Program Files\PostgreSQL\16\bin"
    "C:\Program Files\PostgreSQL\15\bin"
) do (
    if exist "%%~d\psql.exe" (
        set PGBIN=%%~d
        goto :found_pg
    )
)

:found_pg
if "%PGBIN%"=="" (
    echo [ERROR] PostgreSQL not found!
    echo Please install PostgreSQL first.
    pause
    exit /b 1
)

echo Using PostgreSQL from: %PGBIN%
echo.

:: Set password for psql commands
set PGPASSWORD=123456

:: Check if database exists
echo [1/3] Checking if database exists...
"%PGBIN%\psql" -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='eagle_tailors'" | findstr "1" >nul 2>&1

if errorlevel 1 (
    echo       Database does not exist. Creating...
    "%PGBIN%\psql" -h localhost -U postgres -c "CREATE DATABASE eagle_tailors;"
    if errorlevel 1 (
        echo [ERROR] Failed to create database!
        pause
        exit /b 1
    )
    echo       Database created successfully!
) else (
    echo       Database 'eagle_tailors' already exists
)

:: Run migrations
echo.
echo [2/3] Running database migrations...
"%PGBIN%\psql" -h localhost -U postgres -d eagle_tailors -f "database\migrations\001_initial_schema.sql" 2>&1 | findstr /i "error" >nul
if not errorlevel 1 (
    echo       [WARNING] Some errors during migration (tables may already exist)
) else (
    echo       Migrations completed!
)

:: Verify tables
echo.
echo [3/3] Verifying tables...
"%PGBIN%\psql" -h localhost -U postgres -d eagle_tailors -c "\dt"

echo.
echo ============================================================
echo        DATABASE SETUP COMPLETE!
echo ============================================================
echo.
echo You can now run START_APP.bat to start the application.
echo.
pause
