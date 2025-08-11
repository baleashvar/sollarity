const crypto = require('crypto');

// Simple CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }

  // Check for CSRF token in headers
  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
};

// Generate CSRF token
const generateCSRFToken = (req, res, next) => {
  if (!req.session) {
    req.session = {};
  }
  
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  
  next();
};

// Get CSRF token endpoint
const getCSRFToken = (req, res) => {
  res.json({ csrfToken: req.session?.csrfToken });
};

module.exports = {
  csrfProtection,
  generateCSRFToken,
  getCSRFToken
};