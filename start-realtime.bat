@echo off
echo Starting Real-Time Data Collection
echo ===================================

echo 🚀 Starting real-time price collector
echo ⏰ Collects prices every 5 minutes
echo 📊 24-hour rolling window
echo 🔴 Live data from Jupiter API
echo.

cd workers
start "Real-Time Collector" cmd /k "python realtime_collector.py"

echo.
echo ✅ Real-time collector started!
echo Check the collector window for live updates.
echo.
echo Next: Start your server and client to see live charts.
pause