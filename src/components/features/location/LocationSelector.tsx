import { memo, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useUserLocation } from '@/contexts/UserLocationContext';
import { useLocationSearch } from '@/hooks/use-location-search';
import { useOpportunities } from '@/hooks/useOpportunities';
import { LocationSelectorHeader } from '@/components/features/location/LocationSelectorHeader';
import { FilterControls } from '@/components/features/location/FilterControls';
import { InteractiveLocationMap } from '@/components/features/location/InteractiveLocationMap';
import { OpportunitiesPanel } from '@/components/features/location/OpportunitiesPanel';
import { PopularLocationCard } from '@/components/features/cards/PopularLocationCard';
import { LocationPermissionPrompt } from '@/components/features/location/LocationPermissionPrompt';
import { clearResultsData, saveLocationSelectorState, loadLocationSelectorState } from '@/lib/session';
import type { Location, OpportunitiesFilters, OpportunityResult } from '@/types';
import type { OpportunityMarker } from '@/types/map';

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
}

export const LocationSelector = memo(function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const { currentLocation, requestLocation, isLoadingLocation, locationError } = useUserLocation();
  const { 
    searchQuery, 
    setSearchQuery, 
    search, 
    loading: searchLoading, 
    popularLocations, 
    autocomplete, 
    recentSearches, 
    refreshRecentSearches 
  } = useLocationSearch();
  
  // Try to restore previous state from session storage
  const savedState = loadLocationSelectorState();
  
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(
    savedState?.searchCenter || null
  );
  const [searchedCityName, setSearchedCityName] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunitiesFilters>(
    savedState?.filters || {
      radiusKm: 50,
      maxDrivingTimeMin: 120,
      devMode: false,
    }
  );
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(
    savedState?.selectedOpportunityId || null
  );
  const [mapCenterOverride, setMapCenterOverride] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // Ref for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Save state whenever it changes
  useEffect(() => {
    saveLocationSelectorState({
      searchCenter,
      filters,
      selectedOpportunityId,
    });
  }, [searchCenter, filters, selectedOpportunityId]);

  // Scroll to results when they appear
  useEffect(() => {
    if ((searchCenter || currentLocation) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchCenter, currentLocation]);

  const { data: opportunities, isLoading: opportunitiesLoading } = useOpportunities({
    origin: searchCenter || currentLocation,
    filters,
    enabled: !!(searchCenter || currentLocation),
  });

  // Convert OpportunityResult[] to OpportunityMarker[] for map
  const mapMarkers = useMemo<OpportunityMarker[]>(() => {
    if (!opportunities) return [];
    return opportunities.map(opp => ({
      id: opp.id,
      coordinates: opp.coordinates,
      city: opp.city,
      region: opp.region,
      country: opp.country,
      price: opp.previewMetrics.estimatedMonthlyRevenue,
      currency: 'EUR'
    }));
  }, [opportunities]);

  const handleSearch = useCallback(async () => {
    clearResultsData();
    const result = await search();
    if (result && result.length > 0) {
      setSearchCenter({ lat: result[0].coordinates.lat, lng: result[0].coordinates.lng });
      setSearchedCityName(result[0].city);
      setMapCenterOverride(null); // Clear override when searching
    }
  }, [search]);

  const handleOpportunitySelect = useCallback((opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    
    // Find the opportunity and fly to its location
    const opportunity = opportunities?.find(opp => opp.id === opportunityId);
    if (opportunity) {
      setMapCenterOverride({
        lat: opportunity.coordinates.lat,
        lng: opportunity.coordinates.lng,
        zoom: 9
      });
    }
  }, [opportunities]);

  const handleMarkerClick = useCallback((opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    // Map center will already be handled by InteractiveLocationMap's handleMarkerClick
  }, []);

  const handleOpportunityAnalyze = useCallback((opportunity: OpportunityResult) => {
    clearResultsData();
    onLocationSelect({
      lat: opportunity.coordinates.lat,
      lng: opportunity.coordinates.lng,
      city: opportunity.city,
      country: opportunity.country,
      address: `${opportunity.city}, ${opportunity.region}, ${opportunity.country}`,
      region: opportunity.region,
      distanceKm: opportunity.distanceKm,
      drivingTimeMin: opportunity.drivingTimeMin,
      opportunityData: opportunity, // Include full opportunity data
    });
  }, [onLocationSelect]);

  const handlePopularSelect = useCallback((loc: Location) => {
    clearResultsData();
    onLocationSelect(loc);
  }, [onLocationSelect]);

  const handleResetToUserLocation = useCallback(() => {
    setSearchCenter(null);
    setSearchedCityName(null);
    setSelectedOpportunityId(null);
    setMapCenterOverride(null);
    setSearchQuery('');
    if (autocomplete) {
      autocomplete.setInputValue('');
    }
  }, [setSearchQuery, autocomplete]);

  const hasSearchResults = !!(searchCenter || currentLocation);

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4">
      <LocationSelectorHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        loading={searchLoading}
        autocomplete={autocomplete}
        recentSearches={recentSearches}
        onRefreshRecent={refreshRecentSearches}
        showSearchBar={filters.devMode}
        searchedCityName={searchedCityName}
      />

      {!currentLocation && !searchCenter && (
        <div className="max-w-2xl mx-auto">
          <LocationPermissionPrompt
            onRequestLocation={requestLocation}
            isLoading={isLoadingLocation}
            error={locationError}
          />
        </div>
      )}

      {hasSearchResults && (
        <>
          <div ref={resultsRef}>
            <FilterControls filters={filters} onFiltersChange={setFilters} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <InteractiveLocationMap
                centerLocation={mapCenterOverride || searchCenter || currentLocation || undefined}
                opportunities={mapMarkers}
                selectedMarkerId={selectedOpportunityId}
                onMarkerClick={handleMarkerClick}
                onResetToUser={handleResetToUserLocation}
                className="h-[600px] rounded-lg overflow-hidden"
              />
            </div>
            <div className="lg:col-span-2">
              <OpportunitiesPanel
                opportunities={opportunities || []}
                selectedId={selectedOpportunityId}
                onSelect={handleOpportunitySelect}
                onAnalyze={handleOpportunityAnalyze}
                isLoading={opportunitiesLoading}
              />
            </div>
          </div>
        </>
      )}

      {!hasSearchResults && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Popular Investment Markets</h2>
            <p className="text-muted-foreground">Start with proven markets or explore new opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularLocations.map((loc, i) => (
              <PopularLocationCard key={i} item={loc} onSelect={handlePopularSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

LocationSelector.displayName = 'LocationSelector';
