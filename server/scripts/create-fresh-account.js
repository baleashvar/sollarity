const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function createFreshAccount() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing user if exists
    await User.deleteOne({
      $or: [
        { username: 'baleashvar' },
        { email: 'baleashomega@gmail.com' }
      ]
    });

    // Create fresh account
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const newUser = new User({
      username: 'baleashvar',
      email: 'baleashomega@gmail.com',
      password: hashedPassword,
      isPremium: true,
      premiumExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });

    await newUser.save();

    console.log('✅ Fresh premium account created!');
    console.log('Username: baleashvar');
    console.log('Email: baleashomega@gmail.com');
    console.log('Password: password123');
    console.log('Premium: true');

    // Test password
    const isValid = await bcrypt.compare('password123', newUser.password);
    console.log('Password verification test:', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

createFreshAccount();