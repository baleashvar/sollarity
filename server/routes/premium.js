const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sollarity_secret_key';

// Upgrade to premium after PayPal payment
router.post('/upgrade', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const { paymentId, planType } = req.body;
    
    // Set premium expiry based on plan
    const expiryDate = new Date();
    if (planType === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planType === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    await User.findByIdAndUpdate(decoded.userId, {
      isPremium: true,
      premiumExpiry: expiryDate
    });
    
    res.json({ message: 'Premium upgrade successful', expiryDate });
  } catch (error) {
    res.status(500).json({ message: 'Upgrade failed', error: error.message });
  }
});

// Check premium status
router.get('/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    const isPremiumActive = user.isPremium && 
      (!user.premiumExpiry || user.premiumExpiry > new Date());
    
    res.json({ 
      isPremium: isPremiumActive,
      expiryDate: user.premiumExpiry 
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;