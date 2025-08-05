const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coin = require('../models/Coin');

// Main coins route
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      isPremium = false, 
      sort = 'marketCap', 
      order = 'desc',
      minMarketCap,
      maxScamProbability,
      lpBurned,
      search
    } = req.query;
    
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
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const actualLimit = 20; // Always 20 coins per page for everyone
    
    const coins = await Coin.find(filter)
      .sort(sortObj)
      .limit(actualLimit)
      .skip((Number(page) - 1) * actualLimit);
    
    const total = await Coin.countDocuments(filter);
    
    const calculatedTotalPages = Math.ceil(total / actualLimit);
    
    // Temporarily disabled paywall - everyone gets full access
    res.json({
      coins: coins,
      totalPages: calculatedTotalPages,
      currentPage: Number(page),
      total: total,
      isPremium: true // Everyone is premium during beta
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Trending coins route
router.get('/trending', async (req, res) => {
  try {
    const trendingData = await mongoose.connection.db.collection('trendingcoins').find().sort({ rank: 1 }).limit(20).toArray();
    
    if (trendingData && trendingData.length > 0) {
      const coinAddresses = trendingData.map(item => item.coinAddress);
      const trendingCoins = await Coin.find({ address: { $in: coinAddresses } });
      
      const sortedCoins = coinAddresses.map(address => 
        trendingCoins.find(coin => coin.address === address)
      ).filter(Boolean);
      
      return res.json(sortedCoins);
    }
    
    const trendingCoins = await Coin.find()
      .sort({ volume24h: -1 })
      .limit(20);
    
    res.json(trendingCoins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Safe coins route
router.get('/safe', async (req, res) => {
  try {
    const safeData = await mongoose.connection.db.collection('safecoins').find().sort({ rank: 1 }).limit(20).toArray();
    
    if (safeData && safeData.length > 0) {
      const coinAddresses = safeData.map(item => item.coinAddress);
      const safeCoins = await Coin.find({ address: { $in: coinAddresses } });
      
      const sortedCoins = coinAddresses.map(address => 
        safeCoins.find(coin => coin.address === address)
      ).filter(Boolean);
      
      return res.json(sortedCoins);
    }
    
    const safeCoins = await Coin.find({ 
      scamProbability: { $lt: 0.3 },
      marketCap: { $gt: 100000 }
    })
    .sort({ scamProbability: 1 })
    .limit(20);
    
    res.json(safeCoins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple coin detail route (no complex parameters)
router.get('/detail', async (req, res) => {
  try {
    const { address } = req.query;
    const coin = await Coin.findOne({ address });
    
    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    
    res.json(coin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;