import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getTrendingCoins } from '../../services/api';

const TrendingCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true);
        const data = await getTrendingCoins();
        if (Array.isArray(data) && data.length > 0) {
          setCoins(data);
          setError(null);
        } else {
          setCoins([]);
          setError('No trending coins available');
        }
      } catch (err) {
        setError('Failed to load trending coins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  // Using the imported formatCurrency function from utils/formatters

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Trending Coins
      </h2>
      
      {loading ? (
        <div className="py-4">
          <LoadingSpinner size="sm" />
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
                    {coin.symbol.substring(0, 2)}
                  </div>
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
          to="/?sort=volume24h&order=desc"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all trending coins
        </Link>
      </div>
    </div>
  );
};

export default TrendingCoins;