const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define a simple schema for scam alerts
const ScamAlertSchema = new mongoose.Schema({
  coinName: String,
  coinSymbol: String,
  coinAddress: String,
  alertType: String,
  description: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create model if it doesn't exist
const ScamAlert = mongoose.models.ScamAlert || mongoose.model('ScamAlert', ScamAlertSchema);

/**
 * @route   GET /api/scam-alerts
 * @desc    Get all scam alerts
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const alerts = await ScamAlert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;