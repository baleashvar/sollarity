const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const User = require('../models/User');

async function checkProductionUser() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI ? 'MongoDB configured' : 'No MongoDB URI');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({
      $or: [
        { username: 'baleashvar' },
        { email: 'baleashomega@gmail.com' }
      ]
    });

    if (!user) {
      console.log('❌ User NOT found in production database');
      
      // Show all users
      const allUsers = await User.find({}).select('username email isPremium');
      console.log(`\nAll users in database (${allUsers.length}):`);
      allUsers.forEach(u => console.log(`- ${u.username} (${u.email}) - Premium: ${u.isPremium}`));
      return;
    }

    console.log('✅ User found in production:');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Premium:', user.isPremium);
    
    const isValid = await user.comparePassword('password123');
    console.log('Password test:', isValid ? '✅ Valid' : '❌ Invalid');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

checkProductionUser();