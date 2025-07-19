import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 mb-8">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Thank You for Your Purchase!
        </h1>
        
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Your payment was successful and your subscription is now active.
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            What's Next?
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You now have access to all premium features of Sollarity. Start exploring advanced analytics and insights for Solana memecoins.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/" 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            to="/account" 
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
          >
            View Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;