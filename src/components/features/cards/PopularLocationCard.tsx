import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Users, DollarSign } from "lucide-react";
import { LocationDistanceInfo } from "@/components/common/LocationDistanceInfo";
import { useUserLocation } from "@/contexts/UserLocationContext";
import { enrichLocationWithDistance } from "@/lib/utils/distance";
import { PopularLocation, Location } from "@/types";

export const PopularLocationCard = memo(function PopularLocationCard({
  item,
  onSelect,
}: {
  item: PopularLocation;
  onSelect: (l: Location) => void;
}) {
  const { currentLocation } = useUserLocation();
  
  // Calculate distance info if user location is available
  const distanceInfo = currentLocation 
    ? enrichLocationWithDistance(item.location, currentLocation)
    : undefined;

  return (
    <Card
      className="card-metric cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      onClick={() => onSelect(item.location)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? onSelect(item.location) : undefined)}
      aria-label={`Analyze ${item.location.city}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <CardDescription className="text-base">{item.description}</CardDescription>
          </div>
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Distance info if available */}
        {distanceInfo && (
          <LocationDistanceInfo
            distanceKm={distanceInfo.km}
            drivingTimeMinutes={distanceInfo.drivingTime}
            isWithinDayTrip={distanceInfo.isWithinDayTrip}
            variant="compact"
            className="pb-2 border-b"
          />
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-success" />
            </div>
            <div className="text-sm font-medium text-foreground">{item.metrics.avgRevenue}</div>
            <div className="text-xs text-muted-foreground">Avg. Monthly</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm font-medium text-foreground">{item.metrics.occupancy}</div>
            <div className="text-xs text-muted-foreground">Occupancy</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-warning" />
            </div>
            <div className="text-sm font-medium text-foreground">{item.metrics.competition}</div>
            <div className="text-xs text-muted-foreground">Competition</div>
          </div>
        </div>

        <Button className="w-full btn-investment" onClick={(e) => { e.stopPropagation(); onSelect(item.location); }}>
          Analyze {item.location.city}
        </Button>
      </CardContent>
    </Card>
  );
});
PopularLocationCard.displayName = "PopularLocationCard";
