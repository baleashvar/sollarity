#!/bin/bash
# Quick Deploy Script for EC2

cd /home/ubuntu/sollarity
git pull origin main
cd server && npm install
pm2 restart sollarity-server
pm2 status