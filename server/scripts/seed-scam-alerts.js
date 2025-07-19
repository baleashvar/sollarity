const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

// Define the ScamAlert schema
const ScamAlertSchema = new mongoose.Schema({
  coinName: String,
  coinSymbol: String,
  coinAddress: String,
  alertType: String,
  description: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create model
const ScamAlert = mongoose.model('ScamAlert', ScamAlertSchema);

// Sample scam alerts data
const scamAlertsData = [
  {
    coinName: 'SCAM Token',
    coinSymbol: 'SCAM',
    coinAddress: 'ScamTokenAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    alertType: 'Honeypot',
    description: 'This token has been identified as a honeypot. Users can buy but cannot sell tokens.',
    severity: 'high',
    timestamp: new Date()
  },
  {
    coinName: 'Fake BONK',
    coinSymbol: 'FBONK',
    coinAddress: 'FakeBonkAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    alertType: 'Impersonation',
    description: 'This token is impersonating the popular BONK token. Check addresses carefully.',
    severity: 'high',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    coinName: 'Rug Pull Coin',
    coinSymbol: 'RUG',
    coinAddress: 'RugPullAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    alertType: 'Suspicious Activity',
    description: 'Developer wallet holds over 90% of tokens. High risk of rug pull.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    coinName: 'Pump and Dump',
    coinSymbol: 'PUMP',
    coinAddress: 'PumpDumpAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    alertType: 'Market Manipulation',
    description: 'Suspicious trading patterns detected. Likely pump and dump scheme.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    coinName: 'Unlocked LP',
    coinSymbol: 'ULP',
    coinAddress: 'UnlockedLPAddressXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    alertType: 'Liquidity Risk',
    description: 'Liquidity pool tokens are not locked or burned. Developer can remove liquidity at any time.',
    severity: 'low',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    // Clear existing data
    await ScamAlert.deleteMany({});
    console.log('Cleared existing scam alerts');
    
    // Insert new data
    const inserted = await ScamAlert.insertMany(scamAlertsData);
    console.log(`Added ${inserted.length} scam alerts`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});