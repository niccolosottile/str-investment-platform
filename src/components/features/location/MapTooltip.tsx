import { memo } from 'react';
import { cn } from '@/lib/utils/utils';

interface MapTooltipProps {
  x: number;
  y: number;
  content: {
    city: string;
    price?: number;
    currency?: string;
  };
}

export const MapTooltip = memo(function MapTooltip({ x, y, content }: MapTooltipProps) {
  const formattedPrice = content.price
    ? new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: content.currency || 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(content.price)
    : null;

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        'bg-white border border-gray-200 shadow-lg rounded-lg',
        'px-3 py-2 text-sm',
        'animate-fade-in'
      )}
      style={{
        left: `${x + 10}px`,
        top: `${y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="font-semibold text-foreground">{content.city}</div>
      {formattedPrice && (
        <div className="text-primary font-medium mt-0.5">{formattedPrice}</div>
      )}
    </div>
  );
});
