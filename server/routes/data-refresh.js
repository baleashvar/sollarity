const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Trigger complete data refresh
router.post('/complete', async (req, res) => {
  try {
    console.log('Triggering complete data refresh with GeckoTerminal...');
    
    const scraperPath = path.join(__dirname, '../../workers/real_data_scraper.py');
    const python = spawn('python', [scraperPath]);
    
    python.stdout.on('data', (data) => {
      console.log(`Scraper: ${data}`);
    });
    
    python.stderr.on('data', (data) => {
      console.error(`Scraper Error: ${data}`);
    });
    
    python.on('close', (code) => {
      console.log(`Complete scraper finished with code ${code}`);
    });
    
    res.json({ 
      message: 'Complete data refresh triggered', 
      status: 'running',
      source: 'GeckoTerminal API',
      includes: 'coins + price history'
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

module.exports = router;