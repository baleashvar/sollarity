#!/bin/bash

echo "Setting up Sollarity on EC2..."

# Create directory structure
mkdir -p /home/ubuntu/Sollarity/{server,config,workers}
cd /home/ubuntu/Sollarity

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally
sudo npm install -g pm2

# Install Python and pip if needed
sudo apt-get update
sudo apt-get install -y python3 python3-pip

echo "✅ Basic setup complete"
echo "Next steps:"
echo "1. Upload your server code to /home/ubuntu/Sollarity/server/"
echo "2. Create .env file in /home/ubuntu/Sollarity/config/"
echo "3. Run: cd /home/ubuntu/Sollarity/server && npm install"
echo "4. Run: ./start-services.sh"