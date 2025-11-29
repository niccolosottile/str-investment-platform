import { memo } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface UserLocationMarkerProps {
  latitude: number;
  longitude: number;
}

export const UserLocationMarker = memo(function UserLocationMarker({
  latitude,
  longitude
}: UserLocationMarkerProps) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-8 w-8 rounded-full bg-blue-500 opacity-20 animate-ping" />
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg border-2 border-white">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </Marker>
  );
});

interface OpportunityMarkerProps {
  latitude: number;
  longitude: number;
  price?: number;
  currency?: string;
  isHovered?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export const OpportunityMarkerComponent = memo(function OpportunityMarkerComponent({
  latitude,
  longitude,
  price,
  currency = 'EUR',
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave
}: OpportunityMarkerProps) {
  const formattedPrice = price
    ? new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    : null;

  return (
    <Marker latitude={latitude} longitude={longitude} anchor="bottom">
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          'flex flex-col items-center transition-transform duration-200 hover:scale-110',
          (isHovered || isSelected) && 'scale-110 z-50'
        )}
        aria-label={`View opportunity at ${latitude}, ${longitude}`}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full shadow-lg transition-all duration-200',
            isSelected
              ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
              : isHovered
              ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
              : 'bg-white text-primary border-2 border-primary'
          )}
        >
          {formattedPrice ? (
            <div className="px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
              {formattedPrice}
            </div>
          ) : (
            <div className="p-2">
              <MapPin className="h-4 w-4" />
            </div>
          )}
        </div>
        <div 
          className={cn(
            'w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]',
            isSelected ? 'border-t-primary' : 'border-t-primary'
          )}
        />
      </button>
    </Marker>
  );
});
