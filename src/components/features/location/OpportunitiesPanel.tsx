import { memo, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { OpportunityCard } from '@/components/features/cards/OpportunityCard';
import type { OpportunityResult } from '@/types';

interface OpportunitiesPanelProps {
  opportunities: OpportunityResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAnalyze: (opportunity: OpportunityResult) => void;
  isLoading?: boolean;
}

export const OpportunitiesPanel = memo(function OpportunitiesPanel({
  opportunities,
  selectedId,
  onSelect,
  onAnalyze,
  isLoading = false
}: OpportunitiesPanelProps) {
  const count = opportunities.length;
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to selected card when selectedId changes
  useEffect(() => {
    if (selectedId && cardRefs.current.has(selectedId) && scrollContainerRef.current) {
      const cardElement = cardRefs.current.get(selectedId);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedId]);

  return (
    <div 
      ref={scrollContainerRef}
      className="h-[600px] overflow-y-auto space-y-3"
    >
      {isLoading ? (
          // Loading State
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </>
        ) : count === 0 ? (
          // Empty State
          <EmptyState message="No opportunities found. Try adjusting your filters or searching a new location." />
        ) : (
          // Opportunities List
          <>
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current.set(opportunity.id, el);
                  } else {
                    cardRefs.current.delete(opportunity.id);
                  }
                }}
              >
                <OpportunityCard
                  opportunity={opportunity}
                  isSelected={opportunity.id === selectedId}
                  onClick={() => onSelect(opportunity.id)}
                  onAnalyze={() => onAnalyze(opportunity)}
                />
              </div>
            ))}
          </>
        )}
    </div>
  );
});
