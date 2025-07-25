// Advanced scam detection algorithms
const detectScamProbability = (coinData) => {
  let scamScore = 0;
  const factors = [];

  // 1. Liquidity Pool Analysis
  if (coinData.liquidityUSD < 10000) {
    scamScore += 0.3;
    factors.push({ factor: 'Low Liquidity', severity: 'high', description: 'Less than $10k liquidity' });
  }

  // 2. LP Burn Status
  if (!coinData.lpBurned) {
    scamScore += 0.2;
    factors.push({ factor: 'LP Not Burned', severity: 'medium', description: 'Liquidity pool tokens not burned' });
  }

  // 3. Holder Concentration
  if (coinData.holderCount < 100) {
    scamScore += 0.25;
    factors.push({ factor: 'Low Holder Count', severity: 'high', description: 'Less than 100 holders' });
  }

  // 4. Volume to Market Cap Ratio
  const volumeRatio = coinData.volume24h / coinData.marketCap;
  if (volumeRatio > 0.5) {
    scamScore += 0.15;
    factors.push({ factor: 'High Volume Ratio', severity: 'medium', description: 'Unusually high trading volume' });
  }

  // 5. Price Volatility
  if (Math.abs(coinData.priceChange24h) > 0.5) {
    scamScore += 0.1;
    factors.push({ factor: 'High Volatility', severity: 'low', description: 'Extreme price movements' });
  }

  return {
    scamProbability: Math.min(scamScore, 1),
    riskFactors: factors
  };
};

module.exports = { detectScamProbability };