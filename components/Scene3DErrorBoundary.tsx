"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class Scene3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Scene3D Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Silently fail and render nothing - the scene is decorative
      return null;
    }

    return this.props.children;
  }
}

export default Scene3DErrorBoundary;
