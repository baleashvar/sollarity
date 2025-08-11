#!/bin/bash
# Full System Restart for EC2

echo "🔄 Full Sollarity Restart..."

# Stop all processes
pm2 stop all

# Navigate and pull
cd /home/ubuntu/sollarity
git pull origin main

# Server setup
cd server
npm install
pm2 start server.js --name sollarity-server

# Check status
pm2 status
pm2 logs sollarity-server --lines 5