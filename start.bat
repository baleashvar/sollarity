@echo off
echo Starting Sollarity Application...

echo.
echo === Starting Server ===
start cmd /k "cd server && node server.js"

echo.
echo === Starting Client ===
start cmd /k "cd client && npm start"

echo.
echo Sollarity is now running!
echo Server: http://localhost:5000/api/test
echo Client: http://localhost:3000