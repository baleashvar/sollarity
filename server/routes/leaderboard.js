const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

// Get top 5 traders (public endpoint)
router.get('/top', async (req, res) => {
  try {
    const topTraders = await Leaderboard.find()
      .sort({ totalProfit: -1 })
      .limit(5)
      .select('username totalProfit successfulTrades winRate bestTrade');
    
    res.json(topTraders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user stats (internal use)
router.post('/update', async (req, res) => {
  try {
    const { userId, username, profit, coinSymbol } = req.body;
    
    let entry = await Leaderboard.findOne({ userId });
    if (!entry) {
      entry = new Leaderboard({ userId, username });
    }
    
    entry.totalProfit += profit;
    entry.successfulTrades += profit > 0 ? 1 : 0;
    entry.winRate = (entry.successfulTrades / (entry.successfulTrades + 1)) * 100;
    
    if (!entry.bestTrade || profit > entry.bestTrade.profit) {
      entry.bestTrade = {
        coinSymbol,
        profit,
        date: new Date()
      };
    }
    
    entry.lastUpdated = new Date();
    await entry.save();
    
    res.json({ message: 'Stats updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;