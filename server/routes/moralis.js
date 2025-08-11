const express = require('express');
const router = express.Router();
const moralisService = require('../services/moralisService');

// Get enhanced token analysis
router.get('/token/:address/analysis', async (req, res) => {
  try {
    const { address } = req.params;
    const analysis = await moralisService.getEnhancedRiskAnalysis(address);
    
    if (analysis) {
      res.json(analysis);
    } else {
      res.status(404).json({ message: 'Analysis not available' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get token liquidity data
router.get('/token/:address/liquidity', async (req, res) => {
  try {
    const { address } = req.params;
    const liquidity = await moralisService.getTokenLiquidity(address);
    
    if (liquidity) {
      res.json(liquidity);
    } else {
      res.status(404).json({ message: 'Liquidity data not available' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get token holder analysis
router.get('/token/:address/holders', async (req, res) => {
  try {
    const { address } = req.params;
    const holders = await moralisService.getTokenHolders(address);
    
    if (holders) {
      res.json(holders);
    } else {
      res.status(404).json({ message: 'Holder data not available' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;