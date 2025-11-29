// filepath: src/components/features/CompetitionAnalysis.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, CheckCircle } from 'lucide-react';
import type { InvestmentResults } from '@/types';

export function CompetitionAnalysis({ results }: { results: InvestmentResults }) {
  return (
    <Card className="card-metric">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Competition Analysis</span>
        </CardTitle>
        <CardDescription>Analysis of {results.competitorCount} similar properties within 2km radius</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">{results.competitorCount}</div>
            <div className="text-xs text-muted-foreground">Total Competitors</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-warning">€1,950</div>
            <div className="text-xs text-muted-foreground">Avg. Price</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-success">4.3★</div>
            <div className="text-xs text-muted-foreground">Avg. Rating</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{'72%'}</div>
            <div className="text-xs text-muted-foreground">Avg. Occupancy</div>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <h4 className="font-semibold">Competitive Advantages</h4>
          {[
            'Premium pricing justified by location',
            'Higher occupancy rate potential',
            'Modern amenities gap in market',
            'Better guest experience opportunity',
          ].map((advantage, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">{advantage}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
