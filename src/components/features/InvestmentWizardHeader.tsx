import React from 'react';
import { MapPin } from 'lucide-react';
import type { Location } from '@/types';

export function InvestmentWizardHeader({ location }: { location: Location }) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{location.city}, {location.country}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">Investment Analysis</h1>
      <p className="text-muted-foreground">Let's configure your investment parameters</p>
    </div>
  );
}
