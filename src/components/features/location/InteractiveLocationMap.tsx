import { useState, useCallback, useRef, useEffect, memo } from 'react';
import Map, { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils/utils';
import { useUserLocation } from '@/contexts/UserLocationContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { UserLocationMarker, OpportunityMarkerComponent } from './MapMarkers';
import { MapTooltip } from './MapTooltip';
import { MapControls } from './MapControls';
import type { OpportunityMarker, MapViewport } from '@/types/map';

const MAPBOX_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN || '';
const DEFAULT_VIEWPORT: MapViewport = { latitude: 50, longitude: 10, zoom: 4 };
const FLY_TO_DURATION = 1000; // ms
const DEFAULT_LOCATION_ZOOM = 9;

interface InteractiveLocationMapProps {
  opportunities: OpportunityMarker[];
  onMarkerClick: (opportunityId: string) => void;
  selectedMarkerId?: string | null;
  centerLocation?: { lat: number; lng: number; zoom?: number };
  onResetToUser?: () => void;
  className?: string;
}

export const InteractiveLocationMap = memo(function InteractiveLocationMap({
  opportunities,
  onMarkerClick,
  selectedMarkerId,
  centerLocation,
  onResetToUser,
  className
}: InteractiveLocationMapProps) {
  const { currentLocation } = useUserLocation();
  const isMobile = useIsMobile();
  const mapRef = useRef<MapRef>(null);
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    x: number;
    y: number;
    content: { city: string; price?: number; currency?: string };
  } | null>(null);

  const initialViewport: MapViewport = currentLocation
    ? { latitude: currentLocation.lat, longitude: currentLocation.lng, zoom: DEFAULT_LOCATION_ZOOM }
    : DEFAULT_VIEWPORT;

  const [viewport, setViewport] = useState<MapViewport>(initialViewport);

  // Center map when centerLocation changes
  useEffect(() => {
    if (centerLocation && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [centerLocation.lng, centerLocation.lat],
        zoom: centerLocation.zoom || DEFAULT_LOCATION_ZOOM,
        duration: FLY_TO_DURATION,
        essential: true
      });
    }
  }, [centerLocation, isMapLoaded]);

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn({ duration: 300 });
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut({ duration: 300 });
    }
  }, []);

  const handleResetToUser = useCallback(() => {
    if (currentLocation && mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [currentLocation.lng, currentLocation.lat],
        zoom: DEFAULT_LOCATION_ZOOM,
        duration: FLY_TO_DURATION,
        essential: true
      });
      // Notify parent to reset search center
      onResetToUser?.();
    }
  }, [currentLocation, isMapLoaded, onResetToUser]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleMarkerClick = useCallback((opportunityId: string, opportunity: OpportunityMarker) => {
    onMarkerClick(opportunityId);
    
    // Smoothly center map on clicked marker
    if (mapRef.current && isMapLoaded) {
      mapRef.current.flyTo({
        center: [opportunity.coordinates.lng, opportunity.coordinates.lat],
        zoom: Math.max(viewport.zoom, 9),
        duration: FLY_TO_DURATION,
        essential: true
      });
    }
  }, [onMarkerClick, isMapLoaded, viewport.zoom]);

  const handleMarkerHover = useCallback((
    opportunityId: string,
    opportunity: OpportunityMarker,
    event: React.MouseEvent
  ) => {
    setHoveredMarkerId(opportunityId);
    setTooltipInfo({
      x: event.clientX,
      y: event.clientY,
      content: {
        city: opportunity.city,
        price: opportunity.price,
        currency: opportunity.currency
      }
    });
  }, []);

  const handleMarkerLeave = useCallback(() => {
    setHoveredMarkerId(null);
    setTooltipInfo(null);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={cn('flex items-center justify-center bg-muted rounded-lg', className)}>
        <p className="text-sm text-muted-foreground">
          Mapbox token not configured. Set VITE_PUBLIC_MAPBOX_TOKEN.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden rounded-lg', className)}>
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      <Map
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onLoad={() => setIsMapLoaded(true)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {currentLocation && (
          <UserLocationMarker
            latitude={currentLocation.lat}
            longitude={currentLocation.lng}
          />
        )}

        {opportunities.map((opportunity) => (
          <OpportunityMarkerComponent
            key={opportunity.id}
            latitude={opportunity.coordinates.lat}
            longitude={opportunity.coordinates.lng}
            price={opportunity.price}
            currency={opportunity.currency}
            isHovered={hoveredMarkerId === opportunity.id}
            isSelected={selectedMarkerId === opportunity.id}
            onClick={() => handleMarkerClick(opportunity.id, opportunity)}
            onMouseEnter={(e) => handleMarkerHover(opportunity.id, opportunity, e)}
            onMouseLeave={handleMarkerLeave}
          />
        ))}
      </Map>

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetToUser={handleResetToUser}
        onToggleFullscreen={isMobile ? handleToggleFullscreen : undefined}
        isFullscreen={isFullscreen}
        hasUserLocation={!!currentLocation}
        isMobile={isMobile}
      />

      {/* Tooltip */}
      {tooltipInfo && <MapTooltip {...tooltipInfo} />}
    </div>
  );
});
