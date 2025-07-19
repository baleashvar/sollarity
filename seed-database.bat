@echo off
echo Seeding database with initial data...
cd server
node scripts/seed-database.js
pause