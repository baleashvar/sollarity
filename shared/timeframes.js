const TIMEFRAMES = {
  "1h": { 
    windowMs: 60 * 60 * 1000,
    bucketMs: 60 * 1000,
    labelFmt: "HH:mm" 
  },
  "24h": { 
    windowMs: 24 * 60 * 60 * 1000,
    bucketMs: 30 * 60 * 1000,
    labelFmt: "HH:mm" 
  },
  "7d": { 
    windowMs: 7 * 24 * 60 * 60 * 1000,
    bucketMs: 4 * 60 * 60 * 1000,
    labelFmt: "MMM DD" 
  },
  "30d": { 
    windowMs: 30 * 24 * 60 * 60 * 1000,
    bucketMs: 24 * 60 * 60 * 1000,
    labelFmt: "MMM DD" 
  }
};

module.exports = { TIMEFRAMES };