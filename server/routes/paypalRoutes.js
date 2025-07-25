const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// Create PayPal order
router.post('/create-order', paypalController.createOrder);

// Capture payment for an order (using query parameter instead)
router.post('/capture', paypalController.capturePayment);

// Get subscription plans
router.get('/plans', paypalController.getPlans);

// Record payment (for client-side PayPal integration)
router.post('/record-payment', (req, res) => {
  // In a real app, you would save this to your database
  console.log('Payment recorded:', req.body);
  res.status(200).json({ success: true });
});

module.exports = router;