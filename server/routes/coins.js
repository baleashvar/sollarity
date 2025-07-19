const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coin = require('../models/Coin');
const PriceHistory = require('../models/PriceHistory');

/**
 * @route   GET /api/coins
 * @desc    Get all coins with pagination and filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sort = 'marketCap', 
      order = 'desc',
      minMarketCap,
      maxScamProbability,
      lpBurned
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (minMarketCap) {
      filter.marketCap = { $gte: Number(minMarketCap) };
    }
    
    if (maxScamProbability) {
      filter.scamProbability = { $lte: Number(maxScamProbability) };
    }
    
    if (lpBurned === 'true') {
      filter.lpBurned = true;
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const coins = await Coin.find(filter)
      .sort(sortObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Coin.countDocuments(filter);
    
    res.json({
      coins,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/coins/trending
 * @desc    Get trending coins (highest volume in last 24h)
 * @access  Public
 */
router.get('/trending', async (req, res) => {
  try {
    // First try to get from TrendingCoin collection if it exists
    const TrendingCoin = mongoose.models.TrendingCoin || mongoose.model('TrendingCoin', new mongoose.Schema({
      coinAddress: String,
      rank: Number,
      timestamp: Date
    }));
    
    const trendingData = await TrendingCoin.find().sort({ rank: 1 }).limit(10);
    
    if (trendingData && trendingData.length > 0) {
      // Get the actual coin data for each trending coin
      const coinAddresses = trendingData.map(item => item.coinAddress);
      const trendingCoins = await Coin.find({ address: { $in: coinAddresses } });
      
      // Sort by the original ranking
      const sortedCoins = coinAddresses.map(address => 
        trendingCoins.find(coin => coin.address === address)
      ).filter(Boolean);
      
      return res.json(sortedCoins);
    }
    
    // Fallback to sorting by volume if no trending data
    const trendingCoins = await Coin.find()
      .sort({ volume24h: -1 })
      .limit(10);
    
    res.json(trendingCoins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/coins/safe
 * @desc    Get safest coins (lowest scam probability)
 * @access  Public
 */
router.get('/safe', async (req, res) => {
  try {
    // First try to get from SafeCoin collection if it exists
    const SafeCoin = mongoose.models.SafeCoin || mongoose.model('SafeCoin', new mongoose.Schema({
      coinAddress: String,
      rank: Number,
      timestamp: Date
    }));
    
    const safeData = await SafeCoin.find().sort({ rank: 1 }).limit(10);
    
    if (safeData && safeData.length > 0) {
      // Get the actual coin data for each safe coin
      const coinAddresses = safeData.map(item => item.coinAddress);
      const safeCoins = await Coin.find({ address: { $in: coinAddresses } });
      
      // Sort by the original ranking
      const sortedCoins = coinAddresses.map(address => 
        safeCoins.find(coin => coin.address === address)
      ).filter(Boolean);
      
      return res.json(sortedCoins);
    }
    
    // Fallback to filtering by scam probability if no safe data
    const safeCoins = await Coin.find({ 
      scamProbability: { $lt: 0.3 },
      marketCap: { $gt: 100000 } // At least $100k market cap
    })
    .sort({ scamProbability: 1 })
    .limit(10);
    
    res.json(safeCoins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/coins/:address
 * @desc    Get coin by address
 * @access  Public
 */
router.get('/:address', async (req, res) => {
  try {
    const coin = await Coin.findOne({ address: req.params.address });
    
    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    
    res.json(coin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/coins/:address/history
 * @desc    Get price history for a coin
 * @access  Public
 */
router.get('/:address/history', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    // Calculate time range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '1h':
        startDate = new Date(now - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 24 * 60 * 60 * 1000);
    }
    
    const history = await PriceHistory.find({
      coinAddress: req.params.address,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });
    
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;