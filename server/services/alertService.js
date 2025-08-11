const axios = require('axios');
const { sanitizeForLog } = require('../utils/sanitize');

class AlertService {
  constructor() {
    this.telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.webhookUrl = process.env.ALERT_WEBHOOK_URL;
    this.priceThreshold = 0.15; // 15% change
    this.liquidityThreshold = 0.4; // 40% change
  }

  async sendTelegramAlert(message) {
    if (!this.telegramToken || this.telegramToken === 'your_telegram_bot_token_here') {
      console.log('Telegram alert (mock):', sanitizeForLog(message));
      return;
    }

    try {
      await axios.post(`https://api.telegram.org/bot${this.telegramToken}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Telegram alert failed:', sanitizeForLog(error.message));
    }
  }

  async sendWebhookAlert(alertData) {
    if (!this.webhookUrl || this.webhookUrl === 'https://your-domain.com/api/alerts/webhook') {
      console.log('Webhook alert (mock):', sanitizeForLog(JSON.stringify(alertData)));
      return;
    }

    try {
      await axios.post(this.webhookUrl, alertData);
    } catch (error) {
      console.error('Webhook alert failed:', sanitizeForLog(error.message));
    }
  }

  async checkPriceAlert(tokenData, previousPrice) {
    if (!previousPrice || previousPrice === 0) return;

    const priceChange = Math.abs((tokenData.price - previousPrice) / previousPrice);
    
    if (priceChange >= this.priceThreshold) {
      const direction = tokenData.price > previousPrice ? '📈' : '📉';
      const percentage = (priceChange * 100).toFixed(1);
      
      const message = `${direction} <b>${tokenData.symbol}</b> price ${tokenData.price > previousPrice ? 'surged' : 'dropped'} ${percentage}% in 10 minutes!\n\nPrice: $${tokenData.price.toFixed(6)}\nMarket Cap: $${tokenData.marketCap.toLocaleString()}`;
      
      await this.sendTelegramAlert(message);
      await this.sendWebhookAlert({
        type: 'price_alert',
        token: tokenData.symbol,
        address: tokenData.address,
        change: priceChange,
        direction: tokenData.price > previousPrice ? 'up' : 'down',
        currentPrice: tokenData.price,
        previousPrice
      });
    }
  }

  async checkLiquidityAlert(tokenData, previousLiquidity) {
    if (!previousLiquidity || previousLiquidity === 0) return;

    const liquidityChange = Math.abs((tokenData.liquidityUSD - previousLiquidity) / previousLiquidity);
    
    if (liquidityChange >= this.liquidityThreshold) {
      const direction = tokenData.liquidityUSD > previousLiquidity ? '💧' : '🚨';
      const percentage = (liquidityChange * 100).toFixed(1);
      
      const message = `${direction} <b>${tokenData.symbol}</b> liquidity ${tokenData.liquidityUSD > previousLiquidity ? 'increased' : 'dropped'} ${percentage}% in 10 minutes!\n\nLiquidity: $${tokenData.liquidityUSD.toLocaleString()}\nRisk Level: ${tokenData.scamProbability > 0.7 ? 'HIGH' : tokenData.scamProbability > 0.3 ? 'MEDIUM' : 'LOW'}`;
      
      await this.sendTelegramAlert(message);
      await this.sendWebhookAlert({
        type: 'liquidity_alert',
        token: tokenData.symbol,
        address: tokenData.address,
        change: liquidityChange,
        direction: tokenData.liquidityUSD > previousLiquidity ? 'up' : 'down',
        currentLiquidity: tokenData.liquidityUSD,
        previousLiquidity
      });
    }
  }

  async processAlerts(currentTokens, previousTokens) {
    for (const token of currentTokens) {
      const previousToken = previousTokens.find(p => p.address === token.address);
      
      if (previousToken) {
        await this.checkPriceAlert(token, previousToken.price);
        await this.checkLiquidityAlert(token, previousToken.liquidityUSD);
      }
    }
  }
}

module.exports = new AlertService();