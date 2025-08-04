const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function testPasswords() {
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
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.username, user.email);
    console.log('Password hash:', user.password);

    // Test common passwords
    const testPasswords = [
      'password123',
      'Password123',
      'password',
      'Password',
      '123456789',
      'baleashvar123',
      'test123456'
    ];

    for (const pwd of testPasswords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      console.log(`Testing "${pwd}":`, isValid ? '✅ MATCH' : '❌ No match');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testPasswords();