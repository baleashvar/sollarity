import React, { useState, useEffect } from 'react';
import { useRealTimePrice } from '../../hooks/useRealTimePrice';

const LivePrice = ({ coin, showChange = true }) => {
  const { livePrice, loading } = useRealTimePrice(coin.address);
  const [priceChange, setPriceChange] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(coin.price);

  useEffect(() => {
    if (livePrice && previousPrice) {
      const change = ((livePrice - previousPrice) / previousPrice) * 100;
      setPriceChange(change);
      setPreviousPrice(livePrice);
    }
  }, [livePrice, previousPrice]);

  const displayPrice = livePrice || coin.price;
  const isPositive = priceChange >= 0;

  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold">
        ${displayPrice?.toFixed(6) || '0.000000'}
      </span>
      
      {loading && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
      
      {showChange && livePrice && (
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
        </span>
      )}
      
      {livePrice && (
        <span className="text-xs text-green-500 font-medium">LIVE</span>
      )}
    </div>
  );
};

export default LivePrice;