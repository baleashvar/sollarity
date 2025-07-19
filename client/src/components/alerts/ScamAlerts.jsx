import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import { truncateAddress } from '../../utils/formatters';
import { getScamAlerts } from '../../services/api';

const ScamAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScamAlerts = async () => {
      try {
        setLoading(true);
        const data = await getScamAlerts();
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load scam alerts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScamAlerts();
  }, []);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          <span className="text-red-500 mr-2">⚠️</span>Scam Alerts
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          Live Updates
        </div>
      </div>
      
      {loading ? (
        <div className="py-4">
          <LoadingSpinner size="sm" />
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No scam alerts at this time.
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert, index) => (
            <li key={index} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {alert.coinName} ({alert.coinSymbol})
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {truncateAddress(alert.coinAddress)}
                  </div>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    {alert.description}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                  {alert.alertType}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/scam-alerts"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all scam alerts
        </Link>
      </div>
    </div>
  );
};

export default ScamAlerts;