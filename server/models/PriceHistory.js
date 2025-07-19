const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  coinAddress: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    default: 0
  },
  volume: {
    type: Number,
    default: 0
  },
  liquidityUSD: {
    type: Number,
    default: 0
  },
  holderCount: {
    type: Number,
    default: 0
  }
});

// Create compound index for efficient time-series queries
PriceHistorySchema.index({ coinAddress: 1, timestamp: -1 });

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);