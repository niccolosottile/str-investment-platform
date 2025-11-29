import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/currency';

interface BudgetStepProps {
  investmentType: 'buy' | 'rent';
  budget: number[];
  setBudget: (v: number[]) => void;
}

export function BudgetStep({ investmentType, budget, setBudget }: BudgetStepProps) {
  const buyPresets = [100000, 200000, 300000, 500000];
  const rentPresets = [10000, 20000, 30000, 50000];

  const presets = investmentType === 'buy' ? buyPresets : rentPresets;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="metric-large">{formatCurrency(budget[0])}</div>
        <p className="text-muted-foreground">{investmentType === 'buy' ? 'Purchase Budget' : 'Available Capital'}</p>
      </div>

      <div className="space-y-6">
        <Slider
          value={budget}
          onValueChange={setBudget}
          max={investmentType === 'buy' ? 500000 : 50000}
          min={investmentType === 'buy' ? 50000 : 5000}
          step={investmentType === 'buy' ? 10000 : 1000}
          aria-label="Select budget"
          className="w-full"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presets.map((amount) => (
            <Button
              key={amount}
              variant={budget[0] === amount ? 'default' : 'outline'}
              onClick={() => setBudget([amount])}
              className="h-auto py-3"
              aria-pressed={budget[0] === amount}
            >
              <div className="text-center">
                <div className="font-semibold">{formatCurrency(amount)}</div>
                <div className="text-xs opacity-80">
                  {investmentType === 'buy'
                    ? amount <= 150000 ? 'Starter' : amount <= 300000 ? 'Standard' : 'Premium'
                    : amount <= 15000 ? 'Conservative' : amount <= 30000 ? 'Moderate' : 'Aggressive'
                  }
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
