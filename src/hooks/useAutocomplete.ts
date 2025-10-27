import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import type { GeocodingResult } from '@/lib/utils/geocoding';

const MAPBOX_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN || '';
const GEOCODING_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

/**
 * Fetch autocomplete suggestions from Mapbox Geocoding API
 */
async function fetchAutocompleteSuggestions(
  query: string,
  proximity?: { lat: number; lng: number }
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];
  
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured');
    return [];
  }
  
  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types: 'place,locality,region',
      limit: '5',
      language: 'en',
      autocomplete: 'true', // Enable autocomplete mode
    });
    
    // Bias results towards European countries
    params.append('country', 'IT,ES,FR,PT,NL,DE,AT,CH,BE,GR,PL,CZ,HU,GB,IE,DK,SE,NO,FI');
    
    if (proximity) {
      params.append('proximity', `${proximity.lng},${proximity.lat}`);
    }
    
    const response = await fetch(
      `${GEOCODING_BASE_URL}/${encodeURIComponent(query)}.json?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`Autocomplete failed: ${response.statusText}`);
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
    console.error('Autocomplete error:', error);
    return [];
  }
}

// Helper functions to extract location components
function extractCity(feature: any): string {
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
