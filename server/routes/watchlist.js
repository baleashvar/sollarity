const express = require('express');
const jwt = require('jsonwebtoken');
const Watchlist = require('../models/Watchlist');
const Coin = require('../models/Coin');
const Alert = require('../models/Alert');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sollarity_secret_key';

// Add to watchlist
router.post('/add', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const { coinAddress } = req.body;
    
    const watchlistItem = new Watchlist({
      userId: decoded.userId,
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
router.delete('/remove', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const { address } = req.query;
    
    await Watchlist.findOneAndDelete({
      userId: decoded.userId,
      coinAddress: address
    });
    
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user watchlist
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const watchlist = await Watchlist.find({ userId: decoded.userId });
    const coinAddresses = watchlist.map(item => item.coinAddress);
    const coins = await Coin.find({ address: { $in: coinAddresses } });
    
    res.json({ coins, watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Set price alert
router.post('/alert', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const { coinAddress, alertType, threshold } = req.body;
    
    const alert = new Alert({
      userId: decoded.userId,
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