# EC2 Deployment Scripts

## Usage on EC2:

```bash
# Make scripts executable
chmod +x deploy/*.sh

# Quick restart (recommended)
./deploy/quick-deploy.sh

# Full restart (if issues)
./deploy/full-restart.sh
```

## Manual Commands:

```bash
# Check status
pm2 status

# View logs
pm2 logs sollarity-server

# Restart specific process
pm2 restart sollarity-server
```