import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { useUserLocation } from '@/contexts/UserLocationContext';

const TRAVEL_TIME_OPTIONS = [
  { hours: 1, label: '1 hour' },
  { hours: 2, label: '2 hours' },
  { hours: 3, label: '3 hours' },
];

export function TravelTimeFilter() {
  const { maxDrivingTime, setMaxDrivingTime, currentLocation } = useUserLocation();

  if (!currentLocation) return null;

  return (
    <Card className="bg-accent/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-primary" />
            <span>Max Travel Time</span>
          </div>
          <div className="flex gap-2">
            {TRAVEL_TIME_OPTIONS.map(({ hours, label }) => (
              <Button
                key={hours}
                variant={maxDrivingTime === hours ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMaxDrivingTime(hours)}
                className={cn(
                  'flex-1',
                  maxDrivingTime === hours && 'bg-primary text-primary-foreground'
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
