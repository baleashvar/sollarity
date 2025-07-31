#!/bin/bash
# EC2 setup script for Sollarity backend
# Supports both Amazon Linux 2 and Ubuntu 22.04

echo "Setting up Sollarity on EC2..."

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
fi

echo "Detected OS: $OS"

# Update system based on OS
if [[ "$OS" == *"Amazon Linux"* ]]; then
    echo "Setting up for Amazon Linux 2..."
    sudo yum update -y
    
    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    
    # Install Git
    sudo yum install -y git
    
    # Install Python
    sudo yum install -y python3 python3-pip
    
    USER_HOME="ec2-user"
    
elif [[ "$OS" == *"Ubuntu"* ]]; then
    echo "Setting up for Ubuntu 22.04..."
    sudo apt update && sudo apt upgrade -y
    
    # Install Node.js 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Install Git
    sudo apt install -y git
    
    # Install Python
    sudo apt install -y python3 python3-pip
    
    USER_HOME="ubuntu"
    
else
    echo "Unsupported OS: $OS"
    exit 1
fi

# Install PM2
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/sollarity
sudo chown $USER_HOME:$USER_HOME /var/www/sollarity

echo "EC2 setup completed!"
echo "Next steps:"
echo "1. Clone your repository to /var/www/sollarity"
echo "2. Edit /var/www/sollarity/config/.env with production values"
echo "3. Run: cd /var/www/sollarity/server && npm install --production"
echo "4. Run: pm2 start ecosystem.config.js"
echo "5. Run: pm2 startup"
echo "6. Run: pm2 save"