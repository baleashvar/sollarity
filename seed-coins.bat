@echo off
echo Seeding database with coins, trending coins, and safe coins...
cd server
node scripts/seed-coins.js
pause