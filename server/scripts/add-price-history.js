const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const PriceHistory = require('../models/PriceHistory');
const Coin = require('../models/Coin');

async function addSamplePriceHistory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const coins = await Coin.find().limit(10);
    
    for (const coin of coins) {
      const now = new Date();
      const priceHistory = [];
      
      // Generate 24 hours of price data (hourly)
      for (let i = 24; i >= 0; i--) {
        const timestamp = new Date(now - i * 60 * 60 * 1000);
        const basePrice = coin.price || 0.001;
        const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
        const price = basePrice * (1 + variation);
        
        priceHistory.push({
          coinAddress: coin.address,
          price: price,
          timestamp: timestamp,
          volume: coin.volume24h * (0.8 + Math.random() * 0.4) // ±20% volume variation
        });
      }
      
      await PriceHistory.insertMany(priceHistory);
      console.log(`Added price history for ${coin.name}`);
    }
    
    console.log('Sample price history added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSamplePriceHistory();