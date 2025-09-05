import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoin } from '../services/api';
import { getPremiumLimits } from '../utils/premiumUtils';
import DexScreenerChart from '../components/charts/DexScreenerChart';
import TradingViewChart from '../components/charts/TradingViewChart';
import LivePrice from '../components/ui/LivePrice';
import EnhancedRiskPanel from '../components/analysis/EnhancedRiskPanel';


const CoinDetail = () => {
  const { address } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartType, setChartType] = useState('dexscreener');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderError, setRenderError] = useState(null);

  // Data validation function
  const validateCoinData = (data) => {
    if (!data) return null;
    
    return {
      ...data,
      address: data.address || '',
      name: data.name || 'Unknown',
      symbol: data.symbol || 'UNK',
      price: data.price || 0,
      marketCap: data.marketCap || 0,
      volume24h: data.volume24h || 0,
      priceChange24h: data.priceChange24h || 0,
      liquidityUSD: data.liquidityUSD,
      holderCount: data.holderCount || 0,
      lpBurned: data.lpBurned || false,
      scamProbability: data.scamProbability || 0,
      image: data.image || '',
      riskFactors: data.riskFactors || []
    };
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        
        // Fetch coin details
        const coinData = await getCoin(address);
        const validatedData = validateCoinData(coinData);
        setCoin(validatedData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load coin data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [address]);
  
  // No need for price history fetching - external charts handle this



  // Helper functions for formatting
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    
    // Format based on value size
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else if (value < 0.000001) {
      return `$${value.toExponential(2)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Error Loading Coin
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error || 'Coin not found'}
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Additional safety check
  if (!coin.address || !coin.name || !coin.symbol) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Invalid Coin Data
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This coin has incomplete data. Please try again later.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Render error boundary
  if (renderError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Rendering Error
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          There was an error displaying this coin. Please try refreshing the page.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  try {
    return (
      <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            {getPremiumLimits().showImages && coin.image ? (
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-coin.png';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-4 flex items-center justify-center text-lg text-white font-bold">
                {(coin.symbol || 'UN').substring(0, 2)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {coin.name} ({coin.symbol})
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {coin.address ? `${coin.address.substring(0, 8)}...${coin.address.substring(coin.address.length - 8)}` : 'Unknown Address'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <LivePrice coin={coin} showChange={true} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Market Data
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coin.marketCap || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coin.volume24h || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Liquidity</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.liquidityUSD === null || coin.liquidityUSD === undefined ? (
                    <span className="text-gray-500 dark:text-gray-400 italic">Data not available</span>
                  ) : (
                    formatCurrency(coin.liquidityUSD || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">LP Burned</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.lpBurned ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Holders</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(coin.holderCount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Risk Assessment
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Risk Score</span>
                <span
                  className={`font-medium ${
                    (coin.scamProbability || 0) < 0.3
                      ? 'text-green-600 dark:text-green-400'
                      : (coin.scamProbability || 0) < 0.7
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {((coin.scamProbability || 0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    (coin.scamProbability || 0) < 0.3
                      ? 'bg-green-600'
                      : (coin.scamProbability || 0) < 0.7
                      ? 'bg-yellow-500'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${(coin.scamProbability || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            {coin.riskFactors && coin.riskFactors.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Factors
                </h3>
                <ul className="space-y-2">
                  {coin.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                          factor.severity === 'high'
                            ? 'bg-red-500'
                            : factor.severity === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      ></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {factor.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No significant risk factors detected.
              </p>
            )}
          </div>
        </div>

        <EnhancedRiskPanel tokenAddress={address} />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Price History
            </h2>
            {getPremiumLimits().showCharts && (
              <div className="flex space-x-2 items-center">
                <span className="text-xs text-green-600 font-medium">
                  🔴 Live External Charts
                </span>
              </div>
            )}
          </div>
          
          {getPremiumLimits().showCharts ? (
            <div className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={() => setChartType('dexscreener')}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === 'dexscreener' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  DexScreener
                </button>
                <button 
                  onClick={() => setChartType('tradingview')}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === 'tradingview' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  TradingView
                </button>
              </div>
              {chartType === 'dexscreener' ? (
                <DexScreenerChart address={address} />
              ) : (
                <TradingViewChart symbol={coin.symbol} address={address} />
              )}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upgrade to Premium to view detailed price charts and historical data
              </p>
              <Link
                to="/subscription"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      </div>

      {coin.website || coin.twitter || coin.telegram ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Links
          </h2>
          <div className="flex flex-wrap gap-3">
            {coin.website && (
              <a
                href={coin.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Website
              </a>
            )}
            {coin.twitter && (
              <a
                href={coin.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter
              </a>
            )}
            {coin.telegram && (
              <a
                href={coin.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            )}
            {coin.discord && (
              <a
                href={coin.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                Discord
              </a>
            )}
            {/* Binance referral button */}
            <a
              href="https://www.binance.com/referral/earn-together/refer-in-hotsummer/claim?hl=en&ref=GRO_20338_QURAF&utm_source=default"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-yellow-400 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3 6 6 .5-4.5 3.5L19 20l-7-4-7 4 1.5-8.5L3 8.5 9 8 12 2z" fill="currentColor" />
              </svg>
              Buy on Binance
            </a>
          </div>
        </div>
      ) : null}
      </div>
    );
  } catch (err) {
    console.error('CoinDetail render error:', err);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Display Error
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Unable to display coin details. Please try again.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }
};

export default CoinDetail;