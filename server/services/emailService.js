const AWS = require('aws-sdk');

// Configure AWS SES
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ses = new AWS.SES();

const sendEmail = async ({ to, subject, html, text }) => {
  const params = {
    Source: process.env.SES_FROM_EMAIL || 'info@sollarity.xyz',
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: html ? {
          Data: html,
          Charset: 'UTF-8'
        } : undefined,
        Text: text ? {
          Data: text,
          Charset: 'UTF-8'
        } : undefined
      }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendRegistrationNotification = async (userEmail, userAgent) => {
  const subject = 'New User Registration - Sollarity';
  const html = `
    <h2>New User Registration</h2>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>User Agent:</strong> ${userAgent}</p>
  `;
  
  return sendEmail({
    to: 'info@sollarity.xyz',
    subject,
    html
  });
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
  sendRegistrationNotification,
  sendOTPEmail
};