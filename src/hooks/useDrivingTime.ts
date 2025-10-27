import { useQuery } from '@tanstack/react-query';

interface DrivingTimeRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface DrivingTimeResponse {
  duration: number; // minutes
  distance: number; // km
  cached: boolean;
  source: 'api' | 'heuristic';
}

/**
 * Fetch real driving time from Mapbox Directions API via our server endpoint
 * No fallback - if API fails, error is thrown
 */
async function fetchDrivingTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DrivingTimeResponse> {
  const response = await fetch('/api/driving-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, destination }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Driving time API failed: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    source: 'api' as const,
  };
}

/**
 * Custom hook to fetch driving time between two locations
 * Uses React Query for caching and automatic retries
 * 
 * @param origin Starting location
 * @param destination End location
 * @param enabled Whether to fetch (default: true)
 * @returns React Query result with driving time data
 */
export function useDrivingTime(
  origin: { lat: number; lng: number } | null,
  destination: { lat: number; lng: number },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['driving-time', origin, destination],
    queryFn: () => {
      if (!origin) {
        throw new Error('Origin location is required');
      }
      return fetchDrivingTime(origin, destination);
    },
    enabled: enabled && origin !== null,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: 1, // Only retry once, then fall back to heuristic
    retryDelay: 500,
  });
}

/**
 * Batch hook to fetch driving times for multiple destinations
 * Useful for enriching multiple search results at once
 */
export function useBatchDrivingTimes(
  origin: { lat: number; lng: number } | null,
  destinations: Array<{ lat: number; lng: number }>,
  enabled: boolean = true
) {
  // Create individual queries for each destination
  // React Query will automatically batch and dedupe requests
  return destinations.map(destination =>
    useDrivingTime(origin, destination, enabled)
  );
}
