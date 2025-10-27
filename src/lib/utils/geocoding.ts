// Geocoding utilities using Mapbox API

const MAPBOX_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN || '';
const GEOCODING_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export interface GeocodingResult {
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
  region: string;
  country: string;
  placeType: string[];
}

/**
 * Forward geocoding: Convert address/place name to coordinates
 * @param query Search query (city name, address, etc.)
 * @param proximity Optional coordinates to bias results towards
 * @returns Array of geocoding results
 */
export async function geocodeAddress(
  query: string,
  proximity?: { lat: number; lng: number }
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];
  
  // Fallback to mock data if no token available
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured, using mock geocoding');
    return getMockGeocodingResults(query);
  }
  
  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types: 'place,locality',
      limit: '5',
      language: 'en',
    });
    
    if (proximity) {
      params.append('proximity', `${proximity.lng},${proximity.lat}`);
    }
    
    const response = await fetch(
      `${GEOCODING_BASE_URL}/${encodeURIComponent(query)}.json?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      coordinates: {
        lat: feature.center[1],
        lng: feature.center[0],
      },
      address: feature.place_name,
      city: extractCity(feature),
      region: extractRegion(feature),
      country: extractCountry(feature),
      placeType: feature.place_type,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return getMockGeocodingResults(query);
  }
}

/**
 * Reverse geocoding: Convert coordinates to address
 * @param lat Latitude
 * @param lng Longitude
 * @returns Geocoding result
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured, using mock reverse geocoding');
    return getMockReverseGeocodingResult(lat, lng);
  }
  
  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types: 'place,locality',
      limit: '1',
      language: 'en',
    });
    
    const response = await fetch(
      `${GEOCODING_BASE_URL}/${lng},${lat}.json?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.features.length === 0) return null;
    
    const feature = data.features[0];
    return {
      coordinates: { lat, lng },
      address: feature.place_name,
      city: extractCity(feature),
      region: extractRegion(feature),
      country: extractCountry(feature),
      placeType: feature.place_type,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return getMockReverseGeocodingResult(lat, lng);
  }
}

// Helper functions to extract location components from Mapbox response
function extractCity(feature: any): string {
  // If the feature itself is a place, use it directly
  if (feature.place_type?.includes('place') || feature.place_type?.includes('locality')) {
    return feature.text || '';
  }
  // Otherwise look in context for the city
  const cityContext = feature.context?.find((c: any) => 
    c.id.startsWith('place.')
  );
  return cityContext?.text || feature.text || '';
}

function extractRegion(feature: any): string {
  const regionContext = feature.context?.find((c: any) => 
    c.id.startsWith('region.')
  );
  return regionContext?.text || '';
}

function extractCountry(feature: any): string {
  const countryContext = feature.context?.find((c: any) => 
    c.id.startsWith('country.')
  );
  return countryContext?.text || '';
}

// Mock implementations for development without API token
function getMockGeocodingResults(query: string): GeocodingResult[] {
  const mockLocations = [
    { city: 'Milan', region: 'Lombardy', country: 'Italy', lat: 45.4642, lng: 9.1900 },
    { city: 'Turin', region: 'Piedmont', country: 'Italy', lat: 45.0703, lng: 7.6869 },
    { city: 'Genoa', region: 'Liguria', country: 'Italy', lat: 44.4056, lng: 8.9463 },
    { city: 'Florence', region: 'Tuscany', country: 'Italy', lat: 43.7696, lng: 11.2558 },
    { city: 'Bologna', region: 'Emilia-Romagna', country: 'Italy', lat: 44.4949, lng: 11.3426 },
  ];
  
  const matches = mockLocations.filter(loc => 
    loc.city.toLowerCase().includes(query.toLowerCase()) ||
    loc.region.toLowerCase().includes(query.toLowerCase())
  );
  
  return (matches.length > 0 ? matches : mockLocations.slice(0, 3)).map(loc => ({
    coordinates: { lat: loc.lat, lng: loc.lng },
    address: `${loc.city}, ${loc.region}, ${loc.country}`,
    city: loc.city,
    region: loc.region,
    country: loc.country,
    placeType: ['place'],
  }));
}

function getMockReverseGeocodingResult(lat: number, lng: number): GeocodingResult {
  return {
    coordinates: { lat, lng },
    address: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    city: 'Unknown City',
    region: 'Unknown Region',
    country: 'Italy',
    placeType: ['place'],
  };
}
