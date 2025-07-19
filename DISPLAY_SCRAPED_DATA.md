# Displaying Scraped Data in Sollarity UI

This guide explains how to display the scraped data in the Sollarity website UI.

## What's Been Added

1. **Scam Alerts API Endpoint**
   - Created a new API endpoint at `/api/scam-alerts` to serve scam alert data
   - Added the route to the server.js file

2. **Scam Alerts Component**
   - Created a new component `ScamAlerts.jsx` to display scam alerts on the dashboard
   - Added the component to the Dashboard page

3. **Scam Alerts Page**
   - Created a dedicated page `ScamAlertsPage.jsx` to display all scam alerts
   - Added the route to App.jsx
   - Added a link in the Navbar

4. **Database Seeding**
   - Created a script to seed the database with sample scam alerts
   - Added a batch file to run the seed script

## How to Run

1. **Seed the database with scam alerts**
   ```
   seed-scam-alerts.bat
   ```

2. **Start the server**
   ```
   start-server.bat
   ```

3. **Start the client**
   ```
   start-client.bat
   ```

4. **View the website**
   Open your browser and navigate to `http://localhost:3000`

## Data Flow

1. The simple scraper script collects data and stores it in MongoDB
2. The Express server provides API endpoints to access the data
3. The React frontend fetches data from these endpoints and displays it in the UI

## Components Overview

- **Dashboard**: Main page showing coin data, trending coins, safe coins, and scam alerts
- **ScamAlerts**: Component showing recent scam alerts
- **ScamAlertsPage**: Dedicated page showing all scam alerts with more details

## Next Steps

- Add more detailed analytics for each coin
- Implement real-time updates for price changes
- Enhance the scam detection algorithms
- Add user authentication for personalized watchlists