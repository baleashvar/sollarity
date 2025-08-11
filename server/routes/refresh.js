const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Data refresh requires authentication (admin only)
router.post('/data', authenticateToken, csrfProtection, async (req, res) => {
  // Check if user is admin (you can add admin role to User model)
  if (req.user.email !== 'sollarity1@gmail.com') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  try {
    console.log('Triggering data refresh...');
    
    // Run quick scraper for faster updates
    const scraperPath = path.join(__dirname, '../../workers/quick_scraper.py');
    const python = spawn('python', [scraperPath]);
    
    python.on('close', (code) => {
      console.log(`Scraper finished with code ${code}`);
    });
    
    res.json({ message: 'Data refresh triggered', status: 'running' });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

module.exports = router;