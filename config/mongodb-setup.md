# MongoDB Atlas Setup Guide

## 1. Create Initial Collections

After connecting to your MongoDB Atlas cluster, you'll need to create the following collections:

1. **Coins** - Stores information about each memecoin
2. **PriceHistory** - Stores historical price data for each coin

You can create these collections through the MongoDB Atlas web interface:

1. Go to your cluster dashboard
2. Click "Collections"
3. Click "Create Database"
4. Enter "sollarity" as the database name
5. Enter "Coins" as the first collection name
6. Click "Create"
7. Click "Create Collection" again
8. Enter "PriceHistory" as the collection name
9. Click "Create"

## 2. Create Indexes

For better performance, create the following indexes:

### Coins Collection
```javascript
// Create index on address (unique)
db.Coins.createIndex({ "address": 1 }, { unique: true })

// Create index on symbol
db.Coins.createIndex({ "symbol": 1 })

// Create index on marketCap (descending for sorting)
db.Coins.createIndex({ "marketCap": -1 })

// Create index on scamProbability
db.Coins.createIndex({ "scamProbability": 1 })

// Create index on volume24h (descending for sorting)
db.Coins.createIndex({ "volume24h": -1 })
```

### PriceHistory Collection
```javascript
// Create compound index on coinAddress and timestamp
db.PriceHistory.createIndex({ "coinAddress": 1, "timestamp": -1 })
```

You can run these commands in the MongoDB Atlas "Collections" view by clicking "More Actions" > "Create Index".

## 3. Test Connection

To test your connection:

1. Start your Express server
2. Check the console for "MongoDB connected" message
3. If there's an error, verify your connection string and network access settings