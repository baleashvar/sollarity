const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/ads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG) and PDF files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = 'uploads/ads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Submit advertising request
router.post('/submit', upload.single('adFile'), async (req, res) => {
  try {
    const { contactName, email, website, companyName, budget, advertText, comments } = req.body;
    
    if (!contactName || !email || !website || !companyName || !budget || !advertText) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    // Prepare email content
    const advertisingHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Advertising Request - Sollarity</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company/Project:</strong> ${companyName}</p>
          <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
          
          <h3 style="color: #374151;">Advertising Details</h3>
          <p><strong>Budget Range:</strong> ${budget}</p>
          <p><strong>Advertisement Text:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${advertText.replace(/\n/g, '<br>')}
          </div>
          
          ${comments ? `
            <h3 style="color: #374151;">Additional Comments</h3>
            <div style="background: white; padding: 15px; border-radius: 4px;">
              ${comments.replace(/\n/g, '<br>')}
            </div>
          ` : ''}
          
          ${req.file ? `
            <h3 style="color: #374151;">Uploaded File</h3>
            <p><strong>Filename:</strong> ${req.file.originalname}</p>
            <p><strong>Size:</strong> ${(req.file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><em>File saved on server: ${req.file.filename}</em></p>
          ` : ''}
        </div>
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          Submitted from Sollarity Advertising Form<br>
          Time: ${new Date().toLocaleString()}<br>
          IP: ${req.ip || 'Unknown'}
        </p>
      </div>
    `;
    
    // Send to multiple admin emails
    const adminEmails = [
      'baleashvar@gmail.com',
      'info@sollarity.xyz', 
      'baleashomega@gmail.com'
    ];
    
    for (const adminEmail of adminEmails) {
      await sendEmail({
        to: adminEmail,
        subject: `New Advertising Request: ${companyName} - ${budget}`,
        html: advertisingHtml,
        replyTo: email
      });
    }
    
    // Send confirmation email to advertiser
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Thank You for Your Advertising Interest!</h2>
        <p>Hello ${contactName},</p>
        <p>We've received your advertising request for <strong>${companyName}</strong> and will review it shortly.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Summary:</h3>
          <p><strong>Company/Project:</strong> ${companyName}</p>
          <p><strong>Budget Range:</strong> ${budget}</p>
          <p><strong>Website:</strong> ${website}</p>
          ${req.file ? `<p><strong>File Uploaded:</strong> ${req.file.originalname}</p>` : ''}
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Our team will review your request within 24 hours</li>
          <li>We'll contact you with advertising options and pricing</li>
          <li>Once approved, we'll help you launch your campaign</li>
        </ul>
        
        <p>If you have any questions, feel free to reply to this email.</p>
        
        <hr>
        <p style="color: #6b7280; font-size: 12px;">
          © 2025 Sollarity. All rights reserved.<br>
          This is an automated confirmation email.
        </p>
      </div>
    `;
    
    try {
      await sendEmail({
        to: email,
        subject: 'Advertising Request Received - Sollarity',
        html: confirmationHtml
      });
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError);
    }
    
    res.json({ 
      message: 'Advertising request submitted successfully',
      fileUploaded: !!req.file
    });
    
  } catch (error) {
    console.error('Advertising submission error:', error);
    res.status(500).json({ message: 'Failed to submit advertising request' });
  }
});

module.exports = router;