import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { getPremiumLimits } from '../../utils/premiumUtils';
import WatchlistButton from '../watchlist/WatchlistButton';
import PremiumBanner from '../ui/PremiumBanner';
import LivePrice from '../ui/LivePrice';

const CoinTable = ({ coins, currentPage, totalPages }) => {
  const limits = getPremiumLimits();
  const displayCoins = coins || [];
  const showUpgradeBanner = !limits.showCharts && currentPage === 1 && totalPages > 1;

  if (!coins || coins.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No coins found matching your criteria.
      </div>
    );
  }

  return (
    <div>
      {showUpgradeBanner && (
        <PremiumBanner message={`You're viewing page 1 of ${totalPages}. Upgrade to Premium to access all ${totalPages} pages and see all coins!`} />
      )}
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Coin
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              24h %
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Market Cap
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Liquidity
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Risk
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600">
              Watch
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {displayCoins.map((coin) => (
            <tr key={coin.address} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/coin/${coin.address}`} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3 flex items-center justify-center text-white font-bold text-sm">
                    {coin.symbol?.substring(0, 2) || '??'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {coin.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {coin.symbol}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-medium">
                <LivePrice coin={coin} showChange={false} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                <span className={`${
                  (coin.priceChange24h || 0) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                } font-medium`}>
                  {formatPercentage(coin.priceChange24h || 0)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                {formatCurrency(coin.marketCap || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                <div className="flex justify-end items-center">
                  {coin.liquidityUSD === null || coin.liquidityUSD === undefined ? (
                    <span className="text-gray-500 dark:text-gray-400 italic">Data not available</span>
                  ) : (
                    formatCurrency(coin.liquidityUSD || 0)
                  )}
                  {coin.lpBurned && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      LP Burned
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    coin.scamProbability <= 0.3
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : coin.scamProbability <= 0.7
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {coin.scamProbability <= 0.3 ? 'Low Risk' : 
                     coin.scamProbability <= 0.7 ? 'Medium Risk' : 'High Risk'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <WatchlistButton coinAddress={coin.address} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default CoinTable;