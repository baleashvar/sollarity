@echo off
echo Seeding all data in the database...

echo 1. Seeding coins, trending coins, and safe coins...
cd server
node scripts/seed-coins.js
echo.

echo 2. Seeding scam alerts...
node scripts/seed-scam-alerts.js
echo.

echo All data seeded successfully!
cd ..
pause