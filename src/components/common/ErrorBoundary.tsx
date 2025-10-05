import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  title?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: send to logging service
    // console.error('ErrorBoundary caught', error, info);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg border border-destructive-200 bg-destructive-50 p-6">
          <div className="flex items-start space-x-3">
            <XCircle className="h-6 w-6 text-destructive-600" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-destructive-800">Something went wrong</h3>
              <p className="mt-1 text-sm text-destructive-700">{this.state.error.message || 'An unexpected error occurred'}</p>
              <div className="mt-3 flex items-center space-x-2">
                <Button onClick={this.reset}>Try again</Button>
                <Button variant="ghost" onClick={() => window.location.reload()}>Reload page</Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as JSX.Element;
  }
}
