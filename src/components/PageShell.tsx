// Generated with Claude Sonnet 5 (Anthropic), 2026-07-28
// Purpose: wraps every routed page's content, pairing the page-wide DNA
// section index (left) with the actual content (right, filling the rest of
// the row) so the index reserves its own column instead of floating.
import { ReactNode, useRef } from "react";
import { SectionProgress } from "./SectionProgress";

export function PageShell({
  children,
  hideIndex = false,
}: {
  children: ReactNode;
  hideIndex?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="page-shell">
      {!hideIndex && <SectionProgress containerRef={contentRef} />}
      <div ref={contentRef} className="container page-shell-content">
        {children}
      </div>
    </div>
  );
}
