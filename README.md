# Sollarity

![Sollarity Logo](./sollarity_thumbnail.png)

A comprehensive Solana memecoin analysis platform with automated data collection, scam detection, and backup systems.

## Features

- **Real-time Data**: 100 most popular Solana tokens
- **Multi-API Integration**: Birdeye, CoinGecko with intelligent fallbacks
- **Scam Detection**: Advanced risk analysis algorithms
- **Automated Backups**: Daily backups to local storage and Google Drive
- **MERN Stack**: React frontend, Node.js backend, MongoDB database

## Quick Start

```bash
# Install dependencies
sollarity.bat install

# Start the platform
sollarity.bat start

# Run data scraper
sollarity.bat scrape

# Setup daily backups
sollarity.bat backup-schedule
```

## Architecture

```
[React Frontend] ←→ [Node.js API] ←→ [MongoDB]
                          ↓
                  [Python Workers]
                    ↓         ↓
              [Data Scraper] [Backup System]
                    ↓         ↓
              [Multiple APIs] [Google Drive]
```

## Commands

- `sollarity.bat install` - Install all dependencies
- `sollarity.bat start` - Start frontend and backend
- `sollarity.bat scrape` - Run data collection
- `sollarity.bat backup` - Manual backup
- `sollarity.bat backup-schedule` - Start daily backup scheduler
- `sollarity.bat help` - Show all commands

## Configuration

Update `config/.env` with your API keys:
```env
MONGO_URI=your_mongodb_connection
BIRDEYE_API_KEY=your_birdeye_key
HELIUS_API_KEY=your_helius_key
```

For Google Drive backup, add `config/drive_credentials.json` from Google Cloud Console.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, MongoDB
- **Data Collection**: Python, Multi-API integration
- **Backup**: Local storage + Google Drive
- **Deployment**: Docker ready

© 2025 Sollarity. All rights reserved.
