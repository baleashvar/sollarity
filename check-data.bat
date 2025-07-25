@echo off
echo Checking Database Data
echo ======================

echo 🔍 Checking what data exists
echo 📊 Testing server queries
echo.

cd workers
python test_db_data.py

echo.
pause