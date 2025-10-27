import { Router, Request, Response } from 'express';

const router = Router();
const MAPBOX_SECRET_TOKEN = process.env.SECRET_MAPBOX_TOKEN || '';

interface DrivingTimeRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

/**
 * POST /api/driving-time
 * Calculate real driving time between two points using Mapbox Directions API
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.body as DrivingTimeRequest;
    
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
    
    res.json({
      duration: durationMinutes,
      distance: distanceKm,
      cached: false,
    });
  } catch (error) {
    console.error('Driving time calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate driving time',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as drivingTimeRouter };
