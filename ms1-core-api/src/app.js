require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/connection');
const { authenticate } = require('./middleware/auth');
const { getStatsController } = require('./controllers/analyticsController');
const { analyzeDealController } = require('./controllers/dealController');
const authRoutes = require('./routes/auth');
const dealRoutes = require('./routes/deals');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ms1-core-api'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ms1-core-api'
  });
});

// Top-level aliases for direct frontend compatibility
app.get('/api/stats', authenticate, getStatsController);
app.post('/api/analyze', authenticate, analyzeDealController);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`MS1 Core API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
