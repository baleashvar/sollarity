const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const Coin = require('./models/Coin');
const PriceHistory = require('./models/PriceHistory');

// Coins route with proper filtering
app.get('/api/coins', async (req, res) => {
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
    
    // For free users, limit to first 20 coins only (1 page)
    const limitedTotalPages = isPremium === 'true' ? calculatedTotalPages : 1;
    const limitedCoins = isPremium === 'true' ? coins : coins.slice(0, 20);
    
    res.json({
      coins: limitedCoins,
      totalPages: limitedTotalPages,
      currentPage: Number(page),
      total: isPremium === 'true' ? total : Math.min(total, 20),
      isPremium: isPremium === 'true'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Coin detail route
app.get('/api/coins/detail', async (req, res) => {
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

// Trending coins
app.get('/api/coins/trending', async (req, res) => {
  try {
    const coins = await Coin.find().sort({ volume24h: -1 }).limit(20);
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Safe coins
app.get('/api/coins/safe', async (req, res) => {
  try {
    const coins = await Coin.find({ scamProbability: { $lt: 0.3 } })
      .sort({ scamProbability: 1 }).limit(20);
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Real-time 24h price history
app.get('/api/analytics/history', async (req, res) => {
  try {
    const { address, timeframe = '24h' } = req.query;
    
    // Only support 24h for real-time data
    if (timeframe !== '24h') {
      return res.json({ tf: timeframe, points: [] });
    }
    
    const now = new Date();
    const from = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago
    
    // Try real-time data first, fallback to price history
    let realData = [];
    
    try {
      // Try realtime_prices collection
      const RealtimePrices = mongoose.model('realtime_prices', new mongoose.Schema({
        address: String,
        symbol: String,
        price: Number,
        timestamp: Date
      }));
      
      realData = await RealtimePrices.find({
        address: address,
        timestamp: { $gte: from },
        price: { $gt: 0 }
      }).sort({ timestamp: 1 });
      
      console.log(`Found ${realData.length} real-time points for ${address}`);
    } catch (err) {
      console.log('Real-time collection not found, trying price history...');
    }
    
    // Fallback to existing price history if no real-time data
    if (realData.length === 0) {
      realData = await PriceHistory.find({
        coinAddress: address,
        timestamp: { $gte: from },
        price: { $gt: 0, $ne: null }
      }).sort({ timestamp: 1 });
      
      console.log(`Found ${realData.length} fallback points for ${address}`);
    }
    
    const points = realData.map(point => ({
      t: point.timestamp ? point.timestamp.getTime() : new Date(point.timestamp).getTime(),
      c: point.price || parseFloat(point.price),
      v: point.volume || 1000
    }));
    
    console.log(`[REAL] ${address} 24h ${points.length} real data points`);
    
    res.json({ tf: timeframe, points, isReal: true });
  } catch (err) {
    console.error('Real-time data error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Load other routes
const authRoutes = require('./routes/auth');
const premiumRoutes = require('./routes/premium');
const paypalRoutes = require('./routes/paypalRoutes');
const scamAlertRoutes = require('./routes/scamAlerts');
const refreshRoutes = require('./routes/refresh');
const dataRefreshRoutes = require('./routes/data-refresh');
const testRoutes = require('./routes/test');
const watchlistRoutes = require('./routes/watchlist');

app.use('/api/auth', authRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/payments', paypalRoutes);
app.use('/api/scam-alerts', scamAlertRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/data-refresh', dataRefreshRoutes);
app.use('/api/test', testRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Sollarity server running on port ${PORT}`);
});