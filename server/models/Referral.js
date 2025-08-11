const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  rewardClaimed: { type: Boolean, default: false }
}, { timestamps: true });

const ReferralRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCount: { type: Number, default: 0 },
  freeMonthsEarned: { type: Number, default: 0 },
  lastRewardDate: { type: Date }
}, { timestamps: true });

module.exports = {
  Referral: mongoose.model('Referral', ReferralSchema),
  ReferralReward: mongoose.model('ReferralReward', ReferralRewardSchema)
};