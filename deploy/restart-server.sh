#!/bin/bash
# EC2 Server Restart Script

echo "🔄 Restarting Sollarity Server..."

# Navigate to project directory
cd /home/ubuntu/sollarity

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Restart PM2 processes
echo "🔄 Restarting PM2 processes..."
pm2 restart sollarity-server || pm2 start server.js --name sollarity-server

# Check status
echo "✅ Server restart complete!"
pm2 status
pm2 logs sollarity-server --lines 10