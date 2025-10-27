import { useState, useCallback } from "react";
import { useUserLocation } from "@/contexts/UserLocationContext";
import { geocodeAddress } from "@/lib/utils/geocoding";
import { enrichLocationWithDistance } from "@/lib/utils/distance";
import { getRecentSearches, saveRecentSearch } from "@/lib/utils/localStorage";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useDrivingTime } from "@/hooks/useDrivingTime";
import type { LocationSearchResult, PopularLocation } from "@/types";

const allEuropeanLocations: PopularLocation[] = [
  {
    name: "Barcelona, Spain",
    description: "High tourist demand, year-round season",
    metrics: { avgRevenue: "€2,400", occupancy: "82%", competition: "High" },
    location: { lat: 41.3851, lng: 2.1734, city: "Barcelona", country: "Spain", address: "Barcelona, Spain" },
  },
  {
    name: "Rome, Italy",
    description: "Historic center, premium pricing",
    metrics: { avgRevenue: "€2,800", occupancy: "75%", competition: "Medium" },
    location: { lat: 41.9028, lng: 12.4964, city: "Rome", country: "Italy", address: "Rome, Italy" },
  },
  {
    name: "Lisbon, Portugal",
    description: "Growing market, digital nomads",
    metrics: { avgRevenue: "€1,900", occupancy: "88%", competition: "Medium" },
    location: { lat: 38.7223, lng: -9.1393, city: "Lisbon", country: "Portugal", address: "Lisbon, Portugal" },
  },
  {
    name: "Amsterdam, Netherlands",
    description: "High-value market, strict regulations",
    metrics: { avgRevenue: "€3,200", occupancy: "69%", competition: "Very High" },
    location: { lat: 52.3676, lng: 4.9041, city: "Amsterdam", country: "Netherlands", address: "Amsterdam, Netherlands" },
  },
  ];

export function useLocationSearch() {
  const { currentLocation, searchRadius, maxDrivingTime } = useUserLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<LocationSearchResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());

  // Initialize autocomplete hook
  const autocomplete = useAutocomplete(currentLocation);
  const popularLocations = getNearbyLocations(currentLocation, searchRadius);
  
  // Refresh recent searches when component mounts or after search
  const refreshRecentSearches = useCallback(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Search with geocoding and distance enrichment
  const search = async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const q = query ?? searchQuery;

      if (!q || !q.trim()) {
        setData(null);
        return [];
      }

      // Use geocoding API
      const geocodingResults = await geocodeAddress(q, currentLocation || undefined);
      
      if (geocodingResults.length === 0) {
        setData(null);
        return [];
      }

      // Enrich with distance and filter by radius
      const enrichedResults: LocationSearchResult[] = geocodingResults
        .map(result => {
          const distanceData = enrichLocationWithDistance(
            result.coordinates,
            currentLocation
          );

          return {
            coordinates: result.coordinates,
            address: result.address,
            city: result.city,
            region: result.region,
            country: result.country,
            distanceFromUser: distanceData,
            dataAvailability: getDataAvailability(result.city),
            lastUpdated: new Date(),
            propertyCount: Math.floor(Math.random() * 500) + 50, // Mock data
          };
        })
        // Temporarily disabled - allow searching any location regardless of distance
        // .filter(result => {
        //   // Filter by search radius if user location available
        //   if (currentLocation && result.distanceFromUser) {
        //     return result.distanceFromUser.km <= searchRadius;
        //   }
        //   return true; // Show all if no user location
        // })
        // Temporarily disabled - allow searching any location regardless of travel time
        // .filter(result => {
        //   // Filter by max driving time
        //   if (currentLocation && result.distanceFromUser) {
        //     return result.distanceFromUser.drivingTime <= maxDrivingTime * 60;
        //   }
        //   return true;
        // })
        .sort((a, b) => {
          // Sort by distance if available
          if (a.distanceFromUser && b.distanceFromUser) {
            return a.distanceFromUser.km - b.distanceFromUser.km;
          }
          return 0;
        });

      // Save first result to recent searches if available
      if (enrichedResults.length > 0) {
        const topResult = enrichedResults[0];
        saveRecentSearch({
          query: q,
          city: topResult.city,
          country: topResult.country,
          coordinates: topResult.coordinates,
        });
        refreshRecentSearches();
      }

      setData(enrichedResults.length > 0 ? enrichedResults : null);
      return enrichedResults;
    } catch (err) {
      setError(err as Error);
      return [] as LocationSearchResult[];
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    search,
    data,
    loading,
    error,
    popularLocations,
    autocomplete,
    recentSearches,
    refreshRecentSearches,
  } as const;
}

// Get nearby locations based on user position
function getNearbyLocations(
  userLocation: { lat: number; lng: number } | null,
  radius: number
): PopularLocation[] {
  if (!userLocation) {
    // Return default popular locations if no user location
    return allEuropeanLocations.slice(0, 4);
  }

  // Calculate distances and filter by radius
  const locationsWithDistance = allEuropeanLocations
    .map(loc => {
      const distance = enrichLocationWithDistance(loc.location, userLocation);
      return { ...loc, distance };
    })
    .filter(loc => loc.distance && loc.distance.km <= radius)
    .sort((a, b) => (a.distance?.km || 0) - (b.distance?.km || 0));

  // Return top 4 nearest locations, or fallback to default if none nearby
  return locationsWithDistance.length > 0
    ? locationsWithDistance.slice(0, 4)
    : allEuropeanLocations.slice(0, 4);
}

// Mock data availability indicator
function getDataAvailability(city: string): 'high' | 'medium' | 'low' {
  const highDataCities = ['Barcelona', 'Rome', 'Lisbon', 'Amsterdam', 'Milan', 'Florence'];
  const mediumDataCities = ['Porto', 'Valencia', 'Bologna', 'Turin'];
  
  if (highDataCities.some(c => city.includes(c))) return 'high';
  if (mediumDataCities.some(c => city.includes(c))) return 'medium';
  return 'low';
}
