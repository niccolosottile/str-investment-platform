import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationPermissionPromptProps {
  onRequestLocation: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LocationPermissionPrompt({
  onRequestLocation,
  isLoading,
  error,
}: LocationPermissionPromptProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Find Opportunities Near You</CardTitle>
            <CardDescription>
              Enable location access to discover STR investment opportunities within driving distance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>We'll show properties within 50-200km and calculate estimated drive times</p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button
          onClick={onRequestLocation}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Getting location...' : 'Enable Location Access'}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Your location is only used to show nearby opportunities and is not shared
        </p>
      </CardContent>
    </Card>
  );
}
