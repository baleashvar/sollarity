@echo off
echo Fix Graph Data Issue
echo =====================

echo 🔧 Force populating both data collections
echo 📊 Adding 24h of BONK data
echo 🔄 Ensuring fallback data exists
echo.

cd workers
python force_populate.py

echo.
echo ✅ Data populated!
echo Now restart your server and check graphs.
pause