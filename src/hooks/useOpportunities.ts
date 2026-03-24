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
  averagePrice?: number;
}

/**
 * Calculate preview metrics from the average daily rate stored on the location.
 * Formula mirrors the backend: ADR × 30 days × 65% occupancy × 0.75 net margin.
 * ROI is left null — it requires a user-supplied budget.
 */
function calculatePreviewMetrics(averagePrice?: number): {
  estimatedMonthlyRevenue: number | null;
  estimatedROI: number | null;
  estimatedROIRange: { min: number; max: number } | null;
} {
  if (!averagePrice || averagePrice <= 0) {
    return { estimatedMonthlyRevenue: null, estimatedROI: null, estimatedROIRange: null };
  }
  const NET_MARGIN = 0.75;
  const ASSUMED_INVESTMENT = 200_000;

  // Expected monthly revenue at 65% occupancy (used for the card headline figure)
  const estimatedMonthlyRevenue = Math.round(averagePrice * 30 * 0.65 * NET_MARGIN);

  // ROI range: conservative (55% occupancy) → optimistic (75% occupancy)
  const annualRevenueMin = averagePrice * 30 * 0.55 * NET_MARGIN * 12;
  const annualRevenueMax = averagePrice * 30 * 0.75 * NET_MARGIN * 12;
  const estimatedROIRange = {
    min: Math.round((annualRevenueMin / ASSUMED_INVESTMENT) * 100 * 10) / 10,
    max: Math.round((annualRevenueMax / ASSUMED_INVESTMENT) * 100 * 10) / 10,
  };

  return { estimatedMonthlyRevenue, estimatedROI: null, estimatedROIRange };
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
    averagePrice: location.averagePrice,
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
    const previewMetrics = calculatePreviewMetrics(location.averagePrice);
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
