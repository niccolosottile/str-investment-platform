// filepath: src/components/features/ResultsHeader.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/currency';
import type { InvestmentData, InvestmentResults } from '@/types';

function getConfidenceVariant(confidence: InvestmentResults['confidence']) {
  return confidence === 'high' ? 'default' : confidence === 'medium' ? 'secondary' : 'destructive';
}

export function ResultsHeader({ investmentData, results }: { investmentData: InvestmentData; results: InvestmentResults }) {
  const { location, propertyType, budget, investmentType } = investmentData;

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{location.city}, {location.country}</span>
        <span>•</span>
        <span className="capitalize">{propertyType}</span>
        <span>•</span>
        <span>{formatCurrency(budget)}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold">Investment Analysis Results</h1>

      <div className="flex items-center justify-center space-x-2">
        <Badge variant={getConfidenceVariant(results.confidence)} className="capitalize">
          {results.confidence} Confidence
        </Badge>
        <Badge variant="outline">{investmentType === 'buy' ? 'Purchase' : 'Rental'} Strategy</Badge>
      </div>
    </div>
  );
}
