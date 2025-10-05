import React from 'react';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';
import { InvestmentOptionCard } from './InvestmentOptionCard';

interface Props {
  goals: 'max-roi' | 'stable-income' | 'quick-payback';
  setGoals: (g: 'max-roi' | 'stable-income' | 'quick-payback') => void;
}

export function GoalsStep({ goals, setGoals }: Props) {
  const options = [
    {
      goal: 'max-roi' as const,
      icon: TrendingUp,
      title: 'Maximum ROI',
      description: 'Optimize for highest return on investment',
      features: ['Aggressive pricing', 'Peak season focus', 'Premium properties'],
    },
    {
      goal: 'stable-income' as const,
      icon: DollarSign,
      title: 'Stable Income',
      description: 'Consistent monthly revenue with lower risk',
      features: ['Competitive pricing', 'Year-round demand', 'Reliable bookings'],
    },
    {
      goal: 'quick-payback' as const,
      icon: Clock,
      title: 'Quick Payback',
      description: 'Fastest return of initial investment',
      features: ['High turnover', 'Lower investment', 'Rapid scaling'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map(({ goal, icon: Icon, title, description, features }) => (
        <InvestmentOptionCard
          key={goal}
          title={title}
          description={description}
          icon={Icon}
          badges={features}
          selected={goals === goal}
          onClick={() => setGoals(goal)}
        />
      ))}
    </div>
  );
}
