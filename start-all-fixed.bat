@echo off
echo Sollarity - Complete Setup and Start

echo.
echo === Installing root dependencies ===
call install-root-deps.bat

echo.
echo === Installing Tailwind plugins ===
call install-tailwind-plugins.bat

echo.
echo === Starting server ===
start cmd /k "cd server && node server.js"

echo.
echo === Starting client ===
start cmd /k "cd client && npm start"

echo.
echo All services should be starting now!
echo Server: http://localhost:5000/api/test
echo Client: http://localhost:3000