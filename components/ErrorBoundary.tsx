"use client";

import { Dict } from "@/types/dict";
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  lang: "ar" | "en";
  dict: Dict;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }

  render() {
    const { dict } = this.props;
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-danger mb-4">{dict.oops}</h2>
          <p className="text-muted mb-4">{dict.refreshPage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-white rounded "
          >
            {dict.refreshPage}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
