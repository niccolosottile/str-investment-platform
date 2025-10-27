import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Search, Navigation, Loader2, X } from "lucide-react";
import { useUserLocation } from "@/contexts/UserLocationContext";
import { AutocompleteDropdown } from "@/components/features/AutocompleteDropdown";
import { removeRecentSearch, saveRecentSearch } from "@/lib/utils/localStorage";
import { cn } from "@/lib/utils/utils";
import type { GeocodingResult } from "@/lib/utils/geocoding";
import type { RecentSearch } from "@/lib/utils/localStorage";

export function LocationSearchBar({
  value,
  onChange,
  onSearch,
  loading,
  autocomplete,
  recentSearches,
  onRefreshRecent,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => Promise<void> | void;
  loading?: boolean;
  autocomplete?: {
    inputValue: string;
    setInputValue: (v: string) => void;
    suggestions: GeocodingResult[];
    isLoading: boolean;
    isOpen: boolean;
    handleSelect: (result: GeocodingResult) => void;
    handleClose: () => void;
    handleOpen: () => void;
  };
  recentSearches?: RecentSearch[];
  onRefreshRecent?: () => void;
}) {
  const { 
    currentLocation, 
    locationName, 
    requestLocation, 
    isLoadingLocation,
    locationError 
  } = useUserLocation();
  
  const [showLocationButton, setShowLocationButton] = useState(!currentLocation);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRequestLocation = useCallback(async () => {
    await requestLocation();
    setShowLocationButton(false);
  }, [requestLocation]);
  
  const handleAutocompleteSelect = useCallback((result: GeocodingResult) => {
    if (autocomplete) {
      autocomplete.handleSelect(result);
      onChange(result.city);
      
      // Save to recent searches when selecting from autocomplete
      saveRecentSearch({
        query: result.city,
        city: result.city,
        country: result.country,
        coordinates: result.coordinates,
      });
      onRefreshRecent?.();
    }
  }, [autocomplete, onChange, onRefreshRecent]);
  
  const handleRecentSelect = useCallback((search: RecentSearch) => {
    onChange(search.city);
    if (autocomplete) {
      autocomplete.setInputValue(search.city);
      autocomplete.handleClose();
    }
  }, [autocomplete, onChange]);
  
  const handleRemoveRecent = useCallback((coordinates: { lat: number; lng: number }) => {
    removeRecentSearch(coordinates);
    onRefreshRecent?.();
  }, [onRefreshRecent]);

  return (
    <div className="max-w-md mx-auto space-y-3">
      <label htmlFor="location-search" className="sr-only">
        Search location
      </label>
      <Popover open={autocomplete?.isOpen} onOpenChange={(open) => {
        // Only allow closing, not opening - opening is handled by onFocus
        if (!open) {
          autocomplete?.handleClose();
        }
      }} modal={false}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" aria-hidden />
            <Input
              ref={inputRef}
              id="location-search"
              name="no_autocomplete_location"
              placeholder="Search any European city..."
              value={autocomplete?.inputValue ?? value}
              onChange={(e) => {
                const val = e.target.value;
                if (autocomplete) {
                  autocomplete.setInputValue(val);
                }
                onChange(val);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                  autocomplete?.handleClose();
                } else if (e.key === "Escape") {
                  autocomplete?.handleClose();
                }
              }}
              onFocus={() => autocomplete?.handleOpen()}
              onClick={() => {
                // Show recent searches when clicking empty/short input
                if (!autocomplete?.inputValue || autocomplete.inputValue.length < 2) {
                  autocomplete?.handleOpen();
                }
              }}
              className="pl-10 h-12 text-base pr-32"
              aria-label="Search any European city"
              aria-autocomplete="list"
              aria-controls="location-autocomplete"
              aria-expanded={autocomplete?.isOpen}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {(autocomplete?.inputValue || value) && (
              <Button
                onClick={() => {
                  if (autocomplete) {
                    autocomplete.setInputValue("");
                  }
                  onChange("");
                  inputRef.current?.focus();
                }}
                variant="ghost"
                size="sm"
                className="absolute right-24 top-2 h-8 w-8 p-0 hover:bg-muted z-10"
                aria-label="Clear search"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={() => {
                onSearch();
                autocomplete?.handleClose();
              }}
              className="absolute right-2 top-2 h-8 btn-investment px-4 z-10"
              aria-label="Analyze location"
              disabled={loading}
              type="button"
            >
              {loading || autocomplete?.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </PopoverAnchor>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          id="location-autocomplete"
          onOpenAutoFocus={(e) => {
            // Prevent the popover from stealing focus from the input
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            // Prevent closing when clicking on the input
            const target = e.target as HTMLElement;
            if (target.id === 'location-search') {
              e.preventDefault();
            }
          }}
        >
          {autocomplete && (
            <AutocompleteDropdown
              suggestions={autocomplete.suggestions}
              recentSearches={recentSearches || []}
              isLoading={autocomplete.isLoading}
              onSelect={handleAutocompleteSelect}
              onSelectRecent={handleRecentSelect}
              onRemoveRecent={handleRemoveRecent}
              inputValue={autocomplete.inputValue}
            />
          )}
        </PopoverContent>
      </Popover>

      {/* Location status or enable button */}
      {currentLocation && locationName ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Navigation className="h-4 w-4 text-primary" />
          <span>Searching near <span className="font-medium text-foreground">{locationName}</span></span>
        </div>
      ) : showLocationButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRequestLocation}
          disabled={isLoadingLocation}
          className={cn(
            "w-full gap-2",
            locationError && "border-destructive/50 text-destructive"
          )}
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Find opportunities near me
            </>
          )}
        </Button>
      )}
      
      {locationError && (
        <p className="text-xs text-center text-destructive">{locationError}</p>
      )}
    </div>
  );
}
