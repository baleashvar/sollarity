import React, { useState } from 'react';

const DonationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const walletAddress = process.env.REACT_APP_DONATION_WALLET || 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700 order-first">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Support Sollarity
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Help us keep Sollarity free and improve our services
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Solana Wallet Address:</p>
            <div className="flex items-center justify-between">
              <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                {walletAddress.slice(0, 20)}...{walletAddress.slice(-10)}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <a
              href={`https://phantom.app/ul/browse/https://sollarity.xyz?recipient=${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-purple-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-purple-700"
            >
              Phantom
            </a>
            <a
              href={`solana:${walletAddress}`}
              className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-700"
            >
              Solflare
            </a>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        title="Support Sollarity"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </button>
    </div>
  );
};

export default DonationWidget;