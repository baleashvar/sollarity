import React from 'react';

const SimpleDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6 rounded-lg shadow-lg mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 text-center sm:text-left">
            Sollarity
          </h1>
          <p className="text-xl opacity-90 text-center sm:text-left">
            Discover and analyze Solana memecoins with confidence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              <span className="text-indigo-600 dark:text-indigo-400 mr-2">⟡</span>Memecoin Explorer
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                Loading coin data... If this persists, check your server connection.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Trending Coins
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Safest Coins
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              About Sollarity
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sollarity helps you navigate the volatile world of Solana memecoins by providing
              data-driven insights and risk analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;