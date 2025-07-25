@echo off
echo Fixing Identical Chart Issue
echo ============================

echo 🔧 Generating unique chart patterns for each coin
echo 📊 Each coin will have distinct price movements
echo.

cd workers
python unique_chart_data.py

echo.
echo ✅ Unique chart data generated!
echo Now BONK and POPCAT will show different graphs.
pause