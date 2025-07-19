@echo off
echo Seeding database with scam alerts...
cd server
node scripts/seed-scam-alerts.js
pause