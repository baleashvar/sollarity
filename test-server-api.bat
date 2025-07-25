@echo off
echo Testing Server API
echo ===================

echo 🧪 Testing if server endpoints work
echo 📊 Checking BONK data retrieval
echo.

cd workers
python test_server_api.py

echo.
pause