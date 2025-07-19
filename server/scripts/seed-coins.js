const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

// Define the Coin schema
const CoinSchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  name: { type: String, required: true },
  address: { type: String, required: true, unique: true, index: true },
  image: String,
  description: String,
  website: String,
  twitter: String,
  telegram: String,
  discord: String,
  marketCap: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  priceChange24h: { type: Number, default: 0 },
  liquidityUSD: { type: Number, default: 0 },
  lpBurned: { type: Boolean, default: false },
  holderCount: { type: Number, default: 0 },
  insiderPercentage: { type: Number, default: 0 },
  scamProbability: { type: Number, default: 0, min: 0, max: 1 },
  riskFactors: [{
    factor: String,
    description: String,
    severity: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  launchDate: Date,
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
});

// Create model
const Coin = mongoose.model('Coin', CoinSchema);

// Define the TrendingCoin schema
const TrendingCoinSchema = new mongoose.Schema({
  coinAddress: { type: String, required: true, index: true },
  rank: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create model
const TrendingCoin = mongoose.model('TrendingCoin', TrendingCoinSchema);

// Define the SafeCoin schema
const SafeCoinSchema = new mongoose.Schema({
  coinAddress: { type: String, required: true, index: true },
  rank: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create model
const SafeCoin = mongoose.model('SafeCoin', SafeCoinSchema);

// Sample coins data
const coinsData = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    description: 'USDC is a fully collateralized US dollar stablecoin.',
    website: 'https://www.circle.com/usdc',
    marketCap: 25000000000,
    price: 1.0,
    volume24h: 500000000,
    priceChange24h: 0.001,
    liquidityUSD: 10000000,
    lpBurned: true,
    holderCount: 1000000,
    scamProbability: 0.01,
    isVerified: true
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    description: 'Solana is a high-performance blockchain supporting builders around the world.',
    website: 'https://solana.com',
    marketCap: 15000000000,
    price: 40.5,
    volume24h: 800000000,
    priceChange24h: 0.05,
    liquidityUSD: 50000000,
    lpBurned: true,
    holderCount: 500000,
    scamProbability: 0.01,
    isVerified: true
  },
  {
    symbol: 'WIF',
    name: 'Dogwifhat',
    address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    image: 'https://arweave.net/LRxwmYQoQ1Y-RZsieIQwqJgYhCZVK9I5YbUKuXPAGkk',
    description: 'Dog with a hat meme coin on Solana.',
    website: 'https://dogwifcoin.org',
    marketCap: 800000000,
    price: 1.25,
    volume24h: 50000000,
    priceChange24h: 0.08,
    liquidityUSD: 5000000,
    lpBurned: true,
    holderCount: 100000,
    scamProbability: 0.2,
    isVerified: true
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    image: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    description: 'The first Solana dog coin for the people, by the people.',
    website: 'https://bonkcoin.com',
    marketCap: 600000000,
    price: 0.00002,
    volume24h: 30000000,
    priceChange24h: -0.03,
    liquidityUSD: 3000000,
    lpBurned: true,
    holderCount: 80000,
    scamProbability: 0.15,
    isVerified: true
  },
  {
    symbol: 'SCAM',
    name: 'Scam Token',
    address: 'ScamTokenAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    description: 'A token with suspicious activity and high risk factors.',
    marketCap: 5000000,
    price: 0.0001,
    volume24h: 1000000,
    priceChange24h: 0.5,
    liquidityUSD: 100000,
    lpBurned: false,
    holderCount: 5000,
    scamProbability: 0.95,
    riskFactors: [
      {
        factor: 'Honeypot',
        description: 'Users cannot sell tokens',
        severity: 'high'
      },
      {
        factor: 'Concentration',
        description: 'Top wallet holds 90% of supply',
        severity: 'high'
      }
    ],
    isVerified: false
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
    await Coin.deleteMany({});
    await TrendingCoin.deleteMany({});
    await SafeCoin.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert coins
    const insertedCoins = await Coin.insertMany(coinsData);
    console.log(`Added ${insertedCoins.length} coins`);
    
    // Create trending coins (based on volume)
    const trendingCoins = coinsData
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5)
      .map((coin, index) => ({
        coinAddress: coin.address,
        rank: index + 1,
        timestamp: new Date()
      }));
    
    const insertedTrending = await TrendingCoin.insertMany(trendingCoins);
    console.log(`Added ${insertedTrending.length} trending coins`);
    
    // Create safe coins (based on low scam probability and verified status)
    const safeCoins = coinsData
      .filter(coin => coin.scamProbability < 0.3 && coin.isVerified)
      .sort((a, b) => a.scamProbability - b.scamProbability)
      .slice(0, 4)
      .map((coin, index) => ({
        coinAddress: coin.address,
        rank: index + 1,
        timestamp: new Date()
      }));
    
    const insertedSafe = await SafeCoin.insertMany(safeCoins);
    console.log(`Added ${insertedSafe.length} safe coins`);
    
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