const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  // Basic coin information
  symbol: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  image: String,
  description: String,
  website: String,
  twitter: String,
  telegram: String,
  discord: String,
  
  // Market data
  marketCap: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number,
    default: 0
  },
  priceChange24h: {
    type: Number,
    default: 0
  },
  
  // Liquidity information
  liquidityUSD: {
    type: Number,
    default: 0
  },
  lpBurned: {
    type: Boolean,
    default: false
  },
  
  // Holder information
  holderCount: {
    type: Number,
    default: 0
  },
  insiderPercentage: {
    type: Number,
    default: 0
  },
  
  // Risk assessment
  scamProbability: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  riskFactors: [{
    factor: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  
  // Timestamps
  launchDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Tracking data
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
CoinSchema.index({ marketCap: -1 });
CoinSchema.index({ volume24h: -1 });
CoinSchema.index({ scamProbability: 1 });
CoinSchema.index({ launchDate: -1 });

module.exports = mongoose.model('Coin', CoinSchema);