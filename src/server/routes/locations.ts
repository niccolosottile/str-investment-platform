import { Router, Request, Response, NextFunction } from 'express';
import { calculateDistance } from '../../lib/utils/distance';

const router = Router();

// In-memory cache for nearby locations (24-hour TTL)
const nearbyCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// European country codes
const EUROPEAN_COUNTRIES = [
  'IT', 'FR', 'ES', 'DE', 'PT', 'GB', 'IE', 'NL', 'BE', 
  'AT', 'CH', 'GR', 'DK', 'SE', 'NO', 'FI'
];

interface NearbyLocation {
  id: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
}

/**
 * GET /api/locations/nearby
 * Find nearby cities within a specified radius using Mapbox Geocoding API
 */
router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius } = req.query;
    
    // Validation
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both lat and lng are required',
      });
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = radius ? parseFloat(radius as string) : 100;
    
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'lat, lng, and radius must be valid numbers',
      });
    }
    
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Coordinates out of valid range',
      });
    }
    
    if (radiusKm < 1 || radiusKm > 500) {
      return res.status(400).json({
        error: 'Invalid radius',
        message: 'Radius must be between 1 and 500 km',
      });
    }
    
    const MAPBOX_SECRET_TOKEN = process.env.SECRET_MAPBOX_TOKEN;
    
    if (!MAPBOX_SECRET_TOKEN) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Mapbox token not configured',
      });
    }
    
    // Check cache
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)},${radiusKm}`;
    const cached = nearbyCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({
        locations: cached.data,
        cached: true,
        timestamp: cached.timestamp,
      });
    }
    
    // Use reverse geocoding with a multi-ring grid pattern to find nearby cities
    // We'll sample points at different distances and angles to get comprehensive coverage
    const allFeatures = new Map<string, any>();
    
    // Sample at multiple distance rings (25%, 50%, 75%, 100% of radius)
    const distanceRings = [0.25, 0.5, 0.75, 1.0];
    const anglesPerRing = 8; // 8 points per ring (every 45 degrees)
    
    for (const ringRatio of distanceRings) {
      const distKm = radiusKm * ringRatio;
      
      for (let i = 0; i < anglesPerRing; i++) {
        const angle = (2 * Math.PI * i) / anglesPerRing;
        
        // Calculate point coordinates
        const latOffset = (distKm / 111) * Math.cos(angle);
        const lngOffset = (distKm / (111 * Math.cos(latitude * Math.PI / 180))) * Math.sin(angle);
        const sampleLat = latitude + latOffset;
        const sampleLng = longitude + lngOffset;
        
        // Reverse geocode this point
        const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${sampleLng},${sampleLat}.json`;
        const params = new URLSearchParams({
          access_token: MAPBOX_SECRET_TOKEN,
          types: 'place',
          limit: '10', // Increased from 5 to get more options per point
          language: 'en',
        });
        
        try {
          const response = await fetch(`${searchUrl}?${params}`);
          if (!response.ok) continue;
          
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            data.features.forEach((feature: any) => {
              const [lng, lat] = feature.center;
              const distance = calculateDistance(latitude, longitude, lat, lng);
              
              // Only include if within actual radius
              if (distance <= radiusKm && !allFeatures.has(feature.id)) {
                allFeatures.set(feature.id, feature);
              }
            });
          }
        } catch (error) {
          // Skip failed requests
          continue;
        }
      }
    }
    
    // Also check the center point
    try {
      const centerUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`;
      const centerParams = new URLSearchParams({
        access_token: MAPBOX_SECRET_TOKEN,
        types: 'place',
        limit: '10',
        language: 'en',
      });
      
      const centerResponse = await fetch(`${centerUrl}?${centerParams}`);
      if (centerResponse.ok) {
        const centerData = await centerResponse.json();
        if (centerData.features) {
          centerData.features.forEach((feature: any) => {
            const [lng, lat] = feature.center;
            const distance = calculateDistance(latitude, longitude, lat, lng);
            if (distance <= radiusKm && !allFeatures.has(feature.id)) {
              allFeatures.set(feature.id, feature);
            }
          });
        }
      }
    } catch (error) {
      // Center point is optional
    }
    
    const features = Array.from(allFeatures.values());
    
    if (features.length === 0) {
      return res.json({
        locations: [],
        cached: false,
      });
    }
    
    // Process and filter locations
    const locations: NearbyLocation[] = features
      .map((feature: any) => {
        const countryContext = feature.context?.find((c: any) => c.id.startsWith('country.'));
        const countryCode = countryContext?.short_code?.toUpperCase();
        
        const [lng, lat] = feature.center;
        const city = feature.text;
        const country = countryContext?.text || '';
        
        const distance = calculateDistance(latitude, longitude, lat, lng);
        
        return {
          id: feature.id,
          city,
          country,
          countryCode,
          coordinates: { lat, lng },
          distance: Math.round(distance * 10) / 10,
        };
      })
      .filter((loc: any) => loc.countryCode && EUROPEAN_COUNTRIES.includes(loc.countryCode))
      .filter((loc: any) => loc.distance <= radiusKm)
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, 20)
      .map(({ id, city, country, coordinates }: any) => ({
        id,
        city,
        country,
        coordinates,
      }));
    
    // Cache the results
    nearbyCache.set(cacheKey, {
      data: locations,
      timestamp: Date.now(),
    });
    
    // Clean old cache entries
    if (nearbyCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of nearbyCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          nearbyCache.delete(key);
        }
      }
    }
    
    res.json({
      locations,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

export { router as locationsRouter };
