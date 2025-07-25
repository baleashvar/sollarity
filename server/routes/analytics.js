const express = require('express');
const router = express.Router();
const Coin = require('../models/Coin');
const PriceHistory = require('../models/PriceHistory');

// Get historical price data
router.get('/history', async (req, res) => {
  try {
    const { address, timeframe = '24h' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '1h': startDate = new Date(now - 60 * 60 * 1000); break;
      case '24h': startDate = new Date(now - 24 * 60 * 60 * 1000); break;
      case '7d': startDate = new Date(now - 7 * 24 * 60 * 60 * 1000); break;
      case '30d': startDate = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
      default: startDate = new Date(now - 24 * 60 * 60 * 1000);
    }
    
    const history = await PriceHistory.find({
      coinAddress: address,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get market analytics
router.get('/market', async (req, res) => {
  try {
    const totalCoins = await Coin.countDocuments();
    const totalMarketCap = await Coin.aggregate([
      { $group: { _id: null, total: { $sum: '$marketCap' } } }
    ]);
    
    const scamStats = await Coin.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $lt: ['$scamProbability', 0.3] }, 'safe',
              { $cond: [{ $lt: ['$scamProbability', 0.7] }, 'medium', 'high'] }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalCoins,
      totalMarketCap: totalMarketCap[0]?.total || 0,
      scamStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced scam detection
router.get('/scam-analysis', async (req, res) => {
  try {
    const { address } = req.query;
    const coin = await Coin.findOne({ address });
    
    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    
    const riskFactors = [];
    let riskScore = 0;
    
    // Liquidity analysis
    if (coin.liquidityUSD < 10000) {
      riskFactors.push({ factor: 'Low Liquidity', severity: 'high', impact: 0.3 });
      riskScore += 0.3;
    }
    
    // LP burn analysis
    if (!coin.lpBurned) {
      riskFactors.push({ factor: 'LP Not Burned', severity: 'medium', impact: 0.2 });
      riskScore += 0.2;
    }
    
    // Holder concentration
    if (coin.holderCount < 100) {
      riskFactors.push({ factor: 'Low Holder Count', severity: 'high', impact: 0.25 });
      riskScore += 0.25;
    }
    
    // Volume analysis
    const volumeRatio = coin.volume24h / coin.marketCap;
    if (volumeRatio > 0.5) {
      riskFactors.push({ factor: 'High Volume Ratio', severity: 'medium', impact: 0.15 });
      riskScore += 0.15;
    }
    
    res.json({
      coin: coin.name,
      address: coin.address,
      riskScore: Math.min(riskScore, 1),
      riskLevel: riskScore < 0.3 ? 'Low' : riskScore < 0.7 ? 'Medium' : 'High',
      riskFactors
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;