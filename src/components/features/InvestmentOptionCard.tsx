import React, { KeyboardEvent, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/utils';

interface InvestmentOptionCardProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badges?: string[];
  selected?: boolean;
  onClick?: () => void;
}

function _InvestmentOptionCard({
  title,
  description,
  icon: Icon,
  badges = [],
  selected = false,
  onClick,
}: InvestmentOptionCardProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300',
        selected ? 'ring-2 ring-primary bg-accent/50' : 'hover:bg-accent/20'
      )}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-6 space-y-4">
        <div className="text-center space-y-3">
          {Icon ? <Icon className="h-12 w-12 text-primary mx-auto" aria-hidden="true" /> : null}
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
        </div>
        {badges.length ? (
          <div className="space-y-2">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const InvestmentOptionCard = memo(_InvestmentOptionCard);
