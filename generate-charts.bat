@echo off
echo Chart Data Generator
echo ===================

echo 📈 Generating proper chart data...
echo ⏱️  Continuous price history
echo.

cd workers
python proper_chart_data.py

echo.
echo ✅ Chart data generated!
pause