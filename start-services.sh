#!/bin/bash

echo "Starting Sollarity..."

cd /home/ubuntu/Sollarity/server

# Start with minimal logging
pm2 stop sollarity-server 2>/dev/null || true
pm2 delete sollarity-server 2>/dev/null || true
pm2 start server.js --name sollarity-server --max-memory-restart 400M --log-date-format="HH:mm:ss"

echo "Started - Price tracking: 10min, Scraping: 20min"
echo "Logs: pm2 logs sollarity-server --lines 10"