const axios = require('axios');
const Coin = require('../models/Coin');

class DataService {
  constructor() {
    this.birdeyeAPI = 'https://public-api.birdeye.so';
    this.headers = {
      'X-API-KEY': process.env.BIRDEYE_API_KEY
    };
  }

  async fetchTop1000SolanaTokens() {
    try {
      console.log('🔍 Fetching top 1000 Solana tokens...');
      
      const response = await axios.get(`${this.birdeyeAPI}/defi/tokenlist`, {
        headers: this.headers,
        params: {
          sort_by: 'mc',
          sort_type: 'desc',
          offset: 0,
          limit: 1000
        },
        timeout: 30000
      });

      if (response.data?.data?.tokens) {
        const tokens = response.data.data.tokens;
        console.log(`✅ Fetched ${tokens.length} tokens from Birdeye`);
        return this.processTokenData(tokens);
      }

      return [];
    } catch (error) {
      console.error('❌ Birdeye API error:', error.message);
      return [];
    }
  }

  processTokenData(tokens) {
    return tokens.map(token => {
      // Calculate accurate market cap using circulating supply
      const price = parseFloat(token.price || 0);
      const supply = parseFloat(token.realSupply || token.supply || 0);
      const marketCap = price * supply;

      return {
        address: token.address,
        name: token.name || 'Unknown',
        symbol: token.symbol || 'UNK',
        price: price,
        marketCap: marketCap,
        volume24h: parseFloat(token.v24hUSD || 0),
        priceChange24h: parseFloat(token.priceChange24hPercent || 0) / 100,
        liquidityUSD: parseFloat(token.liquidity?.usd || 0),
        holderCount: parseInt(token.numberMarkets || 0),
        lpBurned: !token.freeze_authority, // No freeze authority = LP likely burned
        scamProbability: this.calculateRiskScore(token),
        image: token.logoURI || '',
        supply: supply,
        lastUpdated: new Date()
      };
    }).filter(token => token.price > 0 && token.marketCap > 1000); // Filter out invalid tokens
  }

  calculateRiskScore(token) {
    let risk = 0;
    
    // Low liquidity risk
    const liquidity = parseFloat(token.liquidity?.usd || 0);
    if (liquidity < 10000) risk += 0.3;
    else if (liquidity < 50000) risk += 0.1;
    
    // Low market cap risk
    const price = parseFloat(token.price || 0);
    const supply = parseFloat(token.realSupply || token.supply || 0);
    const marketCap = price * supply;
    if (marketCap < 100000) risk += 0.2;
    
    // Freeze authority risk
    if (token.freeze_authority) risk += 0.3;
    
    // Few markets risk
    const markets = parseInt(token.numberMarkets || 0);
    if (markets < 2) risk += 0.2;
    
    return Math.min(risk, 1.0);
  }

  async updateDatabase(tokens) {
    if (!tokens || tokens.length === 0) {
      console.log('❌ No tokens to update');
      return;
    }

    console.log(`💾 Updating database with ${tokens.length} tokens...`);

    try {
      const bulkOps = tokens.map(token => ({
        updateOne: {
          filter: { address: token.address },
          update: { $set: token },
          upsert: true
        }
      }));

      const result = await Coin.bulkWrite(bulkOps, { ordered: false });
      console.log(`✅ Updated ${result.modifiedCount} tokens, inserted ${result.upsertedCount} new tokens`);
      
      return result;
    } catch (error) {
      console.error('❌ Database update error:', error.message);
      throw error;
    }
  }

  async refreshAllData() {
    try {
      const tokens = await this.fetchTop1000SolanaTokens();
      if (tokens.length > 0) {
        await this.updateDatabase(tokens);
        console.log(`🎉 Successfully refreshed ${tokens.length} tokens`);
        return tokens.length;
      }
      return 0;
    } catch (error) {
      console.error('❌ Data refresh failed:', error.message);
      throw error;
    }
  }
}

module.exports = new DataService();