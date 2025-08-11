const express = require('express');
const router = express.Router();
const telegramBot = require('../services/telegramBot');

// Webhook endpoint for Telegram bot
router.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text.trim();
      
      if (text.startsWith('/')) {
        const [command, ...args] = text.split(' ');
        await telegramBot.handleCommand(chatId, command, args);
      } else {
        await telegramBot.sendMessage(chatId, 'Type /help for available commands.');
      }
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error.message);
    res.json({ ok: true }); // Always return ok to Telegram
  }
});

// Set webhook URL
router.post('/set-webhook', async (req, res) => {
  try {
    const webhookUrl = `${process.env.API_URL}/api/telegram/webhook`;
    // You'll need to call this once to set up the webhook
    res.json({ 
      message: 'Set webhook manually',
      url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Webhook setup failed' });
  }
});

module.exports = router;