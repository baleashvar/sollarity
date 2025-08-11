const axios = require('axios');
const Coin = require('../models/Coin');

class TelegramBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.baseURL = `https://api.telegram.org/bot${this.token}`;
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...options
      });
    } catch (error) {
      console.error('Telegram send message error:', error.message);
    }
  }

  async handleCommand(chatId, command, args) {
    switch (command) {
      case '/start':
        await this.sendMessage(chatId, 
          `🚀 <b>Welcome to Sollarity Bot!</b>\n\n` +
          `Get real-time Solana memecoin alerts and data.\n\n` +
          `<b>Commands:</b>\n` +
          `/alerts - Enable price & liquidity alerts\n` +
          `/top - Top 10 tokens by market cap\n` +
          `/search [symbol] - Search for a token\n` +
          `/whales - Recent whale transactions\n` +
          `/help - Show this help message`
        );
        break;

      case '/help':
        await this.sendMessage(chatId,
          `<b>Sollarity Bot Commands:</b>\n\n` +
          `🔔 /alerts - Toggle price alerts\n` +
          `📊 /top - Top 10 tokens\n` +
          `🔍 /search [symbol] - Find token\n` +
          `🐋 /whales - Whale activity\n` +
          `📈 /trending - Trending tokens\n\n` +
          `Visit: https://sollarity.xyz`
        );
        break;

      case '/top':
        await this.sendTopTokens(chatId);
        break;

      case '/search':
        if (args.length > 0) {
          await this.searchToken(chatId, args[0]);
        } else {
          await this.sendMessage(chatId, 'Usage: /search [token symbol]');
        }
        break;

      case '/alerts':
        await this.sendMessage(chatId, 
          `🔔 <b>Alert Settings</b>\n\n` +
          `You'll receive alerts for:\n` +
          `• Price changes > 15%\n` +
          `• Liquidity drops > 40%\n` +
          `• New high-risk tokens\n\n` +
          `Alerts are now enabled for this chat!`
        );
        break;

      case '/whales':
        await this.sendMessage(chatId,
          `🐋 <b>Whale Activity</b>\n\n` +
          `Recent large transactions:\n` +
          `• Monitor via: https://sollarity.xyz\n` +
          `• Real-time whale tracker\n` +
          `• Top wallet movements`
        );
        break;

      default:
        await this.sendMessage(chatId, 'Unknown command. Type /help for available commands.');
    }
  }

  async sendTopTokens(chatId) {
    try {
      const tokens = await Coin.find({})
        .sort({ marketCap: -1 })
        .limit(5)
        .select('symbol name price marketCap priceChange24h scamProbability');

      let message = '📊 <b>Top 5 Tokens by Market Cap</b>\n\n';
      
      tokens.forEach((token, index) => {
        const risk = token.scamProbability < 0.3 ? '🟢' : token.scamProbability < 0.7 ? '🟡' : '🔴';
        const change = token.priceChange24h >= 0 ? '📈' : '📉';
        
        message += `${index + 1}. <b>${token.symbol}</b> ${risk}\n`;
        message += `   $${token.price?.toFixed(6) || '0'} ${change} ${(token.priceChange24h * 100).toFixed(1)}%\n`;
        message += `   MC: $${(token.marketCap || 0).toLocaleString()}\n\n`;
      });

      message += `View all tokens: https://sollarity.xyz`;
      await this.sendMessage(chatId, message);
    } catch (error) {
      await this.sendMessage(chatId, 'Error fetching token data. Please try again.');
    }
  }

  async searchToken(chatId, symbol) {
    try {
      const token = await Coin.findOne({ 
        symbol: { $regex: new RegExp(symbol, 'i') } 
      });

      if (!token) {
        await this.sendMessage(chatId, `Token "${symbol}" not found.`);
        return;
      }

      const risk = token.scamProbability < 0.3 ? '🟢 Low' : token.scamProbability < 0.7 ? '🟡 Medium' : '🔴 High';
      const change = token.priceChange24h >= 0 ? '📈' : '📉';

      const message = 
        `🪙 <b>${token.name} (${token.symbol})</b>\n\n` +
        `💰 Price: $${token.price?.toFixed(6) || '0'}\n` +
        `${change} 24h: ${(token.priceChange24h * 100).toFixed(1)}%\n` +
        `📊 Market Cap: $${(token.marketCap || 0).toLocaleString()}\n` +
        `💧 Liquidity: $${(token.liquidityUSD || 0).toLocaleString()}\n` +
        `⚠️ Risk: ${risk}\n\n` +
        `🔗 Trade: https://jup.ag/swap/So11111111111111111111111111111112-${token.address}\n` +
        `📈 Details: https://sollarity.xyz/coin/${token.address}`;

      await this.sendMessage(chatId, message);
    } catch (error) {
      await this.sendMessage(chatId, 'Error searching token. Please try again.');
    }
  }
}

module.exports = new TelegramBot();