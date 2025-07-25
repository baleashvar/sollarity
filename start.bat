@echo off
echo Starting Sollarity Application
echo ===============================

echo Starting server...
start cmd /k "cd server && npm start"

timeout /t 3

echo Starting client...
start cmd /k "cd client && npm start"

echo Both server and client are starting...
echo Server: http://localhost:5000
echo Client: http://localhost:3000
pause