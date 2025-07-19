@echo off
echo Starting Sollarity development environment...

echo.
echo === Starting MongoDB connection test ===
cd server
node -e "const mongoose = require('mongoose'); const dotenv = require('dotenv'); const path = require('path'); dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') }); mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connection successful')).catch(err => console.error('MongoDB connection failed:', err));"

echo.
echo === Starting Backend Server ===
start cmd /k "cd server && npm run dev"

echo.
echo === Starting Frontend ===
start cmd /k "cd client && npm start"

echo.
echo Development environment started!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000