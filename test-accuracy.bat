@echo off
echo Testing Accurate Data System
echo ============================

echo Step 1: Fetch accurate data
cd workers
python accurate_data_fetcher.py

echo.
echo Step 2: Start server
cd ..\server
start "Server" cmd /k "npm start"

echo.
echo Step 3: Start client
cd ..\client
start "Client" cmd /k "npm start"

echo.
echo ✅ Testing environment ready!
echo.
echo Manual Tests:
echo 1. Go to http://localhost:3000
echo 2. Check BONK price matches CoinGecko
echo 3. Verify market cap calculation
echo 4. Test price charts work
echo 5. Check all timeframes (1h, 24h, 7d, 30d)
echo.
pause