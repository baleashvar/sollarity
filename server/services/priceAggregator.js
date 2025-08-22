const axios = require('axios');
const moralisService = require('./moralisService');
const solanafmService = require('./solanafmService');
const dataService = require('./dataService');
const path = require('path');
const fs = require('fs');

const CACHE_TTL_MS = parseInt(process.env.AGGREGATOR_TTL_MS || '15000', 10); // 15s default

class PriceAggregator {
  constructor() {
    this.cache = new Map(); // key -> { ts, data }
    this.overrides = {};

    // load overrides if present
    try {
      const p = path.join(__dirname, '..', '..', 'config', 'dexscreener-overrides.json');
      if (fs.existsSync(p)) {
        this.overrides = JSON.parse(fs.readFileSync(p, 'utf8')) || {};
      }
    } catch (err) {
      console.warn('Aggregator overrides load failed:', err.message);
    }
  }

  _cacheKey(chain, address) {
    return `${chain || 'unknown'}:${(address || '').toString().toLowerCase()}`;
  }

  async getTokenData(chain = 'solana', address) {
    if (!address) return null;
    const key = this._cacheKey(chain, address);

    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
      return cached.data;
    }

    // best-effort parallel fetch
    const calls = [];

    // DexScreener token-pairs endpoint
    calls.push(this._fetchFromDexscreener(chain, address));

    // Moralis (liquidity/holders/metrics)
    calls.push(this._fetchFromMoralis(address));

    // SolanaFM (verification/metadata)
    calls.push(this._fetchFromSolanaFM(address));

    // DataService may have cached DB entry
    calls.push(this._fetchFromInternalDB(address));

    const [dex, moralis, solanafm, internal] = await Promise.all(calls.map(p => p.catch ? p.catch(e => null) : p));

    // Merge strategy (simple): prefer DexScreener price, then Moralis metrics, then internal DB
    const result = {
      address,
      chain,
      price: null,
      volume24h: null,
      liquidityUSD: null,
      holders: null,
      source: null,
      lastUpdated: new Date()
    };

    if (dex && dex.price) {
      result.price = dex.price;
      result.volume24h = dex.volume24h || null;
      result.liquidityUSD = dex.liquidityUSD || null;
      result.source = 'dexscreener';
    }

    if ((!result.price || result.price === 0) && moralis && moralis.metrics && moralis.metrics.priceChange24h !== undefined) {
      // Moralis doesn't always return price directly; use internal DB as fallback for price
      result.price = moralis.metrics.price || result.price;
      result.source = result.source || 'moralis';
    }

    if ((!result.price || result.price === 0) && internal && internal.price) {
      result.price = internal.price;
      result.source = result.source || 'internal';
    }

    // Fill holders and extra metadata
    if (moralis && moralis.holders) {
      result.holders = moralis.holders;
    }
    if (solanafm) {
      result.verified = solanafm.verified;
      result.verificationSource = solanafm.verificationSource;
      result.solanafm = solanafm;
    }

    // last resort: use pair override if DexScreener returned nothing
    if ((!dex || !dex.price) && this._hasOverride(address, chain)) {
      const o = this._getOverride(address, chain);
      if (o && o.pairId) {
        const alt = await this._fetchFromDexscreener(o.chain || chain, o.pairId);
        if (alt && alt.price) {
          result.price = alt.price;
          result.source = 'dexscreener-override';
        }
      }
    }

    result.lastUpdated = new Date();
    this.cache.set(key, { ts: Date.now(), data: result });

    return result;
  }

  _hasOverride(address, chain) {
    const key = (address || '').toString().toLowerCase();
    return !!this.overrides[key] || !!this.overrides[`${chain}:${key}`];
  }

  _getOverride(address, chain) {
    const key = (address || '').toString().toLowerCase();
    return this.overrides[key] || this.overrides[`${chain}:${key}`] || null;
  }

  async _fetchFromDexscreener(chain, tokenAddress) {
    try {
      // DexScreener token-pairs endpoint
      const url = `https://api.dexscreener.com/token-pairs/v1/${encodeURIComponent(chain)}/${encodeURIComponent(tokenAddress)}`;
      const resp = await axios.get(url, { timeout: 10000 });
      if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
        const p = resp.data[0];
        return {
          price: parseFloat(p.priceUsd || 0),
          volume24h: parseFloat(p.volume?.h24 || 0) || null,
          liquidityUSD: p.liquidity?.usd || null,
          raw: p
        };
      }

      return null;
    } catch (err) {
      // some DexScreener endpoints return object with pairs
      try {
        const alt = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${encodeURIComponent(chain)}/${encodeURIComponent(tokenAddress)}`, { timeout: 10000 });
        if (alt.data && alt.data.pairs && alt.data.pairs.length) {
          const p = alt.data.pairs[0];
          return { price: parseFloat(p.priceUsd || 0), volume24h: parseFloat(p.volume?.h24 || 0) || null, liquidityUSD: p.liquidity?.usd || null, raw: p };
        }
      } catch (e) {
        // ignore
      }
      return null;
    }
  }

  async _fetchFromMoralis(tokenAddress) {
    try {
      const metrics = await moralisService.getTokenMetrics(tokenAddress);
      const holders = await moralisService.getTokenHolders(tokenAddress);
      return { metrics, holders };
    } catch (err) {
      return null;
    }
  }

  async _fetchFromSolanaFM(tokenAddress) {
    try {
      const v = await solanafmService.getTokenVerification(tokenAddress);
      return v;
    } catch (err) {
      return null;
    }
  }

  async _fetchFromInternalDB(tokenAddress) {
    try {
      // dataService.refreshAllData populates DB, but we can query Coin model via dataService if exposed.
      // For now use dataService to attempt a refresh then rely on DB read via dataService (not ideal but lightweight)
      const coins = await dataService.fetchTop1000SolanaTokens();
      const found = coins.find(c => (c.address || '').toLowerCase() === (tokenAddress || '').toLowerCase());
      return found || null;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new PriceAggregator();
