import React from 'react';
import { isPremiumUser, setPremiumStatus } from '../../utils/premiumUtils';

const PremiumToggle = () => {
  const [premium, setPremium] = React.useState(isPremiumUser());

  const handleToggle = () => {
    const newStatus = !premium;
    setPremium(newStatus);
    setPremiumStatus(newStatus);
    // Reset page to 1 when switching premium status
    sessionStorage.setItem('dashboardPage', '1');
    window.location.reload(); // Refresh to apply changes
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <div className="text-sm font-medium mb-2">Testing Mode</div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={premium}
          onChange={handleToggle}
          className="sr-only"
        />
        <div className={`relative w-10 h-6 rounded-full transition-colors ${premium ? 'bg-blue-600' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${premium ? 'translate-x-4' : 'translate-x-0'}`}></div>
        </div>
        <span className="ml-2 text-sm">
          {premium ? '👑 Premium' : '🆓 Free'}
        </span>
      </label>
    </div>
  );
};

export default PremiumToggle;