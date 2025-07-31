const cron = require('node-cron');
const { sendDailyRegistrationReport } = require('../services/emailService');

// Schedule daily registration report at 9:00 AM every day
const scheduleDailyReport = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily registration report...');
    try {
      await sendDailyRegistrationReport();
      console.log('Daily registration report sent successfully');
    } catch (error) {
      console.error('Failed to send daily registration report:', error);
    }
  }, {
    timezone: "America/New_York"
  });
  
  console.log('Daily registration report scheduled for 9:00 AM EST');
};

module.exports = {
  scheduleDailyReport
};