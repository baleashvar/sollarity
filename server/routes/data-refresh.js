const express = require('express');
const dataService = require('../services/dataService');
const router = express.Router();

// Manual data refresh endpoint
router.post('/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual data refresh requested...');
    const count = await dataService.refreshAllData();
    res.json({ 
      success: true, 
      message: `Successfully refreshed ${count} tokens`,
      count: count
    });
  } catch (error) {
    console.error('❌ Manual refresh failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Data refresh failed',
      error: error.message 
    });
  }
});

// Get refresh status
router.get('/status', async (req, res) => {
  try {
    const Coin = require('../models/Coin');
    const count = await Coin.countDocuments();
    const latest = await Coin.findOne().sort({ lastUpdated: -1 });
    
    res.json({
      totalTokens: count,
      lastUpdated: latest?.lastUpdated || null,
      status: 'active'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Status check failed' 
    });
  }
});

module.exports = router;