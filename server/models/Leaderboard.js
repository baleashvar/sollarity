const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  totalProfit: { type: Number, default: 0 },
  successfulTrades: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  bestTrade: { 
    coinSymbol: String,
    profit: Number,
    date: Date
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);