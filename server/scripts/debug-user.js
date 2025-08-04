const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users with similar names/emails
    const users = await User.find({
      $or: [
        { username: /baleashvar/i },
        { email: /baleashomega/i }
      ]
    });

    console.log(`Found ${users.length} matching users:`);
    
    users.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log('ID:', user._id);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Password hash:', user.password);
      console.log('Premium:', user.isPremium);
      console.log('Created:', user.createdAt);
    });

    // Test login for each user
    for (const user of users) {
      console.log(`\n--- Testing login for ${user.username} ---`);
      const isValid = await user.comparePassword('password123');
      console.log('Password "password123":', isValid ? '✅ Valid' : '❌ Invalid');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

debugUser();