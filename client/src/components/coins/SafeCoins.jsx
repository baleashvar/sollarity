import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getSafeCoins } from '../../services/api';

const SafeCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSafeCoins = async () => {
      try {
        setLoading(true);
        const data = await getSafeCoins();
        if (Array.isArray(data) && data.length > 0) {
          setCoins(data);
          setError(null);
        } else {
          setCoins([]);
          setError('No safe coins available');
        }
      } catch (err) {
        setError('Failed to load safe coins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafeCoins();
  }, []);

  // Using the imported formatCurrency function from utils/formatters

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Safest Coins
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
                    {coin.symbol.substring(0, 2)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {coin.symbol}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 mr-2">
                    Low Risk
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatCurrency(coin.price)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/?sort=scamProbability&order=asc"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all safe coins
        </Link>
      </div>
    </div>
  );
};

export default SafeCoins;