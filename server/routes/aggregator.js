const express = require('express');
const router = express.Router();
const priceAggregator = require('../services/priceAggregator');

// GET /api/aggregator/token/:chain/:address
router.get('/token/:chain/:address', async (req, res) => {
  try {
    const { chain, address } = req.params;
    const data = await priceAggregator.getTokenData(chain, address);
    if (!data) return res.status(404).json({ message: 'Token not found or no data' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Aggregator error' });
  }
});

module.exports = router;
