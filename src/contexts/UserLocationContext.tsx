import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UserLocationContext as UserLocationState } from '@/types';
import { useGeolocation } from '@/hooks/useGeolocation';

interface UserLocationContextValue extends UserLocationState {
  setSearchRadius: (radius: number) => void;
  setMaxDrivingTime: (hours: number) => void;
  setPreferredRegions: (regions: string[]) => void;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
  isLoadingLocation: boolean;
  locationError: string | null;
  locationName: string | null;
}

const UserLocationContext = createContext<UserLocationContextValue | undefined>(undefined);

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const {
    currentLocation,
    locationName,
    isLoading,
    error,
    permissionGranted,
    requestLocation,
    clearLocation,
  } = useGeolocation();

  const [searchRadius, setSearchRadius] = useState<number>(100); // Default 100km
  const [maxDrivingTime, setMaxDrivingTime] = useState<number>(2); // Default 2 hours
  const [preferredRegions, setPreferredRegions] = useState<string[]>([]);

  const value: UserLocationContextValue = {
    currentLocation,
    searchRadius,
    maxDrivingTime,
    preferredRegions,
    locationPermissionGranted: permissionGranted ?? false,
    setSearchRadius,
    setMaxDrivingTime,
    setPreferredRegions,
    requestLocation,
    clearLocation,
    isLoadingLocation: isLoading,
    locationError: error?.message || null,
    locationName,
  };

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within UserLocationProvider');
  }
  return context;
}
