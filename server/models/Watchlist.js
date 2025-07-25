const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinAddress: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  alertSettings: {
    priceChange: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 10 } // 10% change
    },
    volumeSpike: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 50 } // 50% volume increase
    }
  }
});

WatchlistSchema.index({ userId: 1, coinAddress: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);