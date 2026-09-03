// Generated with Claude Sonnet 5 (Anthropic), 2026-07-28 (extended 2026-09-03)
// Purpose: wraps every routed page's content, pairing the page-wide DNA
// section index (left) with the actual content (right, filling the rest of
// the row) so the index reserves its own column instead of floating.
import { ReactNode, useEffect, useRef, useState } from "react";
import { SectionProgress } from "./SectionProgress";

// Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
// Purpose: a [^1] citation's target sits inside a collapsed <details>
// "References" panel (see src/mdx/rehypeReferences.ts). Most modern
// browsers auto-open a <details> when a fragment link jumps inside it, but
// support isn't universal — this force-opens it first so the jump always
// lands somewhere visible.
function openDetailsFor(id: string) {
  const target = document.getElementById(id);
  const details = target?.closest("details");
  if (details && !details.open) details.open = true;
}

export function PageShell({
  children,
  hideIndex = false,
}: {
  children: ReactNode;
  hideIndex?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  // Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
  // Purpose: id of the in-text [n] citation the reader last followed into
  // the References panel — shown as a single floating "return" button
  // (rather than a back-link on every reference) so it only ever appears
  // once a reader has actually jumped away from their place in the text.
  const [returnToId, setReturnToId] = useState<string | null>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Covers landing directly on a shared #user-content-fn-n link.
    if (location.hash) openDetailsFor(location.hash.slice(1));

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a[href^='#']");
      const id = link?.getAttribute("href")?.slice(1);
      if (id) openDetailsFor(id);

      const citationLink = (event.target as HTMLElement).closest("a[data-footnote-ref]");
      if (citationLink?.id) setReturnToId(citationLink.id);
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  function returnToReading() {
    const target = returnToId ? document.getElementById(returnToId) : null;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    setReturnToId(null);
  }

  return (
    <div className="page-shell">
      {!hideIndex && <SectionProgress containerRef={contentRef} />}
      <div ref={contentRef} className="container page-shell-content">
        {children}
      </div>
      {returnToId && (
        <button
          type="button"
          className="return-to-reading"
          onClick={returnToReading}
          aria-label="Return to where you were reading"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M5 12l7-7M5 12l7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Return to reading</span>
        </button>
      )}
    </div>
  );
}
