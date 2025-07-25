@echo off
echo Debug Server Logs
echo ==================

echo 🔍 Starting server with debug logs
echo 📊 Check console for data queries
echo.

cd server
set DEBUG=*
npm start

pause