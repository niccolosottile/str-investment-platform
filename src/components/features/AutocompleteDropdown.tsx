import React, { memo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import type { GeocodingResult } from '@/lib/utils/geocoding';
import type { RecentSearch } from '@/lib/utils/localStorage';
import { Button } from '@/components/ui/button';

interface AutocompleteDropdownProps {
  suggestions: GeocodingResult[];
  recentSearches: RecentSearch[];
  isLoading: boolean;
  onSelect: (result: GeocodingResult) => void;
  onSelectRecent: (search: RecentSearch) => void;
  onRemoveRecent: (coordinates: { lat: number; lng: number }) => void;
  inputValue: string;
}

export const AutocompleteDropdown = memo(function AutocompleteDropdown({
  suggestions,
  recentSearches,
  isLoading,
  onSelect,
  onSelectRecent,
  onRemoveRecent,
  inputValue,
}: AutocompleteDropdownProps) {
  const showRecentSearches = inputValue.length < 2;
  const hasResults = suggestions.length > 0 || (showRecentSearches && recentSearches.length > 0);
  
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandList>
        {isLoading && (
          <CommandEmpty>Loading suggestions...</CommandEmpty>
        )}
        
        {!isLoading && !hasResults && inputValue.length >= 2 && (
          <CommandEmpty>No locations found</CommandEmpty>
        )}
        
        {/* Recent Searches */}
        {showRecentSearches && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((search, index) => (
              <CommandItem
                key={`recent-${index}`}
                value={search.query}
                onSelect={() => onSelectRecent(search)}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{search.city}</span>
                    <span className="text-xs text-muted-foreground">{search.country}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(search.coordinates);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  <span className="sr-only">Remove from recent searches</span>
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {/* Autocomplete Suggestions */}
        {!showRecentSearches && suggestions.length > 0 && (
          <CommandGroup heading="Suggestions">
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={`suggestion-${index}`}
                value={suggestion.address}
                onSelect={() => onSelect(suggestion)}
                className="flex items-start gap-2 cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {highlightMatch(suggestion.city, inputValue)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.region && `${suggestion.region}, `}
                    {suggestion.country}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
});

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  
  return (
    <>
      {text.substring(0, index)}
      <span className="font-semibold text-primary">
        {text.substring(index, index + query.length)}
      </span>
      {text.substring(index + query.length)}
    </>
  );
}
