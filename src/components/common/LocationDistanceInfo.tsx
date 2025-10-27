import React from 'react';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { formatDistance, formatDrivingTime } from '@/lib/utils/distance';
import { cn } from '@/lib/utils/utils';

interface LocationDistanceInfoProps {
  distanceKm: number;
  drivingTimeMinutes: number;
  isWithinDayTrip: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export function LocationDistanceInfo({
  distanceKm,
  drivingTimeMinutes,
  isWithinDayTrip,
  className,
  variant = 'default',
}: LocationDistanceInfoProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 text-sm', className)}>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{formatDistance(distanceKm)}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDrivingTime(drivingTimeMinutes)}</span>
        </div>
        {isWithinDayTrip && (
          <div className="flex items-center gap-1 text-success text-xs">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Day trip</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{formatDistance(distanceKm)} away</p>
          <p className="text-xs text-muted-foreground">Direct distance</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Clock className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{formatDrivingTime(drivingTimeMinutes)} drive</p>
          <p className="text-xs text-muted-foreground">Estimated travel time</p>
        </div>
      </div>
      {isWithinDayTrip && (
        <div className="flex items-center gap-2 rounded-md bg-success/10 px-2 py-1.5">
          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
          <p className="text-xs font-medium text-success">Within day trip range</p>
        </div>
      )}
    </div>
  );
}
