import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          About Sollarity
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">
            Sollarity is a data-driven platform designed to help investors navigate the volatile
            world of Solana memecoins. Our mission is to provide transparent, accurate information
            that helps users make informed decisions and identify legitimate investment opportunities
            while avoiding potential scams.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Methodology</h2>
          
          <p className="mb-4">
            We analyze multiple data points from the Solana blockchain and various APIs to assess
            the risk profile of each memecoin. Our proprietary algorithm considers factors such as:
          </p>
          
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              <strong>Liquidity Analysis:</strong> We examine the depth and stability of liquidity
              pools to determine if a token has sufficient trading volume.
            </li>
            <li className="mb-2">
              <strong>LP Token Status:</strong> We check if liquidity provider tokens have been
              burned, which reduces the risk of "rug pulls" where developers remove liquidity.
            </li>
            <li className="mb-2">
              <strong>Holder Distribution:</strong> We analyze the concentration of tokens among
              top wallets to identify potential insider control.
            </li>
            <li className="mb-2">
              <strong>Trading Patterns:</strong> We look for suspicious trading activity that might
              indicate market manipulation.
            </li>
            <li className="mb-2">
              <strong>Contract Analysis:</strong> We examine the token contract for potential
              security issues or malicious functions.
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Risk Score</h2>
          
          <p className="mb-4">
            Our risk score ranges from 0% to 100%, with lower scores indicating safer investments:
          </p>
          
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              <strong>0-30%:</strong> Low Risk - The token shows minimal warning signs.
            </li>
            <li className="mb-2">
              <span className="inline-block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
              <strong>31-70%:</strong> Medium Risk - Some caution is advised.
            </li>
            <li className="mb-2">
              <span className="inline-block w-4 h-4 rounded-full bg-red-500 mr-2"></span>
              <strong>71-100%:</strong> High Risk - Multiple red flags detected.
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
          
          <p className="mb-4">
            Sollarity provides information for educational purposes only. We are not financial
            advisors, and our risk assessments should not be considered financial advice. The
            cryptocurrency market is highly volatile, and all investments carry risk. Always conduct
            your own research before investing.
          </p>
          
          <p className="mb-4">
            While we strive for accuracy, our analysis cannot guarantee the safety of any investment
            or predict future performance. New scam techniques emerge regularly, and our algorithms
            are continuously updated to address them.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          
          <p className="mb-4">
            Have questions, feedback, or want to report a token? Contact us at:
          </p>
          
          <p className="mb-8">
            <a
              href="mailto:contact@sollarity.io"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              contact@sollarity.io
            </a>
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default About;