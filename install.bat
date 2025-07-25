@echo off
echo Installing Sollarity Dependencies
echo =================================

echo 📦 Installing Server Dependencies...
cd server
call npm install

echo 📦 Installing Client Dependencies...
cd ..\client
call npm install

echo 🐍 Installing Python Dependencies...
cd ..\workers
pip install -r requirements.txt

echo ✅ All dependencies installed!
echo.
echo To start the application:
echo 1. Run: start.bat
echo 2. Or manually: npm start in server and client folders
pause