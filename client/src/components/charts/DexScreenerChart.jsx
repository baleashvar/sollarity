import React from 'react';

const DexScreenerChart = ({ address }) => {
  return (
    <div className="h-96 w-full bg-white rounded-lg overflow-hidden">
      <iframe
        src={`https://dexscreener.com/solana/${address}?embed=1&theme=light&trades=0&info=0`}
        width="100%"
        height="100%"
        frameBorder="0"
        title={`DexScreener Chart for ${address}`}
        className="rounded-lg"
      />
    </div>
  );
};

export default DexScreenerChart;