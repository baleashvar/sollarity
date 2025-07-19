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

## Platform Preview

![Sollarity Dashboard](assets/images/capture.png)
*Sollarity's intuitive dashboard provides real-time insights into the Solana memecoin market*

![Scam Detection](assets/images/capture1.png)
*Our advanced algorithms help identify potentially fraudulent tokens before you invest*

## Contact

For business inquiries, please contact us at info@sollarity.io

© 2023 Sollarity. All rights reserved.
