import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationSearch } from "@/hooks/use-location-search";
import { LocationSearchBar } from "@/components/features/LocationSearchBar";
import { PopularLocationCard } from "@/components/features/PopularLocationCard";
import { TravelTimeFilter } from "@/components/features/TravelTimeFilter";
import { LocationPermissionPrompt } from "@/components/features/LocationPermissionPrompt";
import { DataQualityBadge } from "@/components/common/DataQualityBadge";
import { LocationDistanceInfo } from "@/components/common/LocationDistanceInfo";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { clearResultsData } from '@/lib/session';
import { useUserLocation } from "@/contexts/UserLocationContext";
import type { LocationSearchResult, Location } from "@/types";

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
}

function MapPlaceholder({
  loading,
  data,
  onSelect,
}: {
  loading: boolean;
  data: LocationSearchResult[] | null;
  onSelect: (l: Location) => void;
}) {
  if (loading) {
    return (
      <Card className="card-metric">
        <CardContent className="p-8">
          <div className="rounded-lg h-96">
            <Skeleton className="h-96" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (data && data.length > 0) {
    return (
      <Card className="card-metric">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Search Results</h3>
            {data.map((loc, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="font-medium text-lg">{loc.city}</div>
                    <DataQualityBadge quality={loc.dataAvailability} />
                  </div>
                  <div className="text-sm text-muted-foreground">{loc.address}</div>
                  {loc.distanceFromUser && (
                    <LocationDistanceInfo
                      distanceKm={loc.distanceFromUser.km}
                      drivingTimeMinutes={loc.distanceFromUser.drivingTime}
                      isWithinDayTrip={loc.distanceFromUser.isWithinDayTrip}
                      variant="compact"
                    />
                  )}
                  {loc.propertyCount && (
                    <div className="text-xs text-muted-foreground">
                      ~{loc.propertyCount} properties available
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => onSelect({
                    lat: loc.coordinates.lat,
                    lng: loc.coordinates.lng,
                    city: loc.city,
                    country: loc.country,
                    address: loc.address,
                  })}
                  className="btn-investment"
                >
                  Analyze
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="card-metric">
      <CardContent className="p-8">
        <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="text-center space-y-4 relative z-10">
            <MapPin className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-foreground">Interactive Map Coming Soon</h3>
              <p className="text-muted-foreground">Click anywhere in Europe to analyze STR opportunities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const LocationSelector = memo(function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const { searchQuery, setSearchQuery, search, data, loading, error, popularLocations, autocomplete, recentSearches, refreshRecentSearches } = useLocationSearch();
  const { currentLocation, requestLocation, isLoadingLocation, locationError } = useUserLocation();
  
  const handleSearch = useCallback(async () => {
    clearResultsData();
    await search();
  }, [search]);
  
  const handleSelect = useCallback(
    (loc: Location) => {
      clearResultsData();
      onLocationSelect(loc);
    },
    [onLocationSelect],
  );
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your Next
            <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">STR Investment</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Analyze short-term rental opportunities across Europe with real market data and AI-powered insights</p>
        </div>
        <LocationSearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onSearch={handleSearch} 
          loading={loading}
          autocomplete={autocomplete}
          recentSearches={recentSearches}
          onRefreshRecent={refreshRecentSearches}
        />
      </div>

      {/* Location permission prompt if not granted */}
      {!currentLocation && (
        <div className="max-w-2xl mx-auto">
          <LocationPermissionPrompt
            onRequestLocation={requestLocation}
            isLoading={isLoadingLocation}
            error={locationError}
          />
        </div>
      )}

      {/* Travel time filter - only show if location is available */}
      {currentLocation && (
        <div className="max-w-2xl mx-auto">
          <TravelTimeFilter />
        </div>
      )}

      {error && (
        <div role="alert" className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-destructive">Something went wrong</div>
                  <div className="text-sm text-muted-foreground">{error.message}</div>
                </div>
                <Button onClick={() => { clearResultsData(); search(); }}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ErrorBoundary onReset={() => search()}>
        <MapPlaceholder loading={loading} data={data} onSelect={handleSelect} />
      </ErrorBoundary>

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {currentLocation ? 'Opportunities Near You' : 'Popular Investment Markets'}
          </h2>
          <p className="text-muted-foreground">
            {currentLocation 
              ? 'Nearby locations within your travel range' 
              : 'Start with proven markets or explore new opportunities'
            }
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularLocations.map((loc, i) => (
            <PopularLocationCard key={i} item={loc} onSelect={handleSelect} />
          ))}
        </div>
      </div>

      <div className="text-center py-12">
        <Card className="card-hero p-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ready to Start Investing?</h3>
            <p className="text-primary-foreground/80">Get detailed analysis for any European location with our AI-powered investment calculator</p>
            <Button variant="secondary" size="lg" onClick={handleSearch} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Explore Any Location
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
});

LocationSelector.displayName = "LocationSelector";