const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const { sanitizeForLog } = require('../utils/sanitize');

// Create PayPal order (requires auth and CSRF protection)
router.post('/create-order', authenticateToken, csrfProtection, paypalController.createOrder);

// Capture payment for an order (requires auth and CSRF protection)
router.post('/capture', authenticateToken, csrfProtection, paypalController.capturePayment);

// Get subscription plans
router.get('/plans', paypalController.getPlans);

// Record payment (for client-side PayPal integration)
router.post('/record-payment', authenticateToken, csrfProtection, (req, res) => {
  // In a real app, you would save this to your database
  console.log('Payment recorded:', sanitizeForLog(JSON.stringify(req.body)));
  res.status(200).json({ success: true });
});

module.exports = router;