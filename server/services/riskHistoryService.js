const RiskHistory = require('../models/RiskHistory');
const Coin = require('../models/Coin');

class RiskHistoryService {
  async saveDailyRiskSnapshot() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const coins = await Coin.find({}, 'address symbol price marketCap liquidityUSD holderCount volume24h scamProbability');
      
      const snapshots = coins.map(coin => ({
        tokenAddress: coin.address,
        symbol: coin.symbol,
        date: today,
        riskScore: coin.scamProbability || 0.5,
        price: coin.price || 0,
        marketCap: coin.marketCap || 0,
        liquidityUSD: coin.liquidityUSD || 0,
        holderCount: coin.holderCount || 0,
        volume24h: coin.volume24h || 0
      }));

      await RiskHistory.insertMany(snapshots, { ordered: false });
      console.log(`Saved ${snapshots.length} risk snapshots for ${today.toDateString()}`);
    } catch (error) {
      console.error('Risk snapshot save error:', error.message);
    }
  }

  async getRiskHistory(tokenAddress, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await RiskHistory.find({
        tokenAddress,
        date: { $gte: startDate }
      }).sort({ date: 1 });
    } catch (error) {
      console.error('Risk history fetch error:', error.message);
      return [];
    }
  }

  async getRiskTrend(tokenAddress) {
    const history = await this.getRiskHistory(tokenAddress, 7);
    
    if (history.length < 2) return { trend: 'insufficient_data' };

    const recent = history.slice(-3);
    const older = history.slice(0, 3);

    const recentAvg = recent.reduce((sum, h) => sum + h.riskScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.riskScore, 0) / older.length;

    const change = recentAvg - olderAvg;

    return {
      trend: change > 0.1 ? 'increasing' : change < -0.1 ? 'decreasing' : 'stable',
      change: change,
      recentScore: recentAvg,
      historicalScore: olderAvg
    };
  }
}

module.exports = new RiskHistoryService();