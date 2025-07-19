const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/test
 * @desc    Test route to verify API is working
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Sollarity API is working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

module.exports = router;