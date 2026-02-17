import { useState, useCallback } from "react";
import { useUserLocation } from "@/contexts/UserLocationContext";
import { apiFetch } from "@/lib/apiClient";
import { enrichLocationWithDistance } from "@/lib/utils/distance";
import { getRecentSearches, saveRecentSearch } from "@/lib/utils/localStorage";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import type { LocationSearchResult, PopularLocation } from "@/types";

interface BackendLocationSearchResult {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  fullAddress: string;
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  propertyCount?: number;
}

export function useLocationSearch() {
  const { currentLocation } = useUserLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<LocationSearchResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());

  // Initialize autocomplete hook
  const autocomplete = useAutocomplete(currentLocation);
  const popularLocations: PopularLocation[] = [];
  
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

      const params = new URLSearchParams({
        query: q,
        limit: '5',
      });

      const response = await apiFetch(`/api/locations/search?${params.toString()}`);

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(payload.message || 'Failed to search locations');
      }

      const backendResults: BackendLocationSearchResult[] = await response.json();
      
      if (backendResults.length === 0) {
        setData(null);
        return [];
      }

      // Enrich with distance
      const enrichedResults: LocationSearchResult[] = backendResults
        .map(result => {
          const distanceData = enrichLocationWithDistance(
            {
              lat: result.latitude,
              lng: result.longitude,
            },
            currentLocation
          );

          return {
            id: result.id,
            coordinates: {
              lat: result.latitude,
              lng: result.longitude,
            },
            address: result.fullAddress,
            city: result.city,
            region: result.region,
            country: result.country,
            distanceFromUser: distanceData,
            dataAvailability: result.dataQuality.toLowerCase() as 'high' | 'medium' | 'low',
            lastUpdated: new Date(),
            propertyCount: result.propertyCount,
          };
        })
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
