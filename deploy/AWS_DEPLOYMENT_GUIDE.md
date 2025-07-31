# Sollarity AWS Deployment Guide

**SMTP Configuration Complete:** ses-smtp-user.20250727-231436

## Architecture Overview ✅
- **Frontend**: AWS S3 + CloudFlare CDN
- **Backend**: EC2 t2.micro + PM2  
- **Database**: MongoDB Atlas
- **Email**: AWS SES SMTP (ses-smtp-user.20250727-231436)
- **Domain**: CloudFlare DNS
- **Daily Reports**: Automated to sollarity1@gmail.com at 9 AM EST

## Prerequisites ✅
- AWS Account with billing enabled ✅
- CloudFlare account ✅
- Domain: sollarity.xyz ✅
- GitHub repository ✅
- AWS SES SMTP credentials ✅

## Step 1: Domain Setup (CloudFlare) ✅

### 1.1 Add Domain to CloudFlare ✅
```bash
1. Login to CloudFlare
2. Add site: sollarity.xyz
3. Change nameservers at domain registrar
4. Wait for DNS propagation (24-48 hours)
```

### 1.2 DNS Records ✅
```
Type    Name    Content                 Proxy
A       @       YOUR_EC2_IP            ✅ Proxied
A       api     YOUR_EC2_IP            ✅ Proxied  
CNAME   www     sollarity.xyz          ✅ Proxied
```

## Step 2: AWS SES Setup ✅ 

### 2.1 Verify Domain ✅
```bash
1. AWS Console → SES → Verified identities
2. Create identity → Domain
3. Enter: sollarity.xyz
4. Add DNS records to CloudFlare:
   - TXT record for domain verification
   - CNAME records for DKIM
```

### 2.2 Create SMTP Credentials ✅
```bash
1. SES → SMTP settings → Create SMTP credentials
2. IAM User Name: ses-smtp-user.20250727-231436
3. SMTP Username: AKIAYGLGAQAVAADF3AWO
4. SMTP Password: BA3kCfAqIsiTXXn7fd1istkzwIizdz3jYnjmC1nnbs7P
5. Server: email-smtp.us-east-1.amazonaws.com
6. Port: 587 (TLS)
```

### 2.3 Request Production Access ✅
```bash
1. SES → Account dashboard
2. Request production access
3. Fill form with sollarity.xyz details
4. Wait for approval (24-48 hours)
```

**✅ SMTP Credentials (ACTIVE):**
- **IAM User**: ses-smtp-user.20250727-231436
- **SMTP Username**: AKIAYGLGAQAVAADF3AWO  
- **SMTP Password**: BA3kCfAqIsiTXXn7fd1istkzwIizdz3jYnjmC1nnbs7P
- **SMTP Server**: email-smtp.us-east-1.amazonaws.com
- **Port**: 587 (TLS)
- **From Email**: info@sollarity.xyz
- **Admin Email**: sollarity1@gmail.com

## Step 3: EC2 Backend Setup

### 3.1 Launch EC2 Instance
```bash
1. EC2 → Launch Instance
2. Name: sollarity-backend
3. AMI: Choose one:
   - Amazon Linux 2 (recommended)
   - Ubuntu Server 22.04 LTS
4. Instance type: t2.micro (Free tier eligible)
5. Key pair: Create new (download .pem file)
6. Security group:
   - SSH (22): Your IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom (5000): 0.0.0.0/0
7. Storage: 8 GB gp2 (Free tier)
8. Launch instance
```

### 3.2 Connect to EC2

**For Amazon Linux 2:**
```bash
# Connect
ssh -i "your-key.pem" ec2-user@YOUR_EC2_IP

# Update system
sudo yum update -y
```

**For Ubuntu 22.04:**
```bash
# Connect
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y
```

### 3.3 Install Dependencies

**For Amazon Linux 2:**
```bash
# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo yum install -y git

# Install Python for workers
sudo yum install -y python3 python3-pip
```

**For Ubuntu 22.04:**
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git (usually pre-installed)
sudo apt install -y git

# Install Python for workers
sudo apt install -y python3 python3-pip
```

### 3.4 Configure Environment
```bash
# Edit environment file
nano /var/www/sollarity/config/.env

# Update these values:
NODE_ENV=production
MONGO_URI=mongodb+srv://baleashvar:baleashvar@cluster0.jnyfsoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SMTP_USERNAME=AKIAYGLGAQAVAADF3AWO
SMTP_PASSWORD=BA3kCfAqIsiTXXn7fd1istkzwIizdz3jYnjmC1nnbs7P
SES_FROM_EMAIL=info@sollarity.xyz
ADMIN_EMAIL=sollarity1@gmail.com
FRONTEND_URL=https://sollarity.xyz
API_URL=https://api.sollarity.xyz
```

### 3.5 Start Application
```bash
cd /var/www/sollarity/server
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs
```

### 3.6 Setup Nginx (Optional - for SSL)

**For Amazon Linux 2:**
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**For Ubuntu 22.04:**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Configure reverse proxy (both systems):**
```bash
sudo nano /etc/nginx/sites-available/sollarity  # Ubuntu
# OR
sudo nano /etc/nginx/conf.d/sollarity.conf      # Amazon Linux
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.sollarity.xyz;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## Step 4: S3 Frontend Setup

