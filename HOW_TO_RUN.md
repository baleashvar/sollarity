# Sollarity Setup Guide

## Quick Start

```bash
# 1. Install everything
sollarity.bat install

# 2. Configure environment
# Edit config/.env with your API keys

# 3. Start the platform
sollarity.bat start

# 4. Run data collection
sollarity.bat scrape
```

## Configuration

### Required: Update `config/.env`
```env
MONGO_URI=your_mongodb_atlas_connection
BIRDEYE_API_KEY=your_birdeye_key
HELIUS_API_KEY=your_helius_key
```

### Optional: Google Drive Backup
1. Get OAuth credentials from Google Cloud Console
2. Save as `config/drive_credentials.json`
3. Run `sollarity.bat backup-schedule`

## API Keys Setup

### MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create cluster and get connection string

### Birdeye API
1. Visit birdeye.so
2. Get API key
3. Add to .env file

## Commands

- `sollarity.bat help` - Show all commands
- `sollarity.bat install` - Install dependencies
- `sollarity.bat start` - Start platform
- `sollarity.bat scrape` - Collect data
- `sollarity.bat backup` - Manual backup
- `sollarity.bat backup-schedule` - Daily backups

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

1. **MongoDB Error**: Check connection string and IP whitelist
2. **API Limits**: Wait and retry, or upgrade API plan
3. **Port Issues**: Change PORT in .env file
4. **Dependencies**: Re-run `sollarity.bat install`

For detailed logs, check the terminal windows that open when starting the platform.