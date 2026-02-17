import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import type { GeocodingResult } from '@/lib/utils/geocoding';
import { apiFetch } from '@/lib/apiClient';

interface BackendLocationSearchResult {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  fullAddress: string;
}

/**
 * Fetch autocomplete suggestions from Mapbox Geocoding API
 */
async function fetchAutocompleteSuggestions(
  query: string,
  _proximity?: { lat: number; lng: number }
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  try {
    const params = new URLSearchParams({
      query,
      limit: '5',
    });

    const response = await apiFetch(`/api/locations/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Autocomplete failed: ${response.statusText}`);
    }
    
    const data: BackendLocationSearchResult[] = await response.json();
    
    return data.map((item) => ({
      coordinates: {
        lat: item.latitude,
        lng: item.longitude,
      },
      address: item.fullAddress,
      city: item.city,
      region: item.region,
      country: item.country,
      placeType: ['place'],
    }));
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

/**
 * Custom hook for location autocomplete
 * Provides debounced search with real-time suggestions
 * 
 * @param proximity Optional user location to bias results
 * @returns Autocomplete state and handlers
 */
export function useAutocomplete(proximity?: { lat: number; lng: number } | null) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Debounce the input to avoid excessive API calls
  const debouncedInput = useDebounce(inputValue, 300);
  
  // Fetch suggestions using React Query
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedInput, proximity],
    queryFn: () => fetchAutocompleteSuggestions(debouncedInput, proximity || undefined),
    enabled: debouncedInput.length >= 2 && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);
  
  const handleSelect = useCallback((result: GeocodingResult) => {
    setInputValue(result.address);
    setIsOpen(false);
  }, []);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const handleOpen = useCallback(() => {
    // Always allow opening to show recent searches
    setIsOpen(true);
  }, []);
  
  const clearInput = useCallback(() => {
    setInputValue('');
    setIsOpen(false);
  }, []);
  
  return {
    inputValue,
    setInputValue: handleInputChange,
    suggestions: suggestions || [],
    isLoading: isLoading && debouncedInput.length >= 2,
    isOpen,
    setIsOpen,
    handleSelect,
    handleClose,
    handleOpen,
    clearInput,
  };
}
