import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Sollarity</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/about') 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                About
              </Link>
              <Link 
                to="/subscription" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/subscription') 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Premium
              </Link>
              <Link 
                to="/scam-alerts" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/scam-alerts') 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-1">⚠️</span> Scam Alerts
                </span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {localStorage.getItem('user') ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {JSON.parse(localStorage.getItem('user')).username}
                  {JSON.parse(localStorage.getItem('user')).isPremium && (
                    <span className="ml-1 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">PRO</span>
                  )}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <div className="ml-3 md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/subscription" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/subscription') 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Premium
            </Link>
            <Link 
              to="/scam-alerts" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/scam-alerts') 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <span className="mr-1">⚠️</span> Scam Alerts
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;