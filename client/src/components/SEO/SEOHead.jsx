import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "Sollarity - Solana Memecoin Analysis Platform",
  description = "Track Solana memecoin holders, insiders, LP lock data, and scam detection in one dashboard. Real-time analytics for BONK, WIF, and top Solana tokens.",
  keywords = "solana memecoins, bonk tracker, solana tokens, memecoin analytics, solana scam detection, crypto analysis",
  image = "https://sollarity.xyz/og-image.png",
  url = "https://sollarity.xyz"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEOHead;