@echo off
echo Testing Price APIs
echo ==================

echo 🧪 Testing CoinGecko, Birdeye, and Jupiter APIs
echo 📊 Checking which APIs are working
echo.

cd workers
python test_apis.py

echo.
pause