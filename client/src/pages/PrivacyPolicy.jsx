import React from 'react';
import { Link } from 'react-router-dom';
import FeedbackWidget from '../components/ui/FeedbackWidget';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Information We Collect
            </h2>
            
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Personal Information
            </h3>
            <ul className="space-y-1 mb-4">
              <li>• Email address (for account creation and notifications)</li>
              <li>• Payment information (processed securely through PayPal)</li>
              <li>• Username and profile preferences</li>
              <li>• Watchlist and portfolio data</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Automatically Collected Information
            </h3>
            <ul className="space-y-1">
              <li>• IP address and location data</li>
              <li>• Browser type and version</li>
              <li>• Device information and screen resolution</li>
              <li>• Usage patterns and feature interactions</li>
              <li>• Cookies and local storage data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="space-y-2">
              <li>• <strong>Service Provision:</strong> Deliver personalized crypto analysis and alerts</li>
              <li>• <strong>Account Management:</strong> Process subscriptions and manage user accounts</li>
              <li>• <strong>Communication:</strong> Send important updates, security alerts, and newsletters</li>
              <li>• <strong>Analytics:</strong> Improve our algorithms and user experience</li>
              <li>• <strong>Security:</strong> Detect fraud and protect against unauthorized access</li>
              <li>• <strong>Legal Compliance:</strong> Meet regulatory requirements and legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Data Sharing and Disclosure
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="font-semibold text-blue-800 dark:text-blue-200">
                We do not sell, rent, or trade your personal information to third parties.
              </p>
            </div>

            <p className="mb-3">We may share information only in these limited circumstances:</p>
            <ul className="space-y-2">
              <li>• <strong>Service Providers:</strong> PayPal for payment processing, MongoDB Atlas for data storage</li>
              <li>• <strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li>• <strong>Business Transfer:</strong> In case of merger, acquisition, or sale of assets</li>
              <li>• <strong>Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Data Security
            </h2>
            <p className="mb-3">We implement industry-standard security measures:</p>
            <ul className="space-y-2">
              <li>• <strong>Encryption:</strong> All data transmitted using SSL/TLS encryption</li>
              <li>• <strong>Secure Storage:</strong> Data stored in encrypted databases with access controls</li>
              <li>• <strong>Authentication:</strong> Secure login with password hashing</li>
              <li>• <strong>Monitoring:</strong> Continuous security monitoring and threat detection</li>
              <li>• <strong>Updates:</strong> Regular security patches and system updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. Cookies and Tracking
            </h2>
            <p className="mb-3">We use cookies and similar technologies for:</p>
            <ul className="space-y-2">
              <li>• <strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li>• <strong>Analytics Cookies:</strong> Understand how users interact with our platform</li>
              <li>• <strong>Advertising Cookies:</strong> Deliver relevant ads through Google AdSense</li>
            </ul>
            <p className="mt-3">
              You can control cookie preferences through your browser settings or our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Your Privacy Rights
            </h2>
            <p className="mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="space-y-2">
              <li>• <strong>Access:</strong> Request a copy of your personal data</li>
              <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
              <li>• <strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li>• <strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, use the feedback widget below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Data Retention
            </h2>
            <ul className="space-y-2">
              <li>• <strong>Account Data:</strong> Retained while your account is active</li>
              <li>• <strong>Transaction Records:</strong> Kept for 7 years for tax and legal purposes</li>
              <li>• <strong>Analytics Data:</strong> Aggregated data retained indefinitely</li>
              <li>• <strong>Marketing Data:</strong> Deleted within 30 days of unsubscribing</li>
              <li>• <strong>Deleted Accounts:</strong> Personal data removed within 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              8. International Data Transfers
            </h2>
            <p>
              Your data may be processed in countries outside your residence. We ensure adequate protection 
              through standard contractual clauses and compliance with applicable data protection laws including 
              GDPR and CCPA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              9. Children's Privacy
            </h2>
            <p>
              Sollarity is not intended for users under 18 years of age. We do not knowingly collect personal 
              information from children. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              10. Third-Party Services
            </h2>
            <p className="mb-3">Our platform integrates with third-party services:</p>
            <ul className="space-y-2">
              <li>• <strong>PayPal:</strong> Payment processing (see PayPal's privacy policy)</li>
              <li>• <strong>Google AdSense:</strong> Advertising services</li>
              <li>• <strong>API Providers:</strong> CoinGecko, Birdeye, Jupiter for market data</li>
              <li>• <strong>MongoDB Atlas:</strong> Database hosting</li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies and data practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              11. Changes to Privacy Policy
            </h2>
            <p>
              We may update this privacy policy periodically. Significant changes will be communicated via 
              email or platform notifications. Continued use after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              12. Contact Us
            </h2>
            <p>
              For privacy-related questions or requests, please use the feedback widget below.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This privacy policy is designed to help you understand how we collect, use, and protect your information 
            while using Sollarity.
          </p>
        </div>
      </div>
      <FeedbackWidget />
    </div>
  );
};

export default PrivacyPolicy;