/**
 * Format a number as currency with appropriate suffixes
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
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
 * Format a number as a percentage
 * @param {number} value - The value to format (e.g., 0.05 for 5%)
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (!value && value !== 0) return 'N/A';
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a number with commas
 * @param {number} value - The value to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value) => {
  if (!value && value !== 0) return 'N/A';
  return value.toLocaleString('en-US');
};

/**
 * Truncate an address or long string
 * @param {string} str - The string to truncate
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} - Truncated string
 */
export const truncateAddress = (str, startChars = 6, endChars = 4) => {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
};