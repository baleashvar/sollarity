import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Sollarity</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Sollarity is a data-driven platform designed to provide transparency and insights into the Solana memecoin ecosystem. 
          Our mission is to help investors make informed decisions by providing comprehensive analytics, risk assessments, 
          and real-time data on Solana-based meme tokens.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          In the rapidly evolving world of cryptocurrency, especially in the memecoin sector, it can be challenging to 
          separate legitimate projects from potential scams. Sollarity aims to solve this problem by analyzing various 
          metrics and indicators to identify red flags and highlight promising opportunities.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Real-time tracking of Solana memecoin market data</li>
          <li>Advanced scam detection algorithms</li>
          <li>Historical performance analysis</li>
          <li>Liquidity and trading volume monitoring</li>
          <li>Risk assessment scores for each token</li>
          <li>Watchlist functionality for tracking favorite coins</li>
          <li>Alerts for suspicious activity or significant price movements</li>
        </ul>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Our Technology</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Sollarity leverages a combination of blockchain data analysis, machine learning algorithms, and traditional 
          financial metrics to provide comprehensive insights. Our platform continuously monitors on-chain activity, 
          social media sentiment, and market movements to deliver the most accurate and up-to-date information.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          We use a variety of data sources including Solana RPC nodes, DEX APIs, and specialized blockchain analytics 
          tools to gather and process information. Our risk assessment model considers factors such as liquidity depth, 
          holder concentration, contract code quality, and team transparency.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Disclaimer</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          While we strive to provide accurate and reliable information, cryptocurrency investments, especially memecoins, 
          are inherently risky. The information provided on Sollarity should not be considered financial advice. Always 
          conduct your own research before making investment decisions.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Sollarity is not responsible for any financial losses incurred from using the information provided on our platform. 
          Our risk assessments are based on available data and algorithms which may not capture all potential risks or 
          opportunities in the market.
        </p>
      </div>
    </div>
  );
};

export default About;