const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function checkUser() {
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
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Password hash:', user.password);
    console.log('Premium:', user.isPremium);

    // Test password verification
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('Password test (password123):', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkUser();