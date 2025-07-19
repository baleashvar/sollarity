import React, { useState, useEffect } from 'react';
import { getScamAlerts } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { truncateAddress, formatDate } from '../utils/formatters';

const ScamAlertsPage = () => {
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8 px-6 rounded-lg shadow-lg mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 text-center sm:text-left">
            Scam Alerts
          </h1>
          <p className="text-xl opacity-90 text-center sm:text-left">
            Stay informed about potential scams in the Solana ecosystem
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            <span className="text-red-500 mr-2">⚠️</span>Active Alerts
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            Updated regularly
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No scam alerts at this time.
          </div>
        ) : (
          <div className="space-y-6">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className="border-l-4 border-red-500 pl-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-xl text-gray-900 dark:text-white">
                      {alert.coinName} ({alert.coinSymbol})
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Address: {truncateAddress(alert.coinAddress)}
                    </div>
                    <p className="text-md mt-2 text-gray-700 dark:text-gray-300">
                      {alert.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Reported: {formatDate(alert.timestamp)}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityClass(alert.severity)}`}>
                    {alert.alertType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          How to Stay Safe
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Always research before investing in any memecoin</li>
          <li>Check if liquidity is locked or LP tokens are burned</li>
          <li>Be wary of tokens with extremely high concentrations of supply in few wallets</li>
          <li>Avoid tokens with suspicious or anonymous teams</li>
          <li>Use Sollarity's risk assessment tools before investing</li>
        </ul>
      </div>
    </div>
  );
};

export default ScamAlertsPage;