import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center py-12 px-6">
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              We encountered an error while loading this page. Please try refreshing or go back to the dashboard.
            </p>
            {this.state.error && (
              <details className="text-left text-sm text-gray-500 mb-4">
                <summary>Error details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;