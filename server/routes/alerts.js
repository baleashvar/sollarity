const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');

// Webhook endpoint for receiving alerts
router.post('/webhook', async (req, res) => {
  try {
    console.log('Alert webhook received:', req.body);
    res.json({ status: 'received' });
  } catch (error) {
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Manual alert test
router.post('/test', async (req, res) => {
  try {
    const { type, message } = req.body;
    
    if (type === 'telegram') {
      await alertService.sendTelegramAlert(message || 'Test alert from Sollarity');
    } else {
      await alertService.sendWebhookAlert({
        type: 'test',
        message: message || 'Test webhook alert',
        timestamp: new Date()
      });
    }
    
    res.json({ message: 'Test alert sent' });
  } catch (error) {
    res.status(500).json({ message: 'Alert test failed' });
  }
});

module.exports = router;