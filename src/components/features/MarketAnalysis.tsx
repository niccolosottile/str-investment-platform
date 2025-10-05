// filepath: src/components/features/MarketAnalysis.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, PieChart } from 'lucide-react';
import type { InvestmentResults } from '@/types';

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
              <span className="text-sm">Price Growth (YoY)</span>
              <span className="font-semibold text-success">+8.2%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-metric">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span>Revenue Factors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { factor: 'Location Quality', impact: 35, score: 'High' },
            { factor: 'Property Type', impact: 25, score: 'Good' },
            { factor: 'Market Demand', impact: 20, score: 'High' },
            { factor: 'Competition Level', impact: 15, score: 'Medium' },
            { factor: 'Seasonality', impact: 5, score: 'Low Risk' },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-sm font-medium">{item.factor}</span>
                <div className="text-xs text-muted-foreground">{item.impact}% impact</div>
              </div>
              <div className="text-xs">
                <span className="inline-block rounded-md border px-2 py-1 text-xs">{item.score}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
