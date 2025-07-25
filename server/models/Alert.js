const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinAddress: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    enum: ['price_change', 'volume_spike', 'scam_detected'],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);