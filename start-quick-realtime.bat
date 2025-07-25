@echo off
echo Quick Real-Time Data Collection
echo =================================

echo 🚀 Generating 24h of initial data
echo ⏰ Then collecting every 2 minutes
echo 📊 Real prices from CoinGecko
echo 🔄 Continuous updates
echo.

cd workers
python quick_realtime.py

pause