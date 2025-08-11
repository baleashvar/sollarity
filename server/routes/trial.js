const express = require('express');
const router = express.Router();
const Trial = require('../models/Trial');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Claim free trial with Phantom wallet
router.post('/claim', authenticateToken, csrfProtection, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    // Check if wallet already claimed trial
    const existingTrial = await Trial.findOne({ walletAddress });
    if (existingTrial) {
      return res.status(400).json({ message: 'Trial already claimed for this wallet' });
    }

    // Check if user already has trial
    const userTrial = await Trial.findOne({ userId: req.userId });
    if (userTrial) {
      return res.status(400).json({ message: 'Trial already claimed' });
    }

    // Create 14-day trial
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    const trial = new Trial({
      walletAddress,
      userId: req.userId,
      endDate,
      claimed: true
    });

    await trial.save();

    // Update user to premium for trial period
    await User.findByIdAndUpdate(req.userId, {
      isPremium: true,
      premiumExpiry: endDate,
      trialUsed: true
    });

    res.json({ 
      message: 'Free trial activated!', 
      endDate,
      daysRemaining: 14 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check trial status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const trial = await Trial.findOne({ userId: req.userId });
    const user = await User.findById(req.userId);
    
    if (!trial) {
      return res.json({ 
        hasTrialAvailable: !user.trialUsed,
        trialActive: false 
      });
    }

    const now = new Date();
    const isActive = trial.isActive && trial.endDate > now;
    const daysRemaining = isActive ? Math.ceil((trial.endDate - now) / (1000 * 60 * 60 * 24)) : 0;

    res.json({
      hasTrialAvailable: false,
      trialActive: isActive,
      endDate: trial.endDate,
      daysRemaining
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;