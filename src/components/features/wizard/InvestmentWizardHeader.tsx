import React from 'react';
import type { Location } from '@/types';

interface InvestmentWizardHeaderProps {
  location: Location;
}

export function InvestmentWizardHeader({ location }: InvestmentWizardHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl md:text-4xl font-bold">Investment Analysis</h1>
      <p className="text-muted-foreground">
        Configure your investment parameters to get personalized insights
      </p>
    </div>
  );
}
