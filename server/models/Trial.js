const mongoose = require('mongoose');

const TrialSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  claimed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Trial', TrialSchema);