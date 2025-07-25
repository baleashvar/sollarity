import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Sollarity ("Service"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2. Description of Service
            </h2>
            <p>
              Sollarity provides cryptocurrency analysis, market data, and risk assessment tools for Solana-based tokens. 
              Our service includes price tracking, scam detection algorithms, and premium analytics features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3. Investment Disclaimer
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                IMPORTANT: Sollarity is for informational purposes only and does not constitute financial advice.
              </p>
              <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• Cryptocurrency investments are highly risky and volatile</li>
                <li>• Past performance does not guarantee future results</li>
                <li>• You may lose all invested capital</li>
                <li>• Always conduct your own research before investing</li>
                <li>• Consult with qualified financial advisors</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              4. Data Accuracy
            </h2>
            <p>
              While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, 
              accuracy, or timeliness of any data. Market data is sourced from third-party APIs and may contain errors 
              or delays. Users should verify information independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              5. User Responsibilities
            </h2>
            <ul className="space-y-2">
              <li>• You must be 18 years or older to use this service</li>
              <li>• Provide accurate information when creating accounts</li>
              <li>• Keep your account credentials secure</li>
              <li>• Use the service in compliance with applicable laws</li>
              <li>• Do not attempt to manipulate or exploit our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              6. Premium Services
            </h2>
            <p>
              Premium features require subscription payments processed through PayPal. Subscriptions automatically 
              renew unless cancelled. Refunds are provided according to our refund policy. Premium features may 
              change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              7. Prohibited Uses
            </h2>
            <ul className="space-y-2">
              <li>• Market manipulation or pump-and-dump schemes</li>
              <li>• Automated scraping or data harvesting</li>
              <li>• Sharing premium content with non-subscribers</li>
              <li>• Reverse engineering our algorithms</li>
              <li>• Any illegal or fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              Sollarity and its operators shall not be liable for any direct, indirect, incidental, or consequential 
              damages arising from your use of the service, including but not limited to investment losses, data 
              inaccuracies, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              9. Intellectual Property
            </h2>
            <p>
              All content, algorithms, and proprietary analysis methods are owned by Sollarity. Users may not 
              reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              10. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend accounts at our discretion for violations of these terms. 
              Users may cancel their accounts at any time through account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              11. Changes to Terms
            </h2>
            <p>
              These terms may be updated periodically. Continued use of the service after changes constitutes 
              acceptance of new terms. Users will be notified of significant changes via email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              12. Contact Information
            </h2>
            <p>
              For questions about these Terms of Service, contact us at:
              <br />
              Email: legal@sollarity.io
              <br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By using Sollarity, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;