import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import limiter from './middleware/rateLimiter.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10kb' })); // Limit body size

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing HTTP server...');
  app.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
Server is running in ${process.env.NODE_ENV} mode on port ${PORT}
Frontend URL: ${process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173'}
Backend URL: http://localhost:${PORT}
Health Check: http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();