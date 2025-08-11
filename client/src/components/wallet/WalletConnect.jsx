import React from 'react';
import { usePhantomWallet } from '../../hooks/usePhantomWallet';

const WalletConnect = ({ onConnect }) => {
  const { connected, connecting, connect, disconnect, publicKey } = usePhantomWallet();

  const handleConnect = async () => {
    const address = await connect();
    if (address && onConnect) {
      onConnect(address);
    }
  };

  if (connected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-red-600 hover:underline"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
      </svg>
      <span>{connecting ? 'Connecting...' : 'Connect Phantom'}</span>
    </button>
  );
};

export default WalletConnect;