# Sollarity Deployment Guide

## Dependencies

### Server (Node.js)
```bash
cd server
npm install
```
**Required packages:**
- express ^4.18.2
- mongoose ^7.5.0
- cors ^2.8.5
- dotenv ^16.3.1
- bcryptjs ^2.4.3
- jsonwebtoken ^9.0.2
- axios ^1.5.0

### Client (React)
```bash
cd client
npm install
```
**Required packages:**
- react ^18.2.0
- react-dom ^18.2.0
- react-router-dom ^6.15.0
- chart.js ^4.4.0
- react-chartjs-2 ^5.2.0
- chartjs-adapter-date-fns ^3.0.0
- date-fns ^2.30.0
- axios ^1.5.0
- tailwindcss ^3.3.3

### Python Workers
```bash
cd workers
pip install -r requirements.txt
```
**Required packages:**
- requests==2.31.0
- pymongo==4.5.0
- python-dotenv==1.0.0
- schedule==1.2.0

## Environment Variables
Copy `config/.env.example` to `config/.env` and configure:
- MONGO_URI
- BIRDEYE_API_KEY
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET

## Quick Start
1. Run `install.bat` to install all dependencies
2. Run `run-scraper.bat` to populate database
3. Run `start.bat` to start the application

## Production Deployment
- Frontend: Deploy to Vercel/Netlify
- Backend: Deploy to Railway/Render
- Database: MongoDB Atlas
- Workers: AWS Lambda or scheduled tasks