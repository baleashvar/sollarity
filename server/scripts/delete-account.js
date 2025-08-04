const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function deleteAccount() {
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

    await User.deleteOne({ _id: user._id });

    console.log('✅ Account deleted successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

deleteAccount();