const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Coin = require('../models/Coin');
const PriceHistory = require('../models/PriceHistory');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

// Sample coin data
const sampleCoins = [
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    image: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg',
    description: 'The first Solana dog coin for the people, by the people.',
    website: 'https://bonkcoin.com',
    twitter: 'https://twitter.com/bonk_inu',
    telegram: 'https://t.me/bonktoken',
    discord: 'https://discord.gg/bonk',
    marketCap: 750000000,
    price: 0.00001234,
    volume24h: 25000000,
    priceChange24h: 5.2,
    liquidityUSD: 15000000,
    lpBurned: true,
    holderCount: 450000,
    insiderPercentage: 12,
    scamProbability: 0.05,
    riskFactors: [
      {
        factor: 'Large holder concentration',
        description: 'Top 10 wallets hold significant supply',
        severity: 'medium'
      }
    ],
    launchDate: new Date('2022-12-25'),
    isActive: true,
    isVerified: true
  },
  {
    symbol: 'WIF',
    name: 'Dogwifhat',
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    image: 'https://assets.coingecko.com/coins/images/33969/small/wif.png',
    description: 'A dog with a hat. Simple as that.',
    website: 'https://dogwifcoin.org',
    twitter: 'https://twitter.com/dogwifcoin',
    telegram: 'https://t.me/dogwifcoin',
    discord: 'https://discord.gg/dogwifcoin',
    marketCap: 1200000000,
    price: 2.45,
    volume24h: 45000000,
    priceChange24h: -2.8,
    liquidityUSD: 25000000,
    lpBurned: true,
    holderCount: 320000,
    insiderPercentage: 15,
    scamProbability: 0.08,
    riskFactors: [
      {
        factor: 'Rapid price growth',
        description: 'Price increased over 1000% in first month',
        severity: 'low'
      }
    ],
    launchDate: new Date('2023-11-10'),
    isActive: true,
    isVerified: true
  },
  {
    symbol: 'POPCAT',
    name: 'Popcat',
    address: 'P0PCATrQfUQAUYXgYN9Q9YT1kcZJ1Tp8h4MtqaZPNfA',
    image: 'https://assets.coingecko.com/coins/images/33816/small/popcat.png',
    description: 'Popcat is a meme coin inspired by the viral internet meme.',
    website: 'https://popcat.io',
    twitter: 'https://twitter.com/popcatsolana',
    telegram: 'https://t.me/popcatsolana',
    discord: 'https://discord.gg/popcat',
    marketCap: 85000000,
    price: 0.0085,
    volume24h: 12000000,
    priceChange24h: 15.7,
    liquidityUSD: 5000000,
    lpBurned: true,
    holderCount: 120000,
    insiderPercentage: 18,
    scamProbability: 0.12,
    riskFactors: [
      {
        factor: 'New project',
        description: 'Limited trading history',
        severity: 'medium'
      }
    ],
    launchDate: new Date('2023-12-15'),
    isActive: true,
    isVerified: true
  },
  {
    symbol: 'BOME',
    name: 'Book of Meme',
    address: 'B0MEaypbRPUCyEAUE5qPMS7QQpBZiUfNPWrVVTMnZk9',
    image: 'https://assets.coingecko.com/coins/images/35105/small/bome.png',
    description: 'The Book of Meme (BOME) is the sacred text of the memetic revolution.',
    website: 'https://bookofmeme.io',
    twitter: 'https://twitter.com/bookofmeme',
    telegram: 'https://t.me/bookofmeme',
    discord: 'https://discord.gg/bookofmeme',
    marketCap: 320000000,
    price: 0.032,
    volume24h: 35000000,
    priceChange24h: 8.3,
    liquidityUSD: 12000000,
    lpBurned: true,
    holderCount: 180000,
    insiderPercentage: 20,
    scamProbability: 0.15,
    riskFactors: [
      {
        factor: 'High volatility',
        description: 'Price swings of >30% in 24h periods',
        severity: 'medium'
      }
    ],
    launchDate: new Date('2024-01-20'),
    isActive: true,
    isVerified: true
  },
  {
    symbol: 'SLERF',
    name: 'Slerf',
    address: 'SLRFZKbRUMpoXnGYMZKxrPGgZS8CjCVL5RVPT3GPiGd',
    image: 'https://assets.coingecko.com/coins/images/35243/small/slerf.png',
    description: 'Slerf is a community-driven meme coin on Solana.',
    website: 'https://slerf.io',
    twitter: 'https://twitter.com/slerfsolana',
    telegram: 'https://t.me/slerfsolana',
    discord: 'https://discord.gg/slerf',
    marketCap: 150000000,
    price: 0.015,
    volume24h: 28000000,
    priceChange24h: -5.4,
    liquidityUSD: 8000000,
    lpBurned: true,
    holderCount: 95000,
    insiderPercentage: 25,
    scamProbability: 0.18,
    riskFactors: [
      {
        factor: 'Concentrated ownership',
        description: 'Top wallet holds >10% of supply',
        severity: 'high'
      }
    ],
    launchDate: new Date('2024-02-10'),
    isActive: true,
    isVerified: true
  },
  {
    symbol: 'SCAMCOIN',
    name: 'Obvious Scam',
    address: 'SC4Mc01nS0L4n4T0k3nRu9F4k3',
    image: 'https://example.com/scam.png',
    description: 'This is an example of a high-risk token.',
    website: 'https://scamcoin.example',
    twitter: 'https://twitter.com/scamcoin',
    telegram: 'https://t.me/scamcoin',
    discord: 'https://discord.gg/scamcoin',
    marketCap: 5000000,
    price: 0.0001,
    volume24h: 500000,
    priceChange24h: 150.0,
    liquidityUSD: 100000,
    lpBurned: false,
    holderCount: 5000,
    insiderPercentage: 85,
    scamProbability: 0.95,
    riskFactors: [
      {
        factor: 'Extreme concentration',
        description: 'Developer wallet holds >80% of supply',
        severity: 'high'
      },
      {
        factor: 'Liquidity risk',
        description: 'LP tokens not burned, can be removed at any time',
        severity: 'high'
      },
      {
        factor: 'Suspicious contract',
        description: 'Contains functions that allow minting of new tokens',
        severity: 'high'
      }
    ],
    launchDate: new Date('2024-03-01'),
    isActive: true,
    isVerified: false
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sollarity', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    // Clear existing data
    await Coin.deleteMany({});
    await PriceHistory.deleteMany({});
    console.log('Existing data cleared');
    
    // Insert sample coins
    const insertedCoins = await Coin.insertMany(sampleCoins);
    console.log(`${insertedCoins.length} coins inserted`);
    
    // Create some price history for each coin
    const priceHistoryData = [];
    
    for (const coin of insertedCoins) {
      const now = new Date();
      
      // Create 30 days of price history
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Generate some random price fluctuation
        const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
        const historicalPrice = coin.price * randomFactor;
        
        priceHistoryData.push({
          coinAddress: coin.address,
          timestamp: date,
          price: historicalPrice,
          marketCap: coin.marketCap * randomFactor,
          volume: coin.volume24h * (0.5 + Math.random()),
          liquidityUSD: coin.liquidityUSD * randomFactor,
          holderCount: Math.floor(coin.holderCount * (0.95 + (i * 0.002)))
        });
      }
    }
    
    await PriceHistory.insertMany(priceHistoryData);
    console.log(`${priceHistoryData.length} price history records inserted`);
    
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
  process.exit(1);
});