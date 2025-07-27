/**
 * Premium user utilities
 */

export const isPremiumUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.isPremium || false;
};

export const setPremiumStatus = (isPremium) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  user.isPremium = isPremium;
  localStorage.setItem('user', JSON.stringify(user));
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