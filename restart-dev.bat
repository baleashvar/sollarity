@echo off
echo Stopping any running processes...
taskkill /f /im node.exe >nul 2>&1

echo Building Tailwind CSS...
cd client
call npm run build:tailwind

echo Starting development server...
start cmd /k npm start

echo Done!