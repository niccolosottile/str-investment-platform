import { useState, useEffect, useCallback } from 'react';
import type { GeolocationError } from '@/types';
import { 
  saveUserLocation, 
  loadUserLocation, 
  saveLocationPermission, 
  loadLocationPermission,
  clearUserLocation,
  clearLocationPermission 
} from '@/lib/session';
import { reverseGeocode } from '@/lib/utils/geocoding';

interface UseGeolocationReturn {
  currentLocation: { lat: number; lng: number } | null;
  locationName: string | null;
  isLoading: boolean;
  error: GeolocationError | null;
  permissionGranted: boolean | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

/**
 * Hook to manage browser geolocation with permission handling
 * Implements LS-01 and LS-06 requirements
 */
export function useGeolocation(): UseGeolocationReturn {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(
    loadUserLocation()
  );
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    loadLocationPermission()
  );

  // Load location name from stored coordinates
  useEffect(() => {
    if (currentLocation && !locationName) {
      reverseGeocode(currentLocation.lat, currentLocation.lng)
        .then(result => {
          if (result) {
            setLocationName(result.city || result.address);
          }
        })
        .catch(err => console.warn('Failed to reverse geocode:', err));
    }
  }, [currentLocation, locationName]);

  const handleGeolocationError = useCallback((positionError: GeolocationPositionError) => {
    let errorType: GeolocationError['type'];
    let message: string;

    switch (positionError.code) {
      case positionError.PERMISSION_DENIED:
        errorType = 'permission_denied';
        message = 'Location permission denied. Please enable location access in your browser settings.';
        break;
      case positionError.POSITION_UNAVAILABLE:
        errorType = 'position_unavailable';
        message = 'Location information unavailable. Please try again.';
        break;
      case positionError.TIMEOUT:
        errorType = 'timeout';
        message = 'Location request timed out. Please try again.';
        break;
      default:
        errorType = 'position_unavailable';
        message = 'Unable to retrieve location.';
    }

    const geoError: GeolocationError = {
      code: positionError.code,
      message,
      type: errorType,
    };

    setError(geoError);
    setPermissionGranted(false);
    saveLocationPermission(false);
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser.',
        type: 'unsupported',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setCurrentLocation(location);
      setPermissionGranted(true);
      saveUserLocation(location);
      saveLocationPermission(true);

      // Fetch location name
      const result = await reverseGeocode(location.lat, location.lng);
      if (result) {
        setLocationName(result.city || result.address);
      }
    } catch (err) {
      handleGeolocationError(err as GeolocationPositionError);
    } finally {
      setIsLoading(false);
    }
  }, [handleGeolocationError]);

  const clearLocation = useCallback(() => {
    setCurrentLocation(null);
    setLocationName(null);
    setPermissionGranted(null);
    setError(null);
    clearUserLocation();
    clearLocationPermission();
  }, []);

  return {
    currentLocation,
    locationName,
    isLoading,
    error,
    permissionGranted,
    requestLocation,
    clearLocation,
  };
}
