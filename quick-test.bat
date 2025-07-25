@echo off
echo Quick Chart Test
echo ================

echo 1. Generate chart data
cd workers
python proper_chart_data.py

echo.
echo 2. Test server endpoint
cd ..\server
start "Server" cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo.
echo 3. Test client
cd ..\client
npm start

echo.
echo ✅ Quick test complete!
pause