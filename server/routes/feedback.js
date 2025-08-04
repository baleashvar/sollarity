const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

// Submit feedback
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Send feedback email to admin
    const feedbackHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Feedback - Sollarity</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          Sent from Sollarity Feedback Form<br>
          Time: ${new Date().toLocaleString()}
        </p>
      </div>
    `;
    
    await sendEmail({
      to: 'sollarity1@gmail.com',
      subject: `Sollarity Feedback: ${subject}`,
      html: feedbackHtml,
      replyTo: email
    });
    
    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Thank You for Your Feedback!</h2>
        <p>Hello ${name},</p>
        <p>We've received your feedback and will review it shortly. Here's a copy of what you sent:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p>We appreciate your input and will get back to you if needed.</p>
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          © 2025 Sollarity. All rights reserved.
        </p>
      </div>
    `;
    
    try {
      await sendEmail({
        to: email,
        subject: 'Thank you for your feedback - Sollarity',
        html: confirmationHtml
      });
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError);
    }
    
    res.json({ message: 'Feedback submitted successfully' });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

module.exports = router;