import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import customerRoutes from './routes/customers.js';
import billRoutes from './routes/bills.js';
import bookRoutes from './routes/books.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Configure CORS for production
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: false
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/books', bookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Eagle Tailors API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.1'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Eagle Tailors Digitization API',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      bills: '/api/bills',
      books: '/api/books',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🦅  EAGLE TAILORS DIGITIZATION API                         ║
║      ईगल टेलर्स डिजिटाइजेशन सिस्टम                           ║
║                                                               ║
║   Server running on: http://localhost:${PORT}                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}                         ║
║   Database: ${process.env.DB_NAME || 'eagle_tailors'}                          ║
║                                                               ║
║   API Endpoints:                                              ║
║   • Customers: /api/customers                                 ║
║   • Bills: /api/bills                                         ║
║   • Books: /api/books                                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
