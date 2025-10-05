import React from 'react';

export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-muted p-6 text-center">
      <div className="text-muted-foreground mb-4">{message}</div>
      {actionLabel ? (
        <button onClick={onAction} className="text-primary underline">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
