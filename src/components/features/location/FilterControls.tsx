import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDrivingTime } from '@/lib/utils/distance';
import type { OpportunitiesFilters } from '@/types';

interface FilterControlsProps {
  filters: OpportunitiesFilters;
  onFiltersChange: (filters: OpportunitiesFilters) => void;
  className?: string;
}

const DEFAULT_FILTERS: OpportunitiesFilters = {
  radiusKm: 50,
  maxDrivingTimeMin: 120,
  devMode: false,
};

export function FilterControls({ filters, onFiltersChange, className }: FilterControlsProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  
  useDebounce(localFilters, 300);
  
  const updateFilters = (updates: Partial<OpportunitiesFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  
  return (
    <div className={cn('w-full rounded-lg border border-border bg-card p-4', className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Search Radius */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Radius</label>
            <span className="text-xs text-muted-foreground">{localFilters.radiusKm} km</span>
          </div>
          <Slider
            value={[localFilters.radiusKm || 50]}
            onValueChange={(v) => updateFilters({ radiusKm: v[0] })}
            min={10}
            max={200}
            step={10}
            className="w-full"
          />
        </div>
        
        {/* Max Driving Time */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Max Drive</label>
            <span className="text-xs text-muted-foreground">
              {formatDrivingTime(localFilters.maxDrivingTimeMin || 120)}
            </span>
          </div>
          <Slider
            value={[localFilters.maxDrivingTimeMin || 120]}
            onValueChange={(v) => updateFilters({ maxDrivingTimeMin: v[0] })}
            min={30}
            max={240}
            step={15}
            className="w-full"
          />
        </div>
        
        {/* Dev Mode & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dev-mode"
              checked={localFilters.devMode}
              onCheckedChange={(checked) => updateFilters({ devMode: !!checked })}
            />
            <label htmlFor="dev-mode" className="text-sm cursor-pointer whitespace-nowrap">
              Dev Mode
            </label>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => updateFilters(DEFAULT_FILTERS)}
            className="h-8"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
