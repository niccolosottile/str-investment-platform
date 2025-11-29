// Distance calculation utilities for location-based features

/**
 * Calculate the great-circle distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate driving time based on distance
 * Uses average speed heuristic: 60 km/h in rural areas, 40 km/h in urban
 * NOTE: This is a fallback. Use useDrivingTime hook for real API-based times
 * @param distanceKm Distance in kilometers
 * @returns Estimated driving time in minutes
 */
export function estimateDrivingTime(distanceKm: number): number {
  // Simple heuristic: average 50 km/h (accounting for traffic, stops, etc.)
  const averageSpeedKmh = 50;
  return Math.round((distanceKm / averageSpeedKmh) * 60);
}

/**
 * Check if a location is within a day trip range (max 4 hours one way)
 * @param drivingTimeMinutes Estimated driving time in minutes
 * @returns Boolean indicating if it's within day trip range
 */
export function isWithinDayTrip(drivingTimeMinutes: number): boolean {
  return drivingTimeMinutes <= 240; // 4 hours = 240 minutes
}

/**
 * Format distance for display
 * @param km Distance in kilometers
 * @returns Formatted string (e.g., "12 km" or "1.5 km")
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Format driving time for display
 * @param minutes Driving time in minutes
 * @returns Formatted string (e.g., "1h 30min" or "45min")
 */
export function formatDrivingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance from user and attach metadata
 */
export function enrichLocationWithDistance(
  location: { lat: number; lng: number },
  userLocation: { lat: number; lng: number } | null
): {
  km: number;
  drivingTime: number;
  isWithinDayTrip: boolean;
} | undefined {
  if (!userLocation) return undefined;
  
  const km = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    location.lat,
    location.lng
  );
  
  const drivingTime = estimateDrivingTime(km);
  
  return {
    km,
    drivingTime,
    isWithinDayTrip: isWithinDayTrip(drivingTime),
  };
}
