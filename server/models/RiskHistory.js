const mongoose = require('mongoose');

const RiskHistorySchema = new mongoose.Schema({
  tokenAddress: { type: String, required: true, index: true },
  symbol: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  riskScore: { type: Number, required: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  liquidityUSD: { type: Number },
  holderCount: { type: Number },
  volume24h: { type: Number },
  riskFactors: [{
    type: { type: String },
    severity: { type: String },
    description: { type: String }
  }]
}, { 
  timestamps: true,
  index: { tokenAddress: 1, date: 1 }
});

module.exports = mongoose.model('RiskHistory', RiskHistorySchema);