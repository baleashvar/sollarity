const express = require('express');
const router = express.Router();
const { Referral, ReferralReward } = require('../models/Referral');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Generate referral code
router.get('/code', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const referralCode = `${user.username.toUpperCase()}${req.userId.toString().slice(-4)}`;
    
    res.json({ referralCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply referral code during registration
router.post('/apply', csrfProtection, async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    // Find referrer by code pattern
    const codePattern = referralCode.slice(0, -4);
    const referrer = await User.findOne({ 
      username: { $regex: new RegExp(`^${codePattern}$`, 'i') }
    });
    
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Create referral record
    const referral = new Referral({
      referrerId: referrer._id,
      referredUserId: newUserId,
      referralCode,
      status: 'completed'
    });

    await referral.save();

    // Update referrer's reward count
    let reward = await ReferralReward.findOne({ userId: referrer._id });
    if (!reward) {
      reward = new ReferralReward({ userId: referrer._id });
    }
    
    reward.referralCount += 1;
    
    // Give free month for every 3 referrals
    if (reward.referralCount % 3 === 0) {
      reward.freeMonthsEarned += 1;
      reward.lastRewardDate = new Date();
      
      // Extend referrer's premium
      const premiumEnd = referrer.premiumExpiry || new Date();
      premiumEnd.setMonth(premiumEnd.getMonth() + 1);
      
      await User.findByIdAndUpdate(referrer._id, {
        isPremium: true,
        premiumExpiry: premiumEnd
      });
    }
    
    await reward.save();

    res.json({ 
      message: 'Referral applied successfully',
      referrerRewarded: reward.referralCount % 3 === 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get referral stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const reward = await ReferralReward.findOne({ userId: req.userId });
    const referrals = await Referral.find({ referrerId: req.userId })
      .populate('referredUserId', 'username createdAt');
    
    res.json({
      totalReferrals: reward?.referralCount || 0,
      freeMonthsEarned: reward?.freeMonthsEarned || 0,
      nextRewardAt: 3 - ((reward?.referralCount || 0) % 3),
      referrals: referrals.map(r => ({
        username: r.referredUserId.username,
        joinDate: r.referredUserId.createdAt,
        status: r.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;