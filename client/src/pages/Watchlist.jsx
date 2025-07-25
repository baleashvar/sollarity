import React, { useState, useEffect } from 'react';
import CoinTable from '../components/coins/CoinTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Watchlist = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view watchlist');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoins(data.coins);
      } else {
        setError('Failed to load watchlist');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
        {coins.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No coins in your watchlist. Add some from the main dashboard!
          </p>
        ) : (
          <CoinTable coins={coins} />
        )}
      </div>
    </div>
  );
};

export default Watchlist;