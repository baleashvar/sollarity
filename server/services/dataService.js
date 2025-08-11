const axios = require('axios');
const Coin = require('../models/Coin');
const { sanitizeForLog } = require('../utils/sanitize');

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
          limit: 100
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
      console.error('❌ Birdeye API error:', sanitizeForLog(error.message));
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
    let risk = 0.1; // Base risk for all tokens
    let dataAvailable = false;
    
    // Low liquidity risk
    const liquidity = parseFloat(token.liquidity?.usd || 0);
    if (liquidity > 0) {
      dataAvailable = true;
      if (liquidity < 10000) risk += 0.2;
      else if (liquidity < 50000) risk += 0.1;
    }
    
    // Low market cap risk
    const price = parseFloat(token.price || 0);
    const supply = parseFloat(token.realSupply || token.supply || 0);
    const marketCap = price * supply;
    if (marketCap > 0) {
      dataAvailable = true;
      if (marketCap < 100000) risk += 0.15;
      else if (marketCap < 1000000) risk += 0.05;
    }
    
    // Freeze authority risk
    if (token.freeze_authority !== undefined) {
      dataAvailable = true;
      if (token.freeze_authority) risk += 0.2;
    }
    
    // Few markets risk
    const markets = parseInt(token.numberMarkets || 0);
    if (markets >= 0) {
      dataAvailable = true;
      if (markets < 2) risk += 0.15;
      else if (markets >= 5) risk -= 0.05; // Bonus for many markets
    }
    
    // If no data available, return moderate risk
    if (!dataAvailable) {
      return 0.5;
    }
    
    return Math.min(Math.max(risk, 0.05), 0.95); // Keep between 5% and 95%
  }

  getTokenImage(symbol) {
    // Return empty string if no symbol or if symbol is generic
    if (!symbol || symbol === 'UNK' || symbol === 'Unknown') return '';
    
    // Use CoinGecko's token image API as fallback
    const cleanSymbol = symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://assets.coingecko.com/coins/images/1/small/${cleanSymbol}.png`;
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
      console.error('❌ Database update error:', sanitizeForLog(error.message));
      throw error;
    }
  }

  async fetchFromJupiter() {
    try {
      console.log('🔍 Fetching from Jupiter API as fallback...');
      
      const response = await axios.get('https://token.jup.ag/all', {
        timeout: 30000
      });

      if (response.data && Array.isArray(response.data)) {
        const tokens = response.data.slice(0, 300); // Get first 300 tokens
        console.log(`✅ Fetched ${tokens.length} tokens from Jupiter`);
        
        // Get price data for these tokens
        const tokensWithPrices = await this.addPriceData(tokens);
        return this.processJupiterData(tokensWithPrices);
      }

      return [];
    } catch (error) {
      console.error('❌ Jupiter API error:', error.message);
      return [];
    }
  }

  processJupiterData(tokens) {
    return tokens.map(token => {
      const price = parseFloat(token.priceData?.price || 0);
      const supply = parseFloat(token.priceData?.supply || 0);
      const marketCap = price * supply;
      const liquidity = parseFloat(token.priceData?.liquidity || 0);
      
      return {
        address: token.address,
        name: token.name || 'Unknown',
        symbol: token.symbol || 'UNK',
        price: price,
        marketCap: marketCap,
        volume24h: parseFloat(token.priceData?.volume24h || 0),
        priceChange24h: parseFloat(token.priceData?.priceChange24h || 0) / 100,
        liquidityUSD: liquidity > 0 ? liquidity : null,
        holderCount: 0,
        lpBurned: false,
        scamProbability: this.calculateRiskScore({
          liquidity: { usd: liquidity },
          price: price,
          realSupply: supply,
          freeze_authority: false,
          numberMarkets: 1
        }),
        image: token.logoURI || this.getTokenImage(token.symbol),
        supply: supply,
        lastUpdated: new Date()
      };
    }).filter(token => token.address && token.symbol && token.name !== 'Unknown' && token.price > 0);
  }

  async fetchFromHelius() {
    try {
      console.log('🔍 Fetching from Helius API...');
      
      const response = await axios.get('https://api.helius.xyz/v0/token-metadata', {
        headers: {
          'Authorization': `Bearer ${process.env.HELIUS_API_KEY}`
        },
        params: {
          'mint-accounts': 'popular', // Get popular tokens
          'limit': 200
        },
        timeout: 30000
      });

      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Fetched ${response.data.length} tokens from Helius`);
        return this.processHeliusData(response.data);
      }

      return [];
    } catch (error) {
      console.error('❌ Helius API error:', error.message);
      return [];
    }
  }

  async fetchFromDexScreener() {
    try {
      console.log('🔍 Fetching from DexScreener API...');
      
      const response = await axios.get('https://api.dexscreener.com/latest/dex/search/?q=SOL', {
        timeout: 30000
      });

      if (response.data?.pairs) {
        const solPairs = response.data.pairs
          .filter(pair => pair.chainId === 'solana' && pair.baseToken?.address)
          .slice(0, 200);
        
        console.log(`✅ Fetched ${solPairs.length} tokens from DexScreener`);
        return this.processDexScreenerData(solPairs);
      }

      return [];
    } catch (error) {
      console.error('❌ DexScreener API error:', error.message);
      return [];
    }
  }

  async fetchFromCoinGecko() {
    try {
      console.log('🔍 Fetching from CoinGecko API...');
      
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          'vs_currency': 'usd',
          'category': 'solana-ecosystem',
          'order': 'market_cap_desc',
          'per_page': 250,
          'page': 1
        },
        timeout: 30000
      });

      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Fetched ${response.data.length} tokens from CoinGecko`);
        return this.processCoinGeckoData(response.data);
      }

      return [];
    } catch (error) {
      console.error('❌ CoinGecko API error:', error.message);
      return [];
    }
  }

  processHeliusData(tokens) {
    return tokens.map(token => ({
      address: token.mint || token.address,
      name: token.onChainMetadata?.metadata?.name || token.name || 'Unknown',
      symbol: token.onChainMetadata?.metadata?.symbol || token.symbol || 'UNK',
      price: 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      liquidityUSD: null,
      holderCount: 0,
      lpBurned: false,
      scamProbability: 0.5,
      image: token.onChainMetadata?.metadata?.image || '',
      supply: 0,
      lastUpdated: new Date()
    })).filter(token => token.address && token.symbol);
  }

  processDexScreenerData(pairs) {
    return pairs.map(pair => {
      const price = parseFloat(pair.priceUsd || 0);
      const supply = parseFloat(pair.baseToken?.totalSupply || 0);
      const marketCap = parseFloat(pair.marketCap || price * supply);
      const liquidity = parseFloat(pair.liquidity?.usd || 0);
      
      return {
        address: pair.baseToken.address,
        name: pair.baseToken.name || 'Unknown',
        symbol: pair.baseToken.symbol || 'UNK',
        price: price,
        marketCap: marketCap,
        volume24h: parseFloat(pair.volume?.h24 || 0),
        priceChange24h: parseFloat(pair.priceChange?.h24 || 0) / 100,
        liquidityUSD: liquidity > 0 ? liquidity : null,
        holderCount: 0,
        lpBurned: false,
        scamProbability: this.calculateRiskScore({
          liquidity: { usd: liquidity },
          price: price,
          realSupply: supply,
          freeze_authority: false,
          numberMarkets: 2
        }),
        image: pair.info?.imageUrl || this.getTokenImage(pair.baseToken.symbol),
        supply: supply,
        lastUpdated: new Date()
      };
    }).filter(token => token.price > 0 && token.marketCap > 1000);
  }

  processCoinGeckoData(tokens) {
    return tokens.map(token => ({
      address: token.id, // CoinGecko uses ID, we'll need to map this
      name: token.name || 'Unknown',
      symbol: token.symbol?.toUpperCase() || 'UNK',
      price: parseFloat(token.current_price || 0),
      marketCap: parseFloat(token.market_cap || 0),
      volume24h: parseFloat(token.total_volume || 0),
      priceChange24h: parseFloat(token.price_change_percentage_24h || 0) / 100,
      liquidityUSD: null,
      holderCount: 0,
      lpBurned: false,
      scamProbability: token.market_cap < 1000000 ? 0.7 : 0.3,
      image: token.image || '',
      supply: parseFloat(token.circulating_supply || 0),
      lastUpdated: new Date()
    })).filter(token => token.price > 0);
  }

  async addPriceData(tokens) {
    try {
      // Get addresses for price lookup (limit to 50 for better performance)
      const addresses = tokens.slice(0, 50).map(t => t.address);
      
      // Try DexScreener API for Solana tokens
      const dexResponse = await axios.get('https://api.dexscreener.com/latest/dex/tokens/' + addresses.join(','), {
        timeout: 15000
      });
      
      if (dexResponse.data?.pairs) {
        const pairs = dexResponse.data.pairs;
        
        return tokens.map(token => {
          const pair = pairs.find(p => p.baseToken?.address === token.address);
          if (pair) {
            token.priceData = {
              price: parseFloat(pair.priceUsd || 0),
              supply: parseFloat(pair.baseToken?.totalSupply || 0),
              volume24h: parseFloat(pair.volume?.h24 || 0),
              priceChange24h: parseFloat(pair.priceChange?.h24 || 0),
              liquidity: parseFloat(pair.liquidity?.usd || 0)
            };
          }
          return token;
        });
      }
      
      return tokens;
    } catch (error) {
      console.error('❌ Price data fetch error:', error.message);
      return tokens;
    }
  }

  async refreshAllData() {
    try {
      let tokens = [];
      
      // Try Birdeye first
      tokens = await this.fetchTop1000SolanaTokens();
      
      // Fallback 1: Jupiter API
      if (tokens.length === 0) {
        console.log('🔄 Birdeye failed, trying Jupiter API...');
        tokens = await this.fetchFromJupiter();
      }
      
      // Fallback 2: DexScreener API for popular Solana tokens
      if (tokens.length === 0) {
        console.log('🔄 Jupiter failed, trying DexScreener API...');
        tokens = await this.fetchFromDexScreener();
      }
      
      // Fallback 3: CoinGecko API
      if (tokens.length === 0) {
        console.log('🔄 DexScreener failed, trying CoinGecko API...');
        tokens = await this.fetchFromCoinGecko();
      }
      
      // Fallback 4: Helius API
      if (tokens.length === 0) {
        console.log('🔄 CoinGecko failed, trying Helius API...');
        tokens = await this.fetchFromHelius();
      }
      
      if (tokens.length > 0) {
        await this.updateDatabase(tokens);
        console.log(`🎉 Successfully refreshed ${tokens.length} tokens`);
        return tokens.length;
      }
      
      console.log('❌ All APIs failed, no tokens updated');
      return 0;
    } catch (error) {
      console.error('❌ Data refresh failed:', error.message);
      throw error;
    }
  }
}

module.exports = new DataService();