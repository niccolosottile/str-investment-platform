import { memo } from 'react';
import { LocationSearchBar } from '@/components/features/location/LocationSearchBar';

interface LocationSelectorHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  autocomplete: any;
  recentSearches: any[];
  onRefreshRecent: () => void;
  showSearchBar: boolean;
  searchedCityName: string | null;
}

export const LocationSelectorHeader = memo(function LocationSelectorHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  loading,
  autocomplete,
  recentSearches,
  onRefreshRecent,
  showSearchBar,
  searchedCityName,
}: LocationSelectorHeaderProps) {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Find Your Next
          <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            STR Investment
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analyze short-term rental opportunities across Europe with real market data and AI-powered insights
        </p>
      </div>
      <LocationSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onSearch={onSearch}
        loading={loading}
        autocomplete={autocomplete}
        recentSearches={recentSearches}
        onRefreshRecent={onRefreshRecent}
        showSearchInput={showSearchBar}
        showLocationText={true}
        searchedCityName={searchedCityName}
      />
    </div>
  );
});
