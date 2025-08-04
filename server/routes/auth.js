const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'sollarity_secret_key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ username, email, password, isEmailVerified: false });
    const otp = user.generateOTP();
    await user.save();
    
    // Send OTP email
    const { sendOTPEmail } = require('../services/emailService');
    try {
      await sendOTPEmail(email, otp, username);
      console.log(`OTP sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }
    
    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP verification.',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    
    const otp = user.generateOTP();
    await user.save();
    
    const { sendOTPEmail } = require('../services/emailService');
    try {
      await sendOTPEmail(user.email, otp, user.username);
      console.log(`OTP resent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to resend OTP email:', emailError);
    }
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log('Login attempt:', { usernameOrEmail, password: password ? '[PROVIDED]' : '[MISSING]' });
    
    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] 
    });
    
    console.log('User found:', user ? user.username : 'NO USER');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const passwordValid = await user.comparePassword(password);
    console.log('Password valid:', passwordValid);
    
    if (!passwordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email first',
        requiresVerification: true,
        userId: user._id
      });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;