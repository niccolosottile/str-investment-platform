// filepath: src/components/features/MarketAnalysis.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, PieChart } from 'lucide-react';
import type { InvestmentResults } from '@/types';

function formatEnumLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function MarketAnalysis({ results }: { results: InvestmentResults }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-metric">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Market Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Occupancy Rate</span>
              <span className="font-semibold">{`${results.occupancyRate}%`}</span>
            </div>
            <Progress value={results.occupancyRate} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm">Market Score</span>
              <span className="font-semibold">{results.marketScore}/100</span>
            </div>
            <Progress value={results.marketScore} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm">Growth Trend</span>
              <span className="font-semibold">{formatEnumLabel(results.growthTrend)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Data quality: {formatEnumLabel(results.dataQuality)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-metric">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span>Market Signals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-sm font-medium">Average Daily Rate</span>
              <div className="text-xs text-muted-foreground">Market ADR from live analysis</div>
            </div>
            <span className="inline-block rounded-md border px-2 py-1 text-xs">EUR {results.averageDailyRate}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-sm font-medium">Competition Density</span>
              <div className="text-xs text-muted-foreground">Derived from active listings in the area</div>
            </div>
            <span className="inline-block rounded-md border px-2 py-1 text-xs">{formatEnumLabel(results.competitionDensity)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-sm font-medium">Seasonality Index</span>
              <div className="text-xs text-muted-foreground">Higher values mean stronger month-to-month swings</div>
            </div>
            <span className="inline-block rounded-md border px-2 py-1 text-xs">{results.seasonalityIndex.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
