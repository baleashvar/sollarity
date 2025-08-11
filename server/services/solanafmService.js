const axios = require('axios');
const { sanitizeForLog } = require('../utils/sanitize');

class SolanaFMService {
  constructor() {
    this.baseURL = process.env.SOLANAFM_API_URL || 'https://api.solana.fm';
  }

  async getTokenVerification(tokenAddress) {
    try {
      const response = await axios.get(`${this.baseURL}/v0/tokens/${tokenAddress}`, {
        timeout: 10000
      });

      if (response.data) {
        return {
          verified: response.data.verified || false,
          verificationSource: response.data.verificationSource || 'unknown',
          tags: response.data.tags || [],
          isScam: response.data.tags?.includes('scam') || false
        };
      }
      return null;
    } catch (error) {
      console.error('SolanaFM verification fetch error:', sanitizeForLog(error.message));
      return null;
    }
  }

  async getWhaleTransactions(limit = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/v0/transactions`, {
        params: {
          limit,
          sort: 'value_desc',
          timeframe: '24h'
        },
        timeout: 15000
      });

      if (response.data?.transactions) {
        return response.data.transactions.map(tx => ({
          signature: tx.signature,
          wallet: tx.feePayer,
          amount: tx.amount,
          tokenMint: tx.tokenMint,
          type: tx.type,
          timestamp: tx.timestamp,
          value: tx.valueUSD
        }));
      }
      return [];
    } catch (error) {
      console.error('SolanaFM whale transactions fetch error:', sanitizeForLog(error.message));
      return [];
    }
  }

  async getWalletActivity(walletAddress, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/v0/accounts/${walletAddress}/transactions`, {
        params: { limit },
        timeout: 10000
      });

      if (response.data?.transactions) {
        return response.data.transactions.map(tx => ({
          signature: tx.signature,
          type: tx.type,
          amount: tx.amount,
          tokenMint: tx.tokenMint,
          timestamp: tx.timestamp,
          success: tx.success
        }));
      }
      return [];
    } catch (error) {
      console.error('SolanaFM wallet activity fetch error:', sanitizeForLog(error.message));
      return [];
    }
  }

  async getTopWallets(timeframe = '24h') {
    try {
      // Mock implementation - SolanaFM API structure may vary
      const transactions = await this.getWhaleTransactions(100);
      
      const walletStats = {};
      
      transactions.forEach(tx => {
        if (!walletStats[tx.wallet]) {
          walletStats[tx.wallet] = {
            wallet: tx.wallet,
            totalVolume: 0,
            transactionCount: 0,
            tokens: new Set()
          };
        }
        
        walletStats[tx.wallet].totalVolume += tx.value || 0;
        walletStats[tx.wallet].transactionCount += 1;
        if (tx.tokenMint) {
          walletStats[tx.wallet].tokens.add(tx.tokenMint);
        }
      });

      return Object.values(walletStats)
        .map(wallet => ({
          ...wallet,
          uniqueTokens: wallet.tokens.size
        }))
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 10);
    } catch (error) {
      console.error('SolanaFM top wallets fetch error:', sanitizeForLog(error.message));
      return [];
    }
  }
}

module.exports = new SolanaFMService();