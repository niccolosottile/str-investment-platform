import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { drivingTimeRouter } from './routes/driving-time.js';

const app = express();
const PORT = process.env.API_PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/driving-time', drivingTimeRouter);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`📍 Driving time endpoint: http://localhost:${PORT}/api/driving-time`);
});

export default app;
