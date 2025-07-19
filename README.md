# Sollarity

A website that provides insights and analysis about Solana-based meme coins, helping users identify legitimate investment opportunities and avoid scams.

## Project Overview

Sollarity is a data-driven crypto analysis platform that:
- Extracts live and historical memecoin data
- Identifies potentially fraudulent coins using various indicators
- Provides detailed analytics on coin performance
- Offers premium features via Paypal and crypto payments(In development)
- Generates revenue through strategic ad placement

## Architecture

```
         [User Browser]
               |
        ┌──────▼──────┐
        │   MERN UI   │  ← React + Tailwind + Chart.js
        └──────┬──────┘
               │ API
        ┌──────▼────────────┐
        │  Express/Node.js  │  ← Simple REST API wrapper
        └──────┬────────────┘
               │
        ┌──────▼─────────────┐
        │   Python Workers   │ ← Scraper + Analyzer (Axiom, Solana RPCs)
        └──────┬─────────────┘
               │
     ┌─────────▼────────────┐
     │ MongoDB (Atlas)      │ ← Coin metadata, market cap, trends
     └──────────────────────┘
```

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend API**: Node.js, Express
- **Data Processing**: Python, web3.py, AIOHTTP
- **Database**: MongoDB Atlas
- **Hosting**: Vercel / AWS EC2
- **Scheduled Jobs**: AWS Lambda + EventBridge
- **Payments**: Stripe + SolanaPay
- **Monetization**: Google Adsense, Monetag

## Core Features

- Real-time memecoin data tracking
- Scam detection algorithms
- Historical performance analysis
- Premium subscription options
- User watchlists and alerts

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB

### Environment Variables

This project uses environment variables for configuration. Before running the application:

1. Copy the example environment file:
   ```bash
   cp config/.env.example config/.env
   ```

2. Edit `config/.env` with your actual credentials

**IMPORTANT: Never commit your .env file containing real credentials to version control!**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sollarity.git

# Install server dependencies
cd sollarity/server
npm install

# Install client dependencies
cd ../client
npm install

# Install Python dependencies
cd ../workers
pip install -r requirements.txt
```

## Development

```bash
# Run the server
cd server
npm run dev

# Run the client
cd client
npm start
```

## License

MIT
