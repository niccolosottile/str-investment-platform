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

  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured for geocoding');
    return [];
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
    return [];
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
    console.warn('Mapbox token not configured for reverse geocoding');
    return null;
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
    return null;
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
