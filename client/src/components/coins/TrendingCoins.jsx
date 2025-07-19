import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TrendingCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an environment variable
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_URL}/coins/trending`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending coins');
        }
        
        const data = await response.json();
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Failed to load trending coins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  // Helper function for formatting
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    
    // Format based on value size
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else if (value < 0.000001) {
      return `$${value.toExponential(2)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Trending Coins
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      ) : (
        <ul className="space-y-3">
          {coins.slice(0, 5).map((coin) => (
            <li key={coin.address}>
              <Link 
                to={`/coin/${coin.address}`}
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  {coin.image ? (
                    <img 
                      src={coin.image} 
                      alt={coin.name} 
                      className="w-6 h-6 rounded-full mr-2"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-coin.png';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 mr-2 flex items-center justify-center text-xs">
                      {coin.symbol.substring(0, 1)}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {coin.symbol}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {formatCurrency(coin.price)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all trending coins
        </Link>
      </div>
    </div>
  );
};

export default TrendingCoins;