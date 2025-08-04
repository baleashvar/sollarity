const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function makePremium() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({
      $or: [
        { username: 'baleashvar' },
        { email: 'baleashomega@gmail.com' }
      ]
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', user.username, user.email);

    user.isPremium = true;
    user.premiumExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    await user.save();

    console.log('✅ User upgraded to Premium!');
    console.log('Premium expires:', user.premiumExpiry);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

makePremium();