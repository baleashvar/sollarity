import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import WalletPortfolio from './WalletPortfolio';

const PersonalizedDashboard = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Wallet Dashboard</h2>
          <WalletConnect onConnect={setWalletAddress} />
        </div>
        
        {walletAddress ? (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Connected: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">👛</div>
            <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
            <p className="text-sm">
              Connect your Phantom wallet to see personalized data:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Your token holdings with live values</li>
              <li>• Portfolio performance tracking</li>
              <li>• Personalized risk alerts</li>
              <li>• Transaction history analysis</li>
            </ul>
          </div>
        )}
      </div>

      {walletAddress && <WalletPortfolio walletAddress={walletAddress} />}
    </div>
  );
};

export default PersonalizedDashboard;