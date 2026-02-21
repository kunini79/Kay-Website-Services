import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SystemErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="tb-error-boundary">
          <div className="tb-error-card">
            <div className="tb-error-icon">
              <AlertTriangle size={48} color="white" />
            </div>
            <h2 className="tb-error-title">Uh oh! Something drifted away...</h2>
            <p className="tb-error-msg">
              We encountered a little hiccup while exploring. Let's try that again!
            </p>
            <button
              onClick={this.handleReload}
              className="tb-btn tb-btn-primary"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
