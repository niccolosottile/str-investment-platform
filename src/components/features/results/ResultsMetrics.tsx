// filepath: src/components/features/ResultsMetrics.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { InvestmentResults, InvestmentData } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

export function ResultsMetrics({ investmentData, results }: { investmentData: InvestmentData; results: InvestmentResults }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="card-metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expected Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="metric-large mb-2">{formatCurrency(results.monthlyRevenue)}</div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-success font-medium">+12.5%</span>
            <span className="text-muted-foreground">vs market avg</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Conservative</span>
              <span>Optimistic</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(Math.round(results.monthlyRevenue * 0.8))} - {formatCurrency(Math.round(results.monthlyRevenue * 1.3))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual ROI</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="metric-large mb-2">{`${results.roi}%`}</div>
          <div className="flex items-center space-x-1 text-sm">
            {results.roi > 15 ? (
              <>
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-success font-medium">Excellent</span>
              </>
            ) : results.roi > 8 ? (
              <>
                <Clock className="h-3 w-3 text-warning" />
                <span className="text-warning font-medium">Good</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-destructive font-medium">Consider alternatives</span>
              </>
            )}
          </div>
          <div className="mt-3">
            <Progress value={Math.min(results.roi * 2, 100)} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">Target: 12-20% for STR investments</div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="metric-large mb-2">{Math.floor(results.paybackMonths / 12)}y {results.paybackMonths % 12}m</div>
          <div className="flex items-center space-x-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{results.paybackMonths < 60 ? 'Fast recovery' : 'Long-term investment'}</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-xs text-muted-foreground">Monthly cash flow: {formatCurrency(Math.round(results.monthlyRevenue * 0.7))}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
