import React, { useState, useEffect } from 'react';

const PriceChart = ({ coinAddress }) => {
  const [priceData, setPriceData] = useState([]);
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceHistory();
  }, [coinAddress, timeframe]);

  const fetchPriceHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/analytics/history?address=${coinAddress}&timeframe=${timeframe}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPriceData(data);
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading chart...</div>;
  if (priceData.length === 0) return <div className="text-center py-4 text-gray-500">No price data available</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Price History</h3>
        <div className="flex space-x-2">
          {['1h', '24h', '7d', '30d'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === tf ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-500">Chart: {priceData.length} points</span>
      </div>
    </div>
  );
};

export default PriceChart;