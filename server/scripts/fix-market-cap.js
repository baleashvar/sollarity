const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', 'config', '.env') });

const Coin = require('../models/Coin');

async function fixMarketCap() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find coins with suspicious market caps (over $100B)
    const suspiciousCoins = await Coin.find({
      marketCap: { $gt: 100000000000 } // Over $100B
    }).sort({ marketCap: -1 });

    console.log(`Found ${suspiciousCoins.length} coins with suspicious market caps:`);
    
    for (const coin of suspiciousCoins) {
      console.log(`${coin.symbol}: $${(coin.marketCap / 1000000000).toFixed(2)}B (Price: $${coin.price})`);
      
      // If price is reasonable but market cap is huge, likely a supply issue
      if (coin.price > 0 && coin.price < 1000000) {
        // Calculate reasonable market cap based on typical supply ranges
        // For most tokens, supply is between 1M - 1B tokens
        const reasonableSupply = Math.min(1000000000, coin.marketCap / coin.price);
        const newMarketCap = coin.price * reasonableSupply;
        
        // If the new market cap is more reasonable (under $10B), update it
        if (newMarketCap < 10000000000) {
          await Coin.updateOne(
            { _id: coin._id },
            { marketCap: newMarketCap }
          );
          console.log(`  → Fixed: $${(newMarketCap / 1000000).toFixed(2)}M`);
        }
      }
    }

    // Also check for tBTC specifically
    const tbtc = await Coin.findOne({ 
      $or: [
        { symbol: /tBTC/i },
        { name: /threshold bitcoin/i }
      ]
    });

    if (tbtc) {
      console.log(`\nFound tBTC: ${tbtc.symbol}`);
      console.log(`Current market cap: $${(tbtc.marketCap / 1000000000).toFixed(2)}B`);
      console.log(`Price: $${tbtc.price}`);
      
      // tBTC should have a market cap around $7-10M based on your research
      if (tbtc.marketCap > 1000000000) { // Over $1B
        await Coin.updateOne(
          { _id: tbtc._id },
          { marketCap: 7400000 } // Set to $7.4M as per your research
        );
        console.log('✅ Fixed tBTC market cap to $7.4M');
      }
    }

    console.log('\n✅ Market cap fix completed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixMarketCap();