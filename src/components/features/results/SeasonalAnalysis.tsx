// filepath: src/components/features/SeasonalAnalysis.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { InvestmentResults } from '@/types';

export function SeasonalAnalysis({ results }: { results: InvestmentResults }) {
  return (
    <Card className="card-metric">
      <CardHeader>
        <CardTitle>Seasonal Patterns</CardTitle>
        <CardDescription>Revenue and occupancy trends throughout the year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 bg-gradient-to-r from-accent/20 to-primary/10 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <BarChart3 className="h-12 w-12 text-primary mx-auto" />
            <p className="text-muted-foreground">Seasonal chart visualization</p>
            <p className="text-xs text-muted-foreground">Peak: Jun-Aug (+40%), Low: Nov-Feb (-25%)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { season: 'Spring', months: 'Mar-May', multiplier: '1.1x', color: 'success' },
            { season: 'Summer', months: 'Jun-Aug', multiplier: '1.4x', color: 'primary' },
            { season: 'Autumn', months: 'Sep-Nov', multiplier: '0.9x', color: 'warning' },
            { season: 'Winter', months: 'Dec-Feb', multiplier: '0.7x', color: 'muted' },
          ].map((season, index) => (
            <div key={index} className="text-center space-y-2 p-3 rounded-lg bg-muted/20">
              <div className="font-semibold">{season.season}</div>
              <div className="text-xs text-muted-foreground">{season.months}</div>
              <div className="text-lg font-bold">{season.multiplier}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
