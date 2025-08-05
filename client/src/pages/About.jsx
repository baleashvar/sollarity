import React from 'react';
import SEOHead from '../components/SEO/SEOHead';

const About = () => {
  return (
    <>
      <SEOHead 
        title="About Sollarity - Solana Memecoin Analysis Platform"
        description="Learn how Sollarity helps traders analyze Solana memecoins with real-time data, scam detection, and holder analytics. Discover our methodology and features."
        keywords="about sollarity, solana memecoin analysis, crypto analysis platform, solana token tracker"
        url="https://sollarity.xyz/about"
      />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Sollarity</h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sollarity is the leading Solana memecoin analysis platform, providing traders with real-time data, 
            scam detection, and comprehensive analytics to make informed investment decisions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300">
            To democratize access to professional-grade cryptocurrency analysis tools, helping traders navigate 
            the volatile world of Solana memecoins with confidence and data-driven insights.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Real-time Data</strong>: Track the top 100 Solana tokens with live price updates</li>
            <li><strong>Scam Detection</strong>: Advanced algorithms to identify potential scam tokens</li>
            <li><strong>Holder Analytics</strong>: Analyze token distribution and whale movements</li>
            <li><strong>LP Analysis</strong>: Monitor liquidity pool locks and burns</li>
            <li><strong>Market Intelligence</strong>: Comprehensive market cap and volume data</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Why Choose Sollarity?</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Unlike other platforms, Sollarity focuses specifically on the Solana ecosystem, providing 
            specialized tools and insights that generic crypto trackers can't match. Our platform combines 
            multiple data sources to give you the most accurate and up-to-date information available.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;