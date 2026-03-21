// filepath: src/components/features/InvestmentBreakdown.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { InvestmentData, InvestmentResults } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

export function InvestmentBreakdown({ investmentData, results }: { investmentData: InvestmentData; results: InvestmentResults }) {
  const { investmentType, budget, propertyType } = investmentData;

  return (
    <Card className="card-metric">
      <CardHeader>
        <CardTitle>Investment Summary</CardTitle>
        <CardDescription>Only values backed by the current backend analysis are shown here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Configuration</h4>
            <div className="flex justify-between text-sm">
              <span>Strategy</span>
              <span className="font-medium capitalize">{investmentType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Property Type</span>
              <span className="font-medium capitalize">{propertyType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Budget</span>
              <span className="font-medium">{formatCurrency(budget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Viability</span>
              <span className={`font-medium ${results.viableInvestment ? 'text-success' : 'text-warning'}`}>
                {results.viableInvestment ? 'Viable' : 'Needs review'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Analysis Output</h4>
            <div className="flex justify-between text-sm">
              <span>Conservative Monthly Revenue</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenueConservative)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Expected Monthly Revenue</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Optimistic Monthly Revenue</span>
              <span className="font-medium">{formatCurrency(results.monthlyRevenueOptimistic)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Revenue</span>
              <span className="font-medium">{formatCurrency(results.yearlyRevenue)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
