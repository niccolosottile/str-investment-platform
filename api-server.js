// Simple Node.js API server for driving time calculations
// Run with: node api-server.js

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.API_PORT || 8081;
const MAPBOX_SECRET_TOKEN = process.env.SECRET_MAPBOX_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mapboxConfigured: !!MAPBOX_SECRET_TOKEN 
  });
});

// Driving time endpoint
app.post('/api/driving-time', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    // Validation
    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both origin and destination are required',
      });
    }
    
    if (!MAPBOX_SECRET_TOKEN) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Mapbox token not configured',
      });
    }
    
    // Call Mapbox Directions API
    const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`;
    
    const params = new URLSearchParams({
      access_token: MAPBOX_SECRET_TOKEN,
      geometries: 'geojson',
      overview: 'false',
      steps: 'false',
    });
    
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({
        error: 'No route found',
        message: 'Unable to calculate driving route between these locations',
      });
    }
    
    const route = data.routes[0];
    const durationMinutes = Math.round(route.duration / 60);
    const distanceKm = Math.round(route.distance / 1000 * 10) / 10;
    
    console.log(`✓ Calculated route: ${distanceKm}km, ${durationMinutes}min`);
    
    res.json({
      duration: durationMinutes,
      distance: distanceKm,
      cached: false,
    });
  } catch (error) {
    console.error('Driving time calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate driving time',
      message: error.message,
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
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
  console.log(`   - Endpoint: POST http://localhost:${PORT}/api/driving-time`);
  console.log(`   - Mapbox: ${MAPBOX_SECRET_TOKEN ? '✓ Configured' : '✗ Not configured'}\n`);
});
