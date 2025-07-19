import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;