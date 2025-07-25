@echo off
echo Testing Chart Fixes
echo ==================

echo 1. Generate proper chart data
cd workers
python proper_chart_data.py

echo.
echo 2. Start server with debug logs
cd ..\server
start "Server Debug" cmd /k "npm start"

echo.
echo 3. Start client
cd ..\client  
start "Client" cmd /k "npm start"

echo.
echo ✅ Test environment ready!
echo.
echo Manual Test Steps:
echo 1. Go to http://localhost:3000
echo 2. Click on any coin
echo 3. Test timeframe buttons: 1h, 24h, 7d, 30d
echo 4. Check console logs for different data points
echo 5. Verify charts change shape per timeframe
echo.
echo Expected Console Output:
echo [PH] address 1h 60 points
echo [PH] address 24h 288 points  
echo [PH] address 7d 168 points
echo [PH] address 30d 180 points
echo.
pause