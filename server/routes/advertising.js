const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendEmail } = require('../services/emailService');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'ads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Handle preflight requests
router.options('/submit', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File upload attempt:', file.originalname, file.mimetype);
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

// Submit advertising request
router.post('/submit', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}, upload.single('adFile'), async (req, res) => {
  try {
    const { contactName, email, website, companyName, budget, advertText, comments } = req.body;
    
    // Validate required fields
    if (!contactName || !email || !website || !companyName || !budget || !advertText) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Prepare email content
    const emailContent = `
      <h2>New Advertising Request</h2>
      <p><strong>Contact Name:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Website:</strong> ${website}</p>
      <p><strong>Company/Project:</strong> ${companyName}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Advertisement Text:</strong></p>
      <p>${advertText}</p>
      ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
      ${req.file ? `<p><strong>File Uploaded:</strong> ${req.file.filename}</p>` : ''}
      <hr>
      <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Advertising Request from ${companyName}`,
      html: emailContent
    });
    
    console.log('📧 Admin email sent successfully');

    // Send confirmation email to advertiser
    await sendEmail({
      to: email,
      subject: 'Advertising Request Received - Sollarity',
      html: `
        <h2>Thank you for your advertising inquiry!</h2>
        <p>Dear ${contactName},</p>
        <p>We have received your advertising request for <strong>${companyName}</strong>.</p>
        <p>Our team will review your submission and get back to you within 24 hours with pricing and placement options.</p>
        <p>Best regards,<br>Sollarity Team</p>
      `
    });

    res.json({ 
      message: 'Advertising request submitted successfully',
      requestId: Date.now().toString()
    });

  } catch (error) {
    console.error('Advertising submission error:', error);
    
    // Handle multer errors specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Invalid file upload.' });
    }
    
    res.status(500).json({ message: 'Failed to submit advertising request: ' + error.message });
  }
});

module.exports = router;