import { useQuery } from '@tanstack/react-query';
import { calculateDistance } from '@/lib/utils/distance';
import type { 
  OpportunityResult, 
  NearbyLocation, 
  OpportunitiesFilters, 
  UseOpportunitiesOptions 
} from '@/types';

/**
 * Calculate preview metrics for an opportunity based on city and property type
 */
function calculatePreviewMetrics(city: string): {
  estimatedMonthlyRevenue: number;
  estimatedROI: number;
} {
  const baseRevenue = 2000; // Base €2000/month
  
  // Location multipliers from spec
  const locationMultipliers: Record<string, number> = {
    'Rome': 1.3,
    'Barcelona': 1.2,
    'Amsterdam': 1.4,
    'Paris': 1.5,
    'Milan': 1.1,
    'Lisbon': 1.0,
  };
  
  // Default multiplier for unlisted cities
  const locationMultiplier = locationMultipliers[city] || 1.0;
  
  // Use average property type multiplier (apartment = 1)
  const propertyMultiplier = 1;
  
  const monthlyRevenue = baseRevenue * locationMultiplier * propertyMultiplier;
  
  // Estimate ROI based on typical investment (€200k for purchase)
  const typicalInvestment = 200000;
  const annualRevenue = monthlyRevenue * 12 * 0.5; // 50% after costs
  const roi = (annualRevenue / typicalInvestment) * 100;
  
  return {
    estimatedMonthlyRevenue: Math.round(monthlyRevenue),
    estimatedROI: Math.round(roi * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Fetch nearby locations from the API
 */
async function fetchNearbyLocations(
  origin: { lat: number; lng: number },
  radiusKm: number
): Promise<NearbyLocation[]> {
  const params = new URLSearchParams({
    lat: origin.lat.toString(),
    lng: origin.lng.toString(),
    radius: radiusKm.toString(),
  });

  const response = await fetch(`/api/locations/nearby?${params}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to fetch nearby locations: ${error.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.locations || [];
}

/**
 * Fetch driving time for a single location
 */
async function fetchDrivingTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ duration: number; distance: number }> {
  const response = await fetch('/api/driving-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, destination }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch driving time');
  }

  return response.json();
}

/**
 * Enrich locations with driving time data and preview metrics
 */
async function enrichLocations(
  locations: NearbyLocation[],
  origin: { lat: number; lng: number },
  maxDrivingTimeMin: number,
  devMode: boolean
): Promise<OpportunityResult[]> {
  // Batch fetch driving times in parallel
  const drivingTimePromises = locations.map(async (location) => {
    try {
      const drivingData = await fetchDrivingTime(origin, location.coordinates);
      return {
        location,
        drivingTimeMin: drivingData.duration,
        distanceKm: drivingData.distance,
      };
    } catch (error) {
      // Fallback to distance calculation if driving time fails
      const distance = calculateDistance(
        origin.lat,
        origin.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );
      
      return {
        location,
        drivingTimeMin: Math.round(distance / 60 * 60), // Rough estimate: 60 km/h avg
        distanceKm: Math.round(distance * 10) / 10,
      };
    }
  });

  const enrichedLocations = await Promise.all(drivingTimePromises);

  // Filter by driving time (unless devMode)
  const filteredLocations = devMode
    ? enrichedLocations
    : enrichedLocations.filter(loc => loc.drivingTimeMin <= maxDrivingTimeMin);

  // Map to OpportunityResult with preview metrics
  return filteredLocations.map(({ location, drivingTimeMin, distanceKm }) => {
    const previewMetrics = calculatePreviewMetrics(location.city);
    
    // Determine data availability (simplified for now)
    const dataAvailability: 'high' | 'medium' | 'low' = 
      ['Rome', 'Barcelona', 'Amsterdam', 'Paris', 'Milan', 'Lisbon'].includes(location.city)
        ? 'high'
        : 'medium';

    return {
      id: location.id,
      coordinates: location.coordinates,
      city: location.city,
      region: '', // Not provided by API yet
      country: location.country,
      distanceKm,
      drivingTimeMin,
      previewMetrics,
      dataAvailability,
      lastUpdated: new Date(),
    };
  });
}

/**
 * Custom hook to fetch and enrich nearby opportunities
 * 
 * @param options Origin location and filters
 * @returns Opportunities data with loading/error states
 */
export function useOpportunities({
  origin,
  filters = {},
  enabled = true,
}: UseOpportunitiesOptions) {
  const {
    radiusKm = 100,
    maxDrivingTimeMin = 120, // 2 hours default
    devMode = false,
  } = filters;

  return useQuery({
    queryKey: ['opportunities', origin, radiusKm, maxDrivingTimeMin, devMode],
    queryFn: async () => {
      if (!origin) {
        throw new Error('Origin location is required');
      }

      // Fetch nearby locations
      const locations = await fetchNearbyLocations(origin, radiusKm);

      // Enrich with driving times and metrics
      const opportunities = await enrichLocations(
        locations,
        origin,
        maxDrivingTimeMin,
        devMode
      );

      return opportunities;
    },
    enabled: enabled && origin !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
}
