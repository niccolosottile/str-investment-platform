import { useQuery } from '@tanstack/react-query';
import { calculateDistance, estimateDrivingTime } from '@/lib/utils/distance';
import { apiFetch } from '@/lib/apiClient';
import type { 
  OpportunityResult, 
  NearbyLocation, 
  OpportunitiesFilters, 
  UseOpportunitiesOptions 
} from '@/types';

interface BackendLocationResponse {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  propertyCount?: number;
}

/**
 * Calculate preview metrics for an opportunity based on city and property type
 */
function calculatePreviewMetrics(propertyCount?: number): {
  estimatedMonthlyRevenue: number | null;
  estimatedROI: number | null;
} {
  return {
    estimatedMonthlyRevenue: null,
    estimatedROI: null,
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

  const response = await apiFetch(`/api/locations/nearby?${params}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to fetch nearby locations: ${error.message || response.statusText}`);
  }
  
  const data: BackendLocationResponse[] = await response.json();

  return data.map((location) => ({
    id: location.id,
    city: location.city,
    region: location.region,
    country: location.country,
    coordinates: {
      lat: location.latitude,
      lng: location.longitude,
    },
    dataQuality: location.dataQuality.toLowerCase() as 'high' | 'medium' | 'low',
    propertyCount: location.propertyCount,
  }));
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
  // Use local heuristics for browse-time opportunity previews.
  // Exact routing can be fetched later for a specific destination when needed.
  const enrichedLocations = locations.map((location) => {
    const distance = calculateDistance(
      origin.lat,
      origin.lng,
      location.coordinates.lat,
      location.coordinates.lng
    );

    return {
      location,
      drivingTimeMin: estimateDrivingTime(distance),
      distanceKm: Math.round(distance * 10) / 10,
    };
  });

  // Filter by driving time (unless devMode)
  const filteredLocations = devMode
    ? enrichedLocations
    : enrichedLocations.filter(loc => loc.drivingTimeMin <= maxDrivingTimeMin);

  // Map to OpportunityResult with preview metrics
  return filteredLocations.map(({ location, drivingTimeMin, distanceKm }) => {
    const previewMetrics = calculatePreviewMetrics(location.propertyCount);
    const dataAvailability = location.dataQuality;

    return {
      id: location.id,
      coordinates: location.coordinates,
      city: location.city,
      region: location.region,
      country: location.country,
      distanceKm,
      drivingTimeMin,
      previewMetrics,
      dataAvailability,
      lastUpdated: new Date(),
      propertyCount: location.propertyCount,
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