### 4.1 Create S3 Bucket
```bash
1. S3 → Create bucket
2. Name: sollarity-frontend
3. Region: us-east-1
4. Uncheck "Block all public access"
5. Create bucket
```

### 4.2 Configure Static Website
```bash
1. Bucket → Properties → Static website hosting
2. Enable static website hosting
3. Index document: index.html
4. Error document: index.html
```

### 4.3 Bucket Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::sollarity-frontend/*"
        }
    ]
}
```

### 4.4 Build and Upload Frontend
```bash
# Local machine
cd sollarity
deploy\build-frontend.bat

# Upload to S3 (install AWS CLI first)
aws s3 sync client/build/ s3://sollarity-frontend --delete
```

## Step 5: CloudFlare Configuration

### 5.1 SSL/TLS Settings
```bash
1. SSL/TLS → Overview → Full (strict)
2. Edge Certificates → Always Use HTTPS: ON
3. Edge Certificates → Minimum TLS Version: 1.2
```

### 5.2 Page Rules
```bash
1. Page Rules → Create Page Rule
2. URL: sollarity.xyz/*
3. Settings: Always Use HTTPS
4. Save and Deploy

5. Create another rule:
6. URL: api.sollarity.xyz/*
7. Settings: SSL: Full
```

### 5.3 Caching Rules
```bash
1. Caching → Configuration
2. Browser Cache TTL: 4 hours
3. Caching Level: Standard
```

## Step 6: MongoDB Atlas Production

### Option A: Use Existing Cluster0 (Recommended for Launch)
```bash
1. Keep using your existing Cluster0
2. Add EC2 IP to Network Access
3. Create production database user
4. Use existing coin data
5. MONGO_URI: mongodb+srv://baleashvar:baleashvar@cluster0.jnyfsoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Option B: Create New Production Cluster (Future)
```bash
1. MongoDB Atlas → Create new cluster
2. Name: sollarity-production
3. Tier: M2 ($9/month) for better performance
4. Region: us-east-1
5. Migrate data from Cluster0
```

### 6.2 Network Access (For Both Options)
```bash
1. Network Access → Add IP Address
2. Add: YOUR_EC2_IP/32
3. Comment: EC2 Production Server
4. Keep existing 0.0.0.0/0 for development (optional)
```

### 6.3 Database User (Recommended)
```bash
# Option A: Use existing user
Username: baleashvar
Password: baleashvar

# Option B: Create production user (more secure)
1. Database Access → Add new user
2. Username: sollarity-prod
3. Password: Generate secure password
4. Role: Read and write to any database
```

## Step 7: Testing Deployment

### 7.1 Test Backend API
```bash
curl https://api.sollarity.xyz/health
curl https://api.sollarity.xyz/api/coins?limit=5
```

### 7.2 Test Frontend
```bash
# Visit: https://sollarity.xyz
# Check: Network tab for API calls
# Test: All functionality works
```

### 7.3 Test Email Service
```bash
# From EC2 - Test SMTP connection
cd /var/www/sollarity/server
node -e "
const { sendEmail } = require('./services/emailService');
sendEmail({
  to: 'sollarity1@gmail.com',
  subject: 'Sollarity SMTP Test',
  html: '<h1>SMTP Test from Sollarity</h1><p>Using ses-smtp-user.20250727-231436</p>'
}).then(console.log).catch(console.error);
"

# Test daily registration report
node -e "
const { sendDailyRegistrationReport } = require('./services/emailService');
sendDailyRegistrationReport().then(console.log).catch(console.error);
"
```

## Step 8: Monitoring & Maintenance

### 8.1 CloudWatch Logs
```bash
1. EC2 → Instance → Monitoring
2. CloudWatch → Logs → Create log group
3. Install CloudWatch agent on EC2
```

### 8.2 PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 8.3 Backup Strategy
```bash
# MongoDB Atlas automatic backups
# S3 versioning enabled
# EC2 snapshots weekly
```

## Step 9: Domain Email Setup

### 9.1 Create Email Forwarding
```bash
1. CloudFlare → Email → Email Routing
2. Enable email routing
3. Add route: info@sollarity.xyz → your-personal-email
```

## Deployment Commands Summary

```bash
# Build frontend
deploy\build-frontend.bat

# Upload to S3
aws s3 sync client/build/ s3://sollarity-frontend --delete

# Deploy backend changes
# Amazon Linux 2:
ssh -i "key.pem" ec2-user@YOUR_EC2_IP
# Ubuntu 22.04:
ssh -i "key.pem" ubuntu@YOUR_EC2_IP

cd /var/www/sollarity
git pull origin main
cd server
npm install --production
pm2 restart all
```

## Cost Estimation (Monthly)
- EC2 t2.micro: $8.50
- S3 hosting: $1-5
- CloudFlare: Free
- SES: $0.10 per 1000 emails
- MongoDB Atlas: Free (M0) or $9 (M2)
- **Total: ~$10-20/month**

## Security Checklist
- ✅ HTTPS everywhere
- ✅ Environment variables secured
- ✅ Database access restricted
- ✅ API rate limiting
- ✅ CORS configured
- ✅ Security headers
- ✅ Regular updates

Your Sollarity platform will be live at:
- **Frontend**: https://sollarity.xyz
- **API**: https://api.sollarity.xyz
- **Email**: info@sollarity.xyz
- **Admin Reports**: sollarity1@gmail.com (Daily at 9 AM EST)
- **SMTP User**: ses-smtp-user.20250727-231436