const mongoose = require('mongoose');

// Check if model already exists to avoid overwrite error
let PriceHistory;
try {
  PriceHistory = mongoose.model('PriceHistory');
} catch (error) {
  // Optimized schema - one document per coin with price array
  const PriceHistorySchema = new mongoose.Schema({
    symbol: { type: String, required: true, index: true },
    address: { type: String, required: true },
    prices: [{
      p: Number, // price
      t: Date    // timestamp
    }]
  }, { 
    timestamps: false // disable auto timestamps to save space
  });

  PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);
}

module.exports = PriceHistory;