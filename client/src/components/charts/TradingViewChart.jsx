import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol, address }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Clear previous widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    // Use textContent instead of innerHTML to avoid accidental HTML parsing
    script.textContent = JSON.stringify({
      autosize: true,
      symbol: `CRYPTO:${symbol}USD`,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      gridColor: 'rgba(240, 243, 250, 1)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: `tradingview_${address}`
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, address]);

  return (
    <div className="h-96 w-full">
      <div 
        ref={containerRef}
        id={`tradingview_${address}`}
        className="h-full w-full"
      />
    </div>
  );
};

export default TradingViewChart;