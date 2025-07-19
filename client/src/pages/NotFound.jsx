import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;