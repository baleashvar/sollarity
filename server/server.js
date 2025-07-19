const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sollarity', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import routes
const coinRoutes = require('./routes/coins');
const testRoutes = require('./routes/test');
const paypalRoutes = require('./routes/paypalRoutes');
const scamAlertRoutes = require('./routes/scamAlerts');

// Use routes
app.use('/api/coins', coinRoutes);
app.use('/api/test', testRoutes);
app.use('/api/payments', paypalRoutes);
app.use('/api/scam-alerts', scamAlertRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Add a catch-all route for API routes that don't exist
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test API at: http://localhost:${PORT}/api/test`);
    console.log(`Health check at: http://localhost:${PORT}/health`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
}