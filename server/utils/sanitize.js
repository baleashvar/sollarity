// Sanitize user input for logging to prevent log injection
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Remove or escape potentially dangerous characters
  return input
    .replace(/[\r\n]/g, '') // Remove line breaks
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .replace(/[<>]/g, (match) => match === '<' ? '&lt;' : '&gt;') // Escape HTML
    .substring(0, 200); // Limit length
};

// Sanitize object for logging
const sanitizeObjectForLog = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeForLog(obj);
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeForLog(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObjectForLog(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

module.exports = {
  sanitizeForLog,
  sanitizeObjectForLog
};