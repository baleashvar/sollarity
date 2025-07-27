import React, { useState } from 'react';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setLocalFilters({
      ...localFilters,
      [name]: newValue
    });
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setLocalFilters({
      ...localFilters,
      sort: value
    });
  };

  const handleOrderChange = (e) => {
    const { value } = e.target;
    setLocalFilters({
      ...localFilters,
      order: value
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      minMarketCap: '',
      maxScamProbability: '',
      lpBurned: false,
      sort: 'marketCap',
      order: 'desc'
    };
    
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Filters
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Coin
          </label>
          <input
            type="text"
            name="search"
            value={localFilters.search || ''}
            onChange={handleInputChange}
            placeholder="Search by name or symbol"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Market Cap ($)
          </label>
          <input
            type="number"
            name="minMarketCap"
            value={localFilters.minMarketCap}
            onChange={handleInputChange}
            placeholder="e.g. 100000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Risk Score (0-1)
          </label>
          <input
            type="number"
            name="maxScamProbability"
            value={localFilters.maxScamProbability}
            onChange={handleInputChange}
            placeholder="e.g. 0.5"
            min="0"
            max="1"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="lpBurned"
            id="lpBurned"
            checked={localFilters.lpBurned}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="lpBurned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            LP Tokens Burned
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={localFilters.sort}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="marketCap">Market Cap</option>
            <option value="volume24h">24h Volume</option>
            <option value="price">Price</option>
            <option value="priceChange24h">24h Change</option>
            <option value="scamProbability">Risk Score</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <select
            value={localFilters.order}
            onChange={handleOrderChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;