const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDB } = require('./src/config/db');
const dataStore = require('./src/services/dataStoreService');
const { initSocketIO } = require('./src/websocket/socketHandler');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const alertRoutes = require('./src/routes/alertRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const networkRoutes = require('./src/routes/networkRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const searchRoutes = require('./src/routes/searchRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Root endpoint
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    app: 'Bitcoin Traffic Intelligence API',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve built client (production) with SPA fallback
const path = require('path');
const fs = require('fs');
const distDir = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/search', searchRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server initialization
async function startServer() {
  await initDB();
  await dataStore.initSeedData();
  initSocketIO(io);

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Bitcoin Traffic Intelligence Backend Running`);
    console.log(` REST API URL : http://localhost:${PORT}`);
    console.log(` WebSocket URL: ws://localhost:${PORT}`);
    console.log(` Environment  : ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

startServer();
