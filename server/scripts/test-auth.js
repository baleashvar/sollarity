const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function testAuth() {
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

    // Test the comparePassword method
    const testPassword = 'password123';
    const isValid = await user.comparePassword(testPassword);
    console.log(`comparePassword("${testPassword}"):`, isValid ? '✅ Valid' : '❌ Invalid');

    // Test direct bcrypt compare
    const bcrypt = require('bcryptjs');
    const directTest = await bcrypt.compare(testPassword, user.password);
    console.log(`Direct bcrypt.compare("${testPassword}"):`, directTest ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testAuth();