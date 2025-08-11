const express = require('express');
const jwt = require('jsonwebtoken');
const Watchlist = require('../models/Watchlist');
const Coin = require('../models/Coin');
const Alert = require('../models/Alert');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sollarity_secret_key';

// Add to watchlist
router.post('/add', authenticateToken, csrfProtection, async (req, res) => {
  try {
    const { coinAddress } = req.body;
    
    const watchlistItem = new Watchlist({
      userId: req.userId,
      coinAddress
    });
    
    await watchlistItem.save();
    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from watchlist
router.delete('/remove', authenticateToken, csrfProtection, async (req, res) => {
  try {
    const { address } = req.query;
    
    await Watchlist.findOneAndDelete({
      userId: req.userId,
      coinAddress: address
    });
    
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user watchlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.userId });
    const coinAddresses = watchlist.map(item => item.coinAddress);
    const coins = await Coin.find({ address: { $in: coinAddresses } });
    
    res.json({ coins, watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set price alert
router.post('/alert', authenticateToken, csrfProtection, async (req, res) => {
  try {
    const { coinAddress, alertType, threshold } = req.body;
    
    const alert = new Alert({
      userId: req.userId,
      coinAddress,
      alertType,
      threshold
    });
    
    await alert.save();
    res.json({ message: 'Alert created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;