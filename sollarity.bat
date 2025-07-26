@echo off
echo ========================================
echo           SOLLARITY PLATFORM
echo ========================================
echo.

if "%1"=="install" goto install
if "%1"=="start" goto start
if "%1"=="scrape" goto scrape
if "%1"=="backup" goto backup
if "%1"=="backup-schedule" goto backup_schedule
if "%1"=="help" goto help
if "%1"=="" goto help

:help
echo Usage: sollarity.bat [command]
echo.
echo Commands:
echo   install          - Install all dependencies
echo   start           - Start the full platform (client + server)
echo   scrape          - Run data scraper (100 tokens)
echo   backup          - Run manual backup
echo   backup-schedule - Start daily backup scheduler
echo   help            - Show this help
echo.
goto end

:install
echo Installing dependencies...
echo.
echo 1. Installing server dependencies...
cd server
call npm install
cd ..
echo.
echo 2. Installing client dependencies...
cd client
call npm install
cd ..
echo.
echo 3. Installing Python dependencies...
cd workers
python -m pip install -r requirements.txt
cd ..
echo.
echo Installation completed!
goto end

:start
echo Starting Sollarity Platform...
echo.
echo Starting server...
start "Sollarity Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
echo Starting client...
start "Sollarity Client" cmd /k "cd client && npm start"
echo.
echo Platform started! Check the opened windows.
goto end

:scrape
echo Running data scraper...
cd workers
python scraper.py
cd ..
goto end

:backup
echo Running manual backup...
cd workers
python backup.py manual
cd ..
goto end

:backup_schedule
echo Starting backup scheduler...
cd workers
python backup.py
cd ..
goto end

:end
pause