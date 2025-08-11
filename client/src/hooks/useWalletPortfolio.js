import { useState, useEffect } from 'react';

export const useWalletPortfolio = (walletAddress) => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        
        // Fetch token accounts from Helius API
        const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${process.env.REACT_APP_HELIUS_API_KEY}`);
        const data = await response.json();
        
        if (data.tokens) {
          const tokens = data.tokens.filter(token => token.amount > 0);
          
          // Get price data for each token
          const portfolioData = await Promise.all(
            tokens.map(async (token) => {
              try {
                const priceResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.mint}`);
                const priceData = await priceResponse.json();
                const price = priceData.pairs?.[0]?.priceUsd || 0;
                
                return {
                  mint: token.mint,
                  symbol: token.symbol || 'Unknown',
                  amount: token.amount,
                  decimals: token.decimals,
                  price: parseFloat(price),
                  value: (token.amount / Math.pow(10, token.decimals)) * parseFloat(price)
                };
              } catch {
                return null;
              }
            })
          );
          
          const validTokens = portfolioData.filter(Boolean);
          setPortfolio(validTokens);
          setTotalValue(validTokens.reduce((sum, token) => sum + token.value, 0));
        }
      } catch (error) {
        console.error('Portfolio fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [walletAddress]);

  return { portfolio, loading, totalValue };
};