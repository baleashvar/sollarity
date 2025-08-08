const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { scheduleDailyReport } = require('./utils/scheduler');
const priceHistoryService = require('./services/priceHistoryService');
const dataService = require('./services/dataService');

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://sollarity.pages.dev',
    'https://sollarity.xyz',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    // Get coins with risk analysis available, sorted by lowest risk
    const coins = await Coin.find({ 
      scamProbability: { $exists: true, $ne: null, $lt: 0.5 },
      marketCap: { $gt: 100000 } // Only coins with decent market cap
    })
    .sort({ scamProbability: 1, marketCap: -1 })
    .limit(20);
    
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Real-time price history
app.get('/api/analytics/history', async (req, res) => {
  try {
    const { address, timeframe = '24h' } = req.query;
    
    console.log(`📊 Fetching price history for ${address} (${timeframe})`);
    
    // Get price history from service
    const points = await priceHistoryService.getPriceHistory(address, timeframe);
    
    // Return empty if no data (don't generate mock data to save resources)
    if (points.length === 0) {
      return res.json({ tf: timeframe, points: [], message: 'No data yet' });
    }
    
    console.log(`📊 Returning ${points.length} real points for ${address}`);
    res.json({ tf: timeframe, points, isReal: true });
    
  } catch (err) {
    console.error('Price history error:', err);
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
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/advertising', require('./routes/advertising'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Sollarity server running on port ${PORT}`);
  
  // Start services
  scheduleDailyReport();
  
  // Start price history service
  await priceHistoryService.start();
  
  // Auto-refresh coin data every 30 minutes using accurate API
  setInterval(async () => {
    try {
      console.log('🔄 Refreshing data...');
      const count = await dataService.refreshAllData();
      console.log(`✅ Refreshed ${count} tokens`);
    } catch (err) {
      console.error('❌ Data refresh error:', err.message);
    }
  }, 30 * 60 * 1000); // Every 30 minutes
  
  // Initial data load
  setTimeout(async () => {
    try {
      console.log('🚀 Initial data load...');
      await dataService.refreshAllData();
    } catch (err) {
      console.error('❌ Initial data load failed:', err.message);
    }
  }, 10000); // Wait 10 seconds
});