// Generated with Claude Sonnet 5 (Anthropic), 2026-07-28 (extended 2026-09-03)
// Purpose: wraps every routed page's content, pairing the page-wide DNA
// section index (left) with the actual content (right, filling the rest of
// the row) so the index reserves its own column instead of floating.
import { ReactNode, useEffect, useRef } from "react";
import { SectionProgress } from "./SectionProgress";

// Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
// Purpose: a [^1] citation's target sits inside a collapsed <details>
// "References" panel (see src/mdx/rehypeReferences.ts). Most modern
// browsers auto-open a <details> when a fragment link jumps inside it, but
// support isn't universal — this force-opens it first so the jump (and the
// matching "back to text" link) always lands somewhere visible.
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

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Covers landing directly on a shared #user-content-fn-n link.
    if (location.hash) openDetailsFor(location.hash.slice(1));

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a[href^='#']");
      const id = link?.getAttribute("href")?.slice(1);
      if (id) openDetailsFor(id);
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="page-shell">
      {!hideIndex && <SectionProgress containerRef={contentRef} />}
      <div ref={contentRef} className="container page-shell-content">
        {children}
      </div>
    </div>
  );
}
