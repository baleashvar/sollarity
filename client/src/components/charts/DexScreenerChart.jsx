import React, { useEffect, useState } from 'react';

const DexScreenerChart = ({ address, symbol }) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setTimedOut(false);
    setError(null);
    setSrc(null);

    if (!address) {
      setError('No token address provided');
      setLoading(false);
      return;
    }

    const tokenAddress = encodeURIComponent(address);
    const defaultUrl = `https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=light&trades=0&info=0`;

    const to = setTimeout(() => {
      if (mounted) setTimedOut(true);
    }, 10000);

    (async () => {
      try {
        // Best-effort lookup of pools for the token
        const apiUrl = `https://api.dexscreener.com/token-pairs/v1/solana/${tokenAddress}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          // fall back to default token page
          if (mounted) setSrc(defaultUrl);
          return;
        }

        const pairs = await res.json();
        if (!Array.isArray(pairs) || pairs.length === 0) {
          if (mounted) setSrc(defaultUrl);
          return;
        }

        // Pick pair with highest reported liquidity.usd (best candidate for chart)
        const best = pairs.reduce((acc, p) => {
          const liq = (p.liquidity && typeof p.liquidity.usd === 'number') ? p.liquidity.usd : 0;
          return liq > (acc.liquidity || 0) ? { pair: p, liquidity: liq } : acc;
        }, { pair: null, liquidity: 0 }).pair || pairs[0];

        let pairId = null;
        if (best.pairAddress) pairId = best.pairAddress;
        else if (best.url) {
          try {
            const u = new URL(best.url);
            const parts = u.pathname.split('/').filter(Boolean);
            pairId = parts[parts.length - 1];
          } catch (e) {
            pairId = null;
          }
        }

        if (pairId) {
          if (mounted) setSrc(`https://dexscreener.com/solana/${encodeURIComponent(pairId)}?embed=1&theme=light&trades=0&info=0`);
        } else {
          if (mounted) setSrc(defaultUrl);
        }
      } catch (err) {
        console.debug('DexScreener lookup failed:', err);
        if (mounted) setSrc(defaultUrl);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(to);
    };
  }, [address]);

  const directTokenUrl = `https://dexscreener.com/solana/${encodeURIComponent(address)}`;
  const searchUrl = `https://dexscreener.com/search?q=${encodeURIComponent(symbol || address)}`;

  if (error) {
    return <div className="p-4 text-sm text-red-600">DexScreener error: {error}</div>;
  }

  return (
    <div className="h-96 w-full bg-white rounded-lg overflow-hidden relative">
      {loading && !timedOut && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
        </div>
      )}

      {src ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          title={`DexScreener Chart for ${address}`}
          className="rounded-lg"
          onLoad={() => setLoading(false)}
        />
      ) : (
        <div className="p-4 text-sm text-gray-600">Preparing chart...</div>
      )}

      {timedOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 p-4">
          <p className="mb-3 text-gray-700">Chart failed to load — try one of these:</p>
          <div className="flex gap-2">
            <a
              href={directTokenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Open token page
            </a>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
              Search on DexScreener
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DexScreenerChart;