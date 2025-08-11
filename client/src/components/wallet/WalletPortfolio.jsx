import React from 'react';
import { useWalletPortfolio } from '../../hooks/useWalletPortfolio';
import { formatCurrency } from '../../utils/formatters';
import LivePrice from '../ui/LivePrice';

const WalletPortfolio = ({ walletAddress }) => {
  const { portfolio, loading, totalValue } = useWalletPortfolio(walletAddress);

  if (!walletAddress) return null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Portfolio</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Portfolio</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Value</div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tokens found</p>
      ) : (
        <div className="space-y-3">
          {portfolio.slice(0, 5).map((token) => (
            <div key={token.mint} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-gray-500">
                  {(token.amount / Math.pow(10, token.decimals)).toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <LivePrice coin={{ address: token.mint, price: token.price }} showChange={false} />
                <div className="text-sm text-gray-500">
                  {formatCurrency(token.value)}
                </div>
              </div>
            </div>
          ))}
          
          {portfolio.length > 5 && (
            <div className="text-center text-sm text-gray-500 pt-2">
              +{portfolio.length - 5} more tokens
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletPortfolio;