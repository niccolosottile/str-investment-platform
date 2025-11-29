import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { drivingTimeRouter } from './routes/driving-time.js';
import { locationsRouter } from './routes/locations.js';

// Load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../../.env.local') });

const app = express();
const PORT = process.env.API_PORT || 8081;
const MAPBOX_SECRET_TOKEN = process.env.SECRET_MAPBOX_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mapboxConfigured: !!MAPBOX_SECRET_TOKEN 
  });
});

// Routes
app.use('/api/driving-time', drivingTimeRouter);
app.use('/api/locations', locationsRouter);

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
  console.log(`\n✅ API Server Started`);
  console.log(`   - URL: http://localhost:${PORT}`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - POST http://localhost:${PORT}/api/driving-time`);
  console.log(`   - GET http://localhost:${PORT}/api/locations/nearby`);
  console.log(`   - Mapbox: ${MAPBOX_SECRET_TOKEN ? '✓ Configured' : '✗ Not configured'}\n`);
});

export default app;
