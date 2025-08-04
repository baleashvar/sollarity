const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collectionsToDelete = ['jobs', 'test', 'items', 'requests'];
    
    // Also delete entire devconnector database if it exists
    try {
      await mongoose.connection.db.admin().command({ dropDatabase: 1 }, { dbName: 'devconnector' });
      console.log('✅ Deleted devconnector database');
    } catch (error) {
      if (!error.message.includes('not found')) {
        console.log('⚠️  devconnector database not found or already deleted');
      }
    }
    
    for (const collectionName of collectionsToDelete) {
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        console.log(`✅ Deleted collection: ${collectionName}`);
      } catch (error) {
        if (error.message.includes('ns not found')) {
          console.log(`⚠️  Collection ${collectionName} doesn't exist`);
        } else {
          console.log(`❌ Error deleting ${collectionName}:`, error.message);
        }
      }
    }

    console.log('\n🧹 Database cleanup completed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

cleanupDatabase();