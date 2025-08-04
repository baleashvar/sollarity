import React, { useState, useEffect } from 'react';

const WatchlistButton = ({ coinAddress }) => {
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkWatchlistStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/watchlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const isInWatchlist = data.watchlist.some(item => item.coinAddress === coinAddress);
        setIsWatched(isInWatchlist);
      }
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  useEffect(() => {
    checkWatchlistStatus();
  }, [coinAddress]);

  const toggleWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to use watchlist');
      return;
    }

    setLoading(true);
    try {
      const method = isWatched ? 'DELETE' : 'POST';
      const url = isWatched 
        ? `http://localhost:5000/api/watchlist/remove?address=${coinAddress}`
        : 'http://localhost:5000/api/watchlist/add';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? JSON.stringify({ coinAddress }) : undefined
      });

      if (response.ok) {
        setIsWatched(!isWatched);
      }
    } catch (error) {
      console.error('Watchlist error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isWatched 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-gray-400 hover:text-yellow-500'
      }`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {loading ? '⏳' : (isWatched ? '⭐' : '☆')}
    </button>
  );
};

export default WatchlistButton;