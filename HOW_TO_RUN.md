# How to Run Sollarity

Follow these steps to run the Sollarity application and display the scraped data:

## 1. Seed the Database

First, you need to seed the database with sample data:

```
seed-all-data.bat
```

This will:
- Add sample coins (USDC, SOL, WIF, BONK, SCAM)
- Add trending coins based on volume
- Add safe coins based on scam probability
- Add scam alerts

## 2. Start the Server

Start the Express server:

```
start-server.bat
```

This will:
- Connect to MongoDB
- Set up API endpoints
- Listen on port 5000

## 3. Start the Client

Start the React client:

```
start-client.bat
```

This will:
- Start the development server
- Open the application in your browser at http://localhost:3000

## 4. View the Data

You should now see:
- Main coin table with all coins
- Trending coins section
- Safe coins section
- Scam alerts section

## Troubleshooting

If you don't see any data:

1. Check the server console for errors
2. Make sure MongoDB is connected
3. Verify that the seed scripts ran successfully
4. Check the browser console for any API errors

## Running the Scraper

To run the scraper and update the data:

```
run-simple-scraper.bat
```

This will:
- Connect to MongoDB
- Scrape new data
- Update the database