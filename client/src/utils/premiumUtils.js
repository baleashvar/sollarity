import { safeGetJSON, safeSetJSON } from './storage';

/**
 * Premium user utilities
 */

export const isPremiumUser = () => {
  // Temporarily disabled paywall - everyone is premium for testing
  return true;
  // const user = safeGetJSON('user', {});
  // return user.isPremium || false;
};

export const setPremiumStatus = (isPremium) => {
  const user = safeGetJSON('user', {});
  user.isPremium = isPremium;
  safeSetJSON('user', user);
};

export const getPremiumLimits = () => {
  const isPremium = isPremiumUser();
  
  return {
    maxPages: isPremium ? Infinity : 1,
    showCharts: isPremium,
    showImages: isPremium,
    showAdvancedFilters: isPremium,
    showFullDetails: isPremium,
    coinsPerPage: 20 // Always 20 per page
  };
};