/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
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

/**
 * Format a number as percentage
 * @param {number} value - The value to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (!value && value !== 0) return 'N/A';
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format an address to show only the first and last few characters
 * @param {string} address - The address to format
 * @param {number} chars - Number of characters to show at start and end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, chars = 4) => {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};