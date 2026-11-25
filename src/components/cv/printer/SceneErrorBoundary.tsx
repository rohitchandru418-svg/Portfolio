"use client";

import { Component, type ReactNode } from "react";

/**
 * R3F's useLoader throws on a failed texture fetch, and a throw with no
 * boundary above it unmounts the whole app. Catch it here so a scene failure
 * degrades to the CSS printer instead of blanking the portfolio.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
