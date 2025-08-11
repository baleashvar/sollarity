/**
 * API service for Sollarity
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://54.146.158.79:5001/api';

/**
 * Get all coins with pagination and filtering
 */
export const getCoins = async (page = 1, filters = {}) => {
  try {
    // Temporarily disabled paywall - everyone is premium
    const isPremium = true;
    
    // Build query string from filters  
    const queryParams = new URLSearchParams({
      page,
      limit: 20, // Always 20 per page
      isPremium: isPremium.toString(),
      sort: filters.sort || 'marketCap',
      order: filters.order || 'desc'
    });
    
    if (filters.minMarketCap) {
      queryParams.append('minMarketCap', filters.minMarketCap);
    }
    
    if (filters.maxScamProbability) {
      queryParams.append('maxScamProbability', filters.maxScamProbability);
    }
    
    if (filters.lpBurned) {
      queryParams.append('lpBurned', 'true');
    }
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    const response = await fetch(`${API_URL}/coins?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

/**
 * Get a single coin by address
 */
export const getCoin = async (address) => {
  try {
    const response = await fetch(`${API_URL}/coins/detail?address=${address}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching coin ${address}:`, error);
    throw error;
  }
};

/**
 * Get price history for a coin
 */
export const getCoinHistory = async (address, timeframe = '24h') => {
  try {
    const response = await fetch(`${API_URL}/analytics/history?address=${address}&timeframe=${timeframe}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching history for coin ${address}:`, error);
    throw error;
  }
};

/**
 * Get trending coins
 */
export const getTrendingCoins = async () => {
  try {
    const response = await fetch(`${API_URL}/coins/trending`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

/**
 * Get safe coins
 */
export const getSafeCoins = async () => {
  try {
    const response = await fetch(`${API_URL}/coins/safe`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch safe coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching safe coins:', error);
    throw error;
  }
};

/**
 * Get scam alerts
 */
export const getScamAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/scam-alerts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch scam alerts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching scam alerts:', error);
    throw error;
  }
};