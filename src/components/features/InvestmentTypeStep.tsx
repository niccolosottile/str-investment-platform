import React from 'react';
import { ShoppingCart, Key } from 'lucide-react';
import { InvestmentOptionCard } from './InvestmentOptionCard';

interface Props {
  investmentType: 'buy' | 'rent';
  setInvestmentType: (t: 'buy' | 'rent') => void;
}

export function InvestmentTypeStep({ investmentType, setInvestmentType }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InvestmentOptionCard
        title="Buy Property"
        description="Purchase a property and rent it out on Airbnb"
        icon={ShoppingCart}
        badges={["Higher Returns", "Long-term Investment"]}
        selected={investmentType === 'buy'}
        onClick={() => setInvestmentType('buy')}
      />

      <InvestmentOptionCard
        title="Rent & Sublet"
        description="Rent a property and sublet it on Airbnb"
        icon={Key}
        badges={["Lower Risk", "Quick Start"]}
        selected={investmentType === 'rent'}
        onClick={() => setInvestmentType('rent')}
      />
    </div>
  );
}
