// MongoDB initialization script for Docker
db = db.getSiblingDB('sollarity');

// Create collections
db.createCollection('coins');
db.createCollection('pricehistories');
db.createCollection('scamalerts');
db.createCollection('users');

// Create indexes for better performance
db.coins.createIndex({ "symbol": 1 });
db.coins.createIndex({ "address": 1 }, { unique: true });
db.coins.createIndex({ "marketCap": -1 });
db.coins.createIndex({ "scamProbability": 1 });
db.coins.createIndex({ "createdAt": -1 });

db.pricehistories.createIndex({ "coinId": 1, "timestamp": -1 });
db.scamalerts.createIndex({ "coinAddress": 1 });
db.scamalerts.createIndex({ "severity": -1 });
db.scamalerts.createIndex({ "createdAt": -1 });

// Insert sample data
db.coins.insertMany([
  {
    name: "Sample Meme Coin",
    symbol: "SAMPLE",
    address: "11111111111111111111111111111111",
    price: 0.001,
    marketCap: 1000000,
    volume24h: 50000,
    priceChange24h: 5.2,
    scamProbability: 0.1,
    lpBurned: true,
    createdAt: new Date()
  }
]);

print('Database initialized successfully');