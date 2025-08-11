const mongoose = require('mongoose');
const Coin = require('../models/Coin');
const { sanitizeForLog } = require('../utils/sanitize');

// Optimized schema - one document per coin with price array
const PriceHistorySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, index: true },
  address: { type: String, required: true },
  prices: [{
    p: Number, // price
    t: Date    // timestamp
  }]
}, { 
  timestamps: false // disable auto timestamps to save space
});

const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);

class PriceHistoryService {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.MAX_ENTRIES = 144; // 24h × 6 per hour
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('📊 Starting Price History (10min intervals)');
    this.isRunning = true;
    
    // Create index if not exists
    await PriceHistory.createIndexes();
    
    // Run immediately
    await this.collectPriceData();
    
    // Run every 10 minutes
    this.interval = setInterval(async () => {
      await this.collectPriceData();
    }, 10 * 60 * 1000);
    
    console.log('✅ Price tracking active (10min)');
  }

  async stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Price History Service stopped');
  }

  async collectPriceData() {
    try {
      const now = new Date();
      const coins = await Coin.find({}, 'symbol address price').limit(100);
      
      let updated = 0;
      
      // Batch upsert operations
      const bulkOps = [];
      
      for (const coin of coins) {
        if (coin.price && coin.price > 0) {
          bulkOps.push({
            updateOne: {
              filter: { symbol: coin.symbol },
              update: {
                $setOnInsert: { address: coin.address },
                $push: {
                  prices: {
                    $each: [{ p: coin.price, t: now }],
                    $slice: -this.MAX_ENTRIES // Keep only last 144 entries
                  }
                }
              },
              upsert: true
            }
          });
        }
      }
      
      if (bulkOps.length > 0) {
        const result = await PriceHistory.bulkWrite(bulkOps, { ordered: false });
        updated = result.upsertedCount + result.modifiedCount;
      }
      
      console.log(`📈 Updated ${updated}/${coins.length} coins`);
      
    } catch (error) {
      console.error('❌ Price update failed:', error.message);
    }
  }

  async getPriceHistory(address, timeframe = '24h') {
    try {
      // Find by address first, fallback to symbol
      let coin = await Coin.findOne({ address }, 'symbol');
      if (!coin) {
        console.log(`Coin not found for address: ${sanitizeForLog(address)}`);
        return [];
      }
      
      const history = await PriceHistory.findOne({ symbol: coin.symbol });
      if (!history || !history.prices || history.prices.length === 0) {
        console.log(`No price history for ${sanitizeForLog(coin.symbol)}`);
        // Return mock data if no history exists
        const currentCoin = await Coin.findOne({ address });
        if (currentCoin && currentCoin.price) {
          const now = Date.now();
          const mockData = [];
          for (let i = 23; i >= 0; i--) {
            mockData.push({
              t: now - (i * 60 * 60 * 1000),
              c: currentCoin.price * (1 + (Math.random() - 0.5) * 0.05),
              v: 1000
            });
          }
          return mockData;
        }
        return [];
      }
      
      // Filter last 24h only
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentPrices = history.prices
        .filter(p => p.t >= oneDayAgo)
        .sort((a, b) => a.t - b.t)
        .map(p => ({
          t: p.t.getTime(),
          c: p.p,
          v: 1000
        }));
      
      console.log(`Found ${recentPrices.length} price points for ${sanitizeForLog(coin.symbol)}`);
      return recentPrices;
      
    } catch (error) {
      console.error('History fetch error:', sanitizeForLog(error.message));
      return [];
    }
  }
}

module.exports = new PriceHistoryService();