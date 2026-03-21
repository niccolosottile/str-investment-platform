// filepath: src/components/features/SeasonalAnalysis.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { InvestmentResults } from '@/types';

function getSeasonalityLabel(index: number) {
  if (index >= 1) {
    return 'High seasonality';
  }

  if (index >= 0.5) {
    return 'Moderate seasonality';
  }

  return 'Relatively stable demand';
}

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
            <p className="text-muted-foreground">Seasonality Index: {results.seasonalityIndex.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{getSeasonalityLabel(results.seasonalityIndex)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Average Occupancy', value: `${results.occupancyRate}%` },
            { label: 'Growth Trend', value: results.growthTrend.charAt(0).toUpperCase() + results.growthTrend.slice(1) },
            { label: 'Data Quality', value: results.dataQuality.charAt(0).toUpperCase() + results.dataQuality.slice(1) },
            { label: 'Market Score', value: `${results.marketScore}/100` },
          ].map((item, index) => (
            <div key={index} className="text-center space-y-2 p-3 rounded-lg bg-muted/20">
              <div className="font-semibold">{item.label}</div>
              <div className="text-lg font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
