import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Heart, Share } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useInvestmentResults } from '@/hooks/useInvestmentResults';
import { ResultsHeader } from './ResultsHeader';
import { ResultsMetrics } from './ResultsMetrics';
import { MarketAnalysis } from './MarketAnalysis';
import { CompetitionAnalysis } from './CompetitionAnalysis';
import { SeasonalAnalysis } from './SeasonalAnalysis';
import { InvestmentBreakdown } from '@/components/features/cards/InvestmentBreakdown';
import type { InvestmentData } from '@/types';

interface ResultsDashboardProps {
  investmentData: InvestmentData;
}

export const ResultsDashboard = ({ investmentData }: ResultsDashboardProps) => {
  const [resetKey, setResetKey] = useState(0);
  const { data: results, isLoading, error, refetch } = useInvestmentResults(investmentData);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-muted-foreground">
        Loading analysis results...
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center space-y-4">
        <p className="text-destructive">Failed to load analysis results.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ResultsHeader investmentData={investmentData} results={results} />

      <ResultsMetrics results={results} />

      <ErrorBoundary onReset={() => setResetKey((k) => k + 1)}>
        <Tabs key={resetKey} defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonality</TabsTrigger>
            <TabsTrigger value="breakdown">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <MarketAnalysis results={results} />
          </TabsContent>

          <TabsContent value="competition" className="space-y-6">
            <CompetitionAnalysis results={results} />
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <SeasonalAnalysis results={results} />
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <InvestmentBreakdown investmentData={investmentData} results={results} />
          </TabsContent>
        </Tabs>
      </ErrorBoundary>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button className="btn-investment flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download Full Report</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span>Save Analysis</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Share className="h-4 w-4" />
          <span>Share Results</span>
        </Button>
      </div>
    </div>
  );
};