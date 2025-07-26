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
    maxCoins: isPremium ? 100 : 20,
    showCharts: isPremium,
    showImages: isPremium,
    showAdvancedFilters: isPremium,
    showFullDetails: isPremium,
    coinsPerPage: isPremium ? 100 : 20
  };
};