import React from 'react';

export function Skeleton({ className = 'h-6 w-full' }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`animate-pulse bg-muted/60 rounded ${className}`}
    />
  );
}
