@echo off
echo Complete Test Setup
echo ====================

echo 1. Starting server in background...
cd server
start "Sollarity Server" cmd /k "npm start"

echo 2. Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 3. Testing API...
cd ..\workers
python test_server_api.py

echo 4. Starting client...
cd ..\client
start "Sollarity Client" cmd /k "npm start"

echo.
echo ✅ Complete setup running!
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Check both windows and test the graphs.
pause