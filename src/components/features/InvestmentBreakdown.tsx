// filepath: src/components/features/InvestmentBreakdown.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { InvestmentData, InvestmentResults } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

export function InvestmentBreakdown({ investmentData, results }: { investmentData: InvestmentData; results: InvestmentResults }) {
  const { investmentType, budget } = investmentData;

  const initialItems = investmentType === 'buy'
    ? [
      { item: 'Property Purchase', amount: budget * 0.85, percentage: 85 },
      { item: 'Renovation & Setup', amount: budget * 0.10, percentage: 10 },
      { item: 'Legal & Fees', amount: budget * 0.05, percentage: 5 },
    ]
    : [
      { item: 'Security Deposit', amount: budget * 0.30, percentage: 30 },
      { item: 'Setup & Furnishing', amount: budget * 0.50, percentage: 50 },
      { item: 'Marketing & Legal', amount: budget * 0.20, percentage: 20 },
    ];

  const monthlyCosts = [
    { item: 'Cleaning & Maintenance', amount: results.monthlyRevenue * 0.15 },
    { item: 'Platform Fees', amount: results.monthlyRevenue * 0.12 },
    { item: 'Utilities & Insurance', amount: results.monthlyRevenue * 0.08 },
    { item: 'Management', amount: results.monthlyRevenue * 0.05 },
  ];

  return (
    <Card className="card-metric">
      <CardHeader>
        <CardTitle>Investment Breakdown</CardTitle>
        <CardDescription>Detailed cost analysis and projections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Initial Investment</h4>
            {initialItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.item}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
                <Progress value={item.percentage} className="h-1" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Monthly Operating Costs</h4>
            {monthlyCosts.map((cost, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{cost.item}</span>
                <span className="font-medium">{formatCurrency(cost.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Net Monthly Profit</span>
                <span className="text-success">{formatCurrency(results.monthlyRevenue * 0.6)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
