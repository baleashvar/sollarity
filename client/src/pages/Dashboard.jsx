import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CoinTable from '../components/coins/CoinTable';
import FilterPanel from '../components/filters/FilterPanel';
import TrendingCoins from '../components/coins/TrendingCoins';
import SafeCoins from '../components/coins/SafeCoins';
import ScamAlerts from '../components/alerts/ScamAlerts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { getCoins } from '../services/api';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem('dashboardPage');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minMarketCap: '',
    maxScamProbability: '',
    lpBurned: false,
    sort: searchParams.get('sort') || 'marketCap',
    order: searchParams.get('order') || 'desc'
  });

  const refreshData = async () => {
    try {
      setLoading(true);
      await fetch('http://localhost:5000/api/data-refresh/complete', { method: 'POST' });
      setTimeout(fetchCoins, 3000);
    } catch (err) {
      console.error('Refresh failed:', err);
      setLoading(false);
    }
  };

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Skip refresh for now to avoid conflicts
      // refreshData();
      
      const data = await getCoins(page, filters);
      
      if (data && data.coins) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const premiumText = user.isPremium ? ' (Premium: 50/page)' : ' (Free: 20/page)';
        console.log(`Received ${data.coins.length} coins from API. Total: ${data.total}${premiumText}`);
        setCoins(data.coins);
        setTotalPages(data.totalPages || 1);
      } else {
        setCoins([]);
        setTotalPages(1);
        setError('No coins available. Server may be starting up...');
      }
    } catch (err) {
      setCoins([]);
      setTotalPages(1);
      setError(`Connection failed: ${err.message}. Make sure the server is running on port 5000.`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchCoins();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    sessionStorage.setItem('dashboardPage', newPage.toString());
    window.scrollTo(0, 0);
  };

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">⟡</span>Memecoin Explorer
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchCoins}
                  className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700"
                >
                  🔄 Refresh
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  Live Data
                </div>
              </div>
            </div>
            
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            
            {error && <Alert type="error" message={error} />}
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <CoinTable coins={coins} />
                
                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-3 py-1">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <TrendingCoins />
          <SafeCoins />
          <ScamAlerts />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              About Sollarity
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sollarity helps you navigate the volatile world of Solana memecoins by providing
              data-driven insights and risk analysis.
            </p>
            <Link
              to="/about"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Learn more about our methodology →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;