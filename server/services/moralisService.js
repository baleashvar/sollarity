const axios = require('axios');
const { sanitizeForLog } = require('../utils/sanitize');

class MoralisService {
  constructor() {
    this.apiKey = process.env.MORALIS_API_KEY;
    this.baseURL = 'https://solana-gateway.moralis.io';
    this.headers = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getTokenLiquidity(tokenAddress) {
    try {
      const response = await axios.get(`${this.baseURL}/token/${tokenAddress}/liquidity`, {
        headers: this.headers,
        timeout: 10000
      });

      if (response.data) {
        return {
          totalLiquidity: response.data.totalLiquidity || 0,
          liquidityPools: response.data.pools || [],
          lpBurned: this.checkLPBurned(response.data.pools),
          liquidityScore: this.calculateLiquidityScore(response.data)
        };
      }
      return null;
    } catch (error) {
      console.error('Moralis liquidity fetch error:', sanitizeForLog(error.message));
      return null;
    }
  }

  async getTokenHolders(tokenAddress) {
    try {
      const response = await axios.get(`${this.baseURL}/token/${tokenAddress}/owners`, {
        headers: this.headers,
        params: { limit: 100 },
        timeout: 10000
      });

      if (response.data?.result) {
        const holders = response.data.result;
        return {
          totalHolders: holders.length,
          topHolders: holders.slice(0, 10),
          holderDistribution: this.analyzeHolderDistribution(holders),
          whaleRisk: this.calculateWhaleRisk(holders)
        };
      }
      return null;
    } catch (error) {
      console.error('Moralis holders fetch error:', sanitizeForLog(error.message));
      return null;
    }
  }

  async getTokenMetrics(tokenAddress) {
    try {
      const response = await axios.get(`${this.baseURL}/token/${tokenAddress}/stats`, {
        headers: this.headers,
        timeout: 10000
      });

      if (response.data) {
        return {
          volume24h: response.data.volume24h || 0,
          transactions24h: response.data.transactions24h || 0,
          uniqueWallets24h: response.data.uniqueWallets24h || 0,
          priceChange24h: response.data.priceChange24h || 0
        };
      }
      return null;
    } catch (error) {
      console.error('Moralis metrics fetch error:', sanitizeForLog(error.message));
      return null;
    }
  }

  checkLPBurned(pools) {
    if (!pools || pools.length === 0) return false;
    
    return pools.some(pool => {
      const burnAddress = '11111111111111111111111111111112';
      return pool.lpTokenOwner === burnAddress || pool.lpTokens === 0;
    });
  }

  calculateLiquidityScore(liquidityData) {
    const totalLiq = liquidityData.totalLiquidity || 0;
    
    if (totalLiq > 1000000) return 'high';
    if (totalLiq > 100000) return 'medium';
    if (totalLiq > 10000) return 'low';
    return 'very-low';
  }

  analyzeHolderDistribution(holders) {
    if (!holders || holders.length === 0) return { concentration: 'unknown' };

    const totalSupply = holders.reduce((sum, holder) => sum + parseFloat(holder.amount || 0), 0);
    const top10Holdings = holders.slice(0, 10).reduce((sum, holder) => sum + parseFloat(holder.amount || 0), 0);
    
    const concentration = (top10Holdings / totalSupply) * 100;
    
    return {
      concentration: concentration > 80 ? 'high' : concentration > 50 ? 'medium' : 'low',
      top10Percentage: concentration.toFixed(2)
    };
  }

  calculateWhaleRisk(holders) {
    if (!holders || holders.length === 0) return 0.5;

    const totalSupply = holders.reduce((sum, holder) => sum + parseFloat(holder.amount || 0), 0);
    const largestHolder = Math.max(...holders.map(h => parseFloat(h.amount || 0)));
    
    const whalePercentage = (largestHolder / totalSupply) * 100;
    
    if (whalePercentage > 50) return 0.9;
    if (whalePercentage > 30) return 0.7;
    if (whalePercentage > 15) return 0.5;
    if (whalePercentage > 5) return 0.3;
    return 0.1;
  }

  async getEnhancedRiskAnalysis(tokenAddress) {
    try {
      const [liquidity, holders, metrics] = await Promise.all([
        this.getTokenLiquidity(tokenAddress),
        this.getTokenHolders(tokenAddress),
        this.getTokenMetrics(tokenAddress)
      ]);

      let riskScore = 0.1; // Base risk
      const riskFactors = [];

      // Liquidity risk
      if (liquidity) {
        if (liquidity.totalLiquidity < 10000) {
          riskScore += 0.3;
          riskFactors.push({ type: 'liquidity', severity: 'high', description: 'Very low liquidity' });
        } else if (liquidity.totalLiquidity < 100000) {
          riskScore += 0.1;
          riskFactors.push({ type: 'liquidity', severity: 'medium', description: 'Low liquidity' });
        }

        if (!liquidity.lpBurned) {
          riskScore += 0.2;
          riskFactors.push({ type: 'lp', severity: 'high', description: 'LP tokens not burned' });
        }
      }

      // Holder concentration risk
      if (holders) {
        const whaleRisk = holders.whaleRisk;
        riskScore += whaleRisk * 0.4;
        
        if (whaleRisk > 0.7) {
          riskFactors.push({ type: 'whale', severity: 'high', description: 'High whale concentration' });
        } else if (whaleRisk > 0.5) {
          riskFactors.push({ type: 'whale', severity: 'medium', description: 'Moderate whale risk' });
        }
      }

      // Volume/activity risk
      if (metrics) {
        if (metrics.volume24h < 1000) {
          riskScore += 0.15;
          riskFactors.push({ type: 'volume', severity: 'medium', description: 'Low trading volume' });
        }
      }

      return {
        riskScore: Math.min(riskScore, 0.95),
        riskFactors,
        liquidity,
        holders,
        metrics
      };
    } catch (error) {
      console.error('Enhanced risk analysis error:', sanitizeForLog(error.message));
      return null;
    }
  }
}

module.exports = new MoralisService();