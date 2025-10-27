import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface DataQualityBadgeProps {
  quality: 'high' | 'medium' | 'low';
  className?: string;
}

export function DataQualityBadge({ quality, className }: DataQualityBadgeProps) {
  const config = {
    high: {
      label: 'High Data',
      icon: CheckCircle2,
      className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    },
    medium: {
      label: 'Medium Data',
      icon: MinusCircle,
      className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    },
    low: {
      label: 'Low Data',
      icon: AlertCircle,
      className: 'bg-muted text-muted-foreground border-border hover:bg-muted',
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[quality];

  return (
    <Badge
      variant="outline"
      className={cn('gap-1 text-xs font-medium', badgeClassName, className)}
      title={`${label} quality - ${quality === 'high' ? 'Reliable market insights' : quality === 'medium' ? 'Good market coverage' : 'Limited data available'}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
}
