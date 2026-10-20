// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: before this, an error while loading or rendering a page (most often
// a page chunk that failed to download — see src/contents/index.tsx) unmounted
// the whole app and left a blank purple screen until the visitor refreshed.
// A failed chunk is retried by reloading once; anything else shows a message
// with a reload button. App.tsx keys it by route, so moving to another page
// clears the error instead of keeping it.
import { Component, type ErrorInfo, type ReactNode } from "react";

const RELOADED_KEY = "page-error-reloaded";

const isChunkError = (error: Error) =>
  /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError/i.test(
    `${error.name} ${error.message}`,
  );

export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
    // A stale or interrupted chunk is usually fixed by a fresh load; the
    // session flag stops this from looping if the chunk really is gone.
    try {
      if (isChunkError(error) && !sessionStorage.getItem(RELOADED_KEY)) {
        sessionStorage.setItem(RELOADED_KEY, "1");
        window.location.reload();
        return;
      }
      sessionStorage.removeItem(RELOADED_KEY);
    } catch {
      /* storage unavailable: fall through to the message */
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container page-shell-content" role="alert">
        <h2>This page didn&rsquo;t load</h2>
        <p>Something went wrong while loading it. Reloading usually fixes it.</p>
        <button type="button" className="btn-empower" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}
