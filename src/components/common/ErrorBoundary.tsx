import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-ink">
          <div className="max-w-md w-full bg-paper-card border-3 border-ink rounded-[28px] p-8 shadow-solid-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-stamp text-white border-2 border-ink flex items-center justify-center mx-auto text-2xl shadow-solid-xs">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-ink">Application Ready</h2>
              <p className="text-xs text-graphite font-medium">
                {this.state.error?.message || 'A render state needed refreshing.'}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 px-6 bg-highlighter border-2 border-ink font-extrabold text-xs rounded-xl shadow-solid-xs hover:shadow-solid-sm transition-all"
            >
              Reload Page ➔
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
