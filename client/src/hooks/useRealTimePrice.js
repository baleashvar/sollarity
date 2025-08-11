import { useState, useEffect } from 'react';

export const useRealTimePrice = (tokenAddress) => {
  const [livePrice, setLivePrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchLivePrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          const price = parseFloat(data.pairs[0].priceUsd);
          setLivePrice(price);
        }
      } catch (error) {
        console.error('Live price fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [tokenAddress]);

  return { livePrice, loading };
};