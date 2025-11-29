import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Locate, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetToUser: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  hasUserLocation: boolean;
  isMobile?: boolean;
  className?: string;
}

export const MapControls = memo(function MapControls({
  onZoomIn,
  onZoomOut,
  onResetToUser,
  onToggleFullscreen,
  isFullscreen = false,
  hasUserLocation,
  isMobile = false,
  className
}: MapControlsProps) {
  return (
    <div className={cn(
      'absolute top-4 right-4 z-10 flex flex-col gap-2',
      className
    )}>
      {/* Zoom controls */}
      <div className="flex flex-col bg-background/95 backdrop-blur rounded-lg shadow-lg border overflow-hidden">
        <Button
          variant="ghost"
          size={isMobile ? 'default' : 'icon'}
          onClick={onZoomIn}
          className={cn(
            'rounded-none border-b hover:bg-accent',
            isMobile && 'h-12 w-12'
          )}
          title="Zoom in"
        >
          <Plus className={cn('h-4 w-4', isMobile && 'h-5 w-5')} />
        </Button>
        <Button
          variant="ghost"
          size={isMobile ? 'default' : 'icon'}
          onClick={onZoomOut}
          className={cn(
            'rounded-none hover:bg-accent',
            isMobile && 'h-12 w-12'
          )}
          title="Zoom out"
        >
          <Minus className={cn('h-4 w-4', isMobile && 'h-5 w-5')} />
        </Button>
      </div>

      {/* User location reset */}
      {hasUserLocation && (
        <Button
          variant="ghost"
          size={isMobile ? 'default' : 'icon'}
          onClick={onResetToUser}
          className={cn(
            'bg-background/95 backdrop-blur shadow-lg border hover:bg-accent',
            isMobile && 'h-12 w-12'
          )}
          title="Return to your location"
        >
          <Locate className={cn('h-4 w-4', isMobile && 'h-5 w-5')} />
        </Button>
      )}

      {/* Fullscreen toggle (mobile only) */}
      {isMobile && onToggleFullscreen && (
        <Button
          variant="ghost"
          size="default"
          onClick={onToggleFullscreen}
          className="bg-background/95 backdrop-blur shadow-lg border hover:bg-accent h-12 w-12"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
});
