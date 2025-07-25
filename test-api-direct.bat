@echo off
echo Testing API Directly
echo ====================

echo 🧪 Testing server endpoints directly
echo 📊 Checking if data exists
echo.

echo Testing /api/coins endpoint:
curl -s http://localhost:5000/api/coins | head -c 200
echo.
echo.

echo Testing /api/analytics/history for BONK:
curl -s "http://localhost:5000/api/analytics/history?address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&timeframe=24h" | head -c 300
echo.
echo.

pause