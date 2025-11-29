import { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDrivingTime } from '@/lib/utils/distance';
import { DataQualityBadge } from '@/components/common/DataQualityBadge';
import type { OpportunityResult } from '@/types';

interface OpportunityCardProps {
  opportunity: OpportunityResult;
  isSelected?: boolean;
  onClick?: () => void;
  onAnalyze: () => void;
}

export const OpportunityCard = memo(function OpportunityCard({
  opportunity,
  isSelected = false,
  onClick,
  onAnalyze
}: OpportunityCardProps) {
  const drivingTimeText = formatDrivingTime(opportunity.drivingTimeMin);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg',
        isSelected && 'border-primary border-2 shadow-md'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {opportunity.city}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {opportunity.region}, {opportunity.country}
            </p>
          </div>
          <DataQualityBadge quality={opportunity.dataAvailability} />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
          <Car className="h-4 w-4" />
          <span>{drivingTimeText}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Est. Revenue</span>
            </div>
            <p className="text-base font-semibold text-foreground">
              {formatCurrency(opportunity.previewMetrics.estimatedMonthlyRevenue)}/mo
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Est. ROI</span>
            </div>
            <p className="text-base font-semibold text-primary">
              {opportunity.previewMetrics.estimatedROI.toFixed(1)}%
            </p>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze();
          }}
          className="w-full"
          size="sm"
        >
          Analyze Investment
        </Button>
      </CardContent>
    </Card>
  );
});
