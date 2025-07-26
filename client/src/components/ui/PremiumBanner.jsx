import React from 'react';
import { useNavigate } from 'react-router-dom';

const PremiumBanner = ({ message = "Upgrade to Premium to see more coins and features!" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">🚀 Premium Features</h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => navigate('/subscription')}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default PremiumBanner;