#!/bin/bash
# EC2 setup script for Sollarity backend

echo "Setting up Sollarity on EC2..."

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo yum install -y git

# Create app directory
sudo mkdir -p /var/www/sollarity
sudo chown ec2-user:ec2-user /var/www/sollarity

# Clone repository
cd /var/www/sollarity
git clone https://github.com/yourusername/sollarity.git .

# Install dependencies
cd server
npm install --production

# Install Python for workers
sudo yum install -y python3 python3-pip
pip3 install -r ../workers/requirements.txt

# Setup environment file
cp ../config/.env.example ../config/.env
echo "Edit /var/www/sollarity/config/.env with your production values"

# Setup PM2 ecosystem
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sollarity-api',
    script: 'server.js',
    cwd: '/var/www/sollarity/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

echo "EC2 setup completed!"
echo "Next steps:"
echo "1. Edit /var/www/sollarity/config/.env"
echo "2. Run: pm2 start ecosystem.config.js"
echo "3. Run: pm2 startup"
echo "4. Run: pm2 save"