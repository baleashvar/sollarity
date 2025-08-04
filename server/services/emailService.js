const nodemailer = require('nodemailer');

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email configuration on startup (only if credentials exist)
if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
  transporter.verify(function(error, success) {
    if (error) {
      console.log('Email configuration error:', error.message || 'Unknown error');
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.log('Email service disabled - no SMTP credentials provided');
}

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.SES_FROM_EMAIL || 'info@sollarity.xyz',
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    html,
    text
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendDailyRegistrationReport = async () => {
  try {
    const User = require('../models/User');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get users registered in the last 24 hours
    const newUsers = await User.find({
      createdAt: {
        $gte: yesterday,
        $lt: today
      }
    }).select('username email createdAt');
    
    if (newUsers.length === 0) {
      console.log('No new registrations today - skipping email');
      return;
    }
    
    const subject = `Daily Registration Report - ${newUsers.length} New Users`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Daily Registration Report</h2>
        <p><strong>Date:</strong> ${today.toDateString()}</p>
        <p><strong>New Registrations:</strong> ${newUsers.length}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Username</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Email</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Registration Time</th>
            </tr>
          </thead>
          <tbody>
            ${newUsers.map(user => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${user.username}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${user.email}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          © 2025 Sollarity. Automated daily report.
        </p>
      </div>
    `;
    
    return sendEmail({
      to: process.env.ADMIN_EMAIL || 'sollarity1@gmail.com',
      subject,
      html
    });
  } catch (error) {
    console.error('Failed to send daily registration report:', error);
  }
};

const sendOTPEmail = async (email, otp, userName) => {
  const subject = 'Verify Your Sollarity Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Verify Your Sollarity Account</h2>
      <p>Hello ${userName || 'User'},</p>
      <p>Your verification code is:</p>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #6366f1; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="color: #6b7280; font-size: 12px;">
        © 2025 Sollarity. All rights reserved.
      </p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

module.exports = {
  sendEmail,
  sendDailyRegistrationReport,
  sendOTPEmail
};