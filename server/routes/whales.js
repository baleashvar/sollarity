const express = require('express');
const router = express.Router();
const solanafmService = require('../services/solanafmService');

// Get top whale wallets
router.get('/top', async (req, res) => {
  try {
    const whales = await solanafmService.getTopWallets();
    res.json(whales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch whale data' });
  }
});

// Get whale transactions
router.get('/transactions', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const transactions = await solanafmService.getWhaleTransactions(parseInt(limit));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch whale transactions' });
  }
});

// Get specific wallet activity
router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 20 } = req.query;
    const activity = await solanafmService.getWalletActivity(address, parseInt(limit));
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallet activity' });
  }
});

module.exports = router;