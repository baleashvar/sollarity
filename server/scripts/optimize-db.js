const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

async function optimizeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Create indexes for better performance
    await db.collection('pricehistories').createIndex({ symbol: 1 });
    await db.collection('coins').createIndex({ symbol: 1 });
    await db.collection('coins').createIndex({ address: 1 });
    
    console.log('✅ Indexes created');
    
    // Clean up any old price history format
    const oldCount = await db.collection('pricehistories').countDocuments({ coinAddress: { $exists: true } });
    if (oldCount > 0) {
      await db.collection('pricehistories').deleteMany({ coinAddress: { $exists: true } });
      console.log(`🗑️ Cleaned ${oldCount} old price records`);
    }
    
    console.log('✅ Database optimized for M0 tier');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

optimizeDatabase();