// Generated with Claude Sonnet 5 (Anthropic), 2026-07-28 (extended 2026-09-03)
// Purpose: wraps every routed page's content, pairing the page-wide DNA
// section index (left) with the actual content (right, filling the rest of
// the row) so the index reserves its own column instead of floating.
import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
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
  // Both routes render a PageShell, so React keeps this component mounted
  // across a navigation: without the route in the effect's dependencies, a
  // link to another page's section would never run the jump below.
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  // Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
  // Purpose: id of the in-text [n] citation the reader last followed into
  // the References panel — shown as a single floating "return" button
  // (rather than a back-link on every reference) so it only ever appears
  // once a reader has actually jumped away from their place in the text.
  const [returnToId, setReturnToId] = useState<string | null>(null);

  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-17 (team feedback:
  // a box on the home page opened the next page at the bottom): React Router
  // keeps the scroll position across a navigation, so a link followed from far
  // down a page landed equally far down the next one. A new page now starts at
  // the top, unless the link points at a section (handled below) or the reader
  // came back with the browser's back/forward buttons, which restore their
  // place themselves. "instant" because the site scrolls smoothly otherwise.
  useEffect(() => {
    if (!hash && navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // Only on a change of page: following a #link within one must not jump.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Covers landing directly on a shared #user-content-fn-n link.
    if (hash) openDetailsFor(hash.slice(1));

    // Generated with Claude Opus 5 (Anthropic), 2026-10-17
    // Purpose: a link from another page to a section of this one, e.g. the
    // notebook pointing at a protocol with <Link to="/protocols#colony-pcr">.
    // The browser cannot jump there itself: the page is rendered by React
    // after the navigation, and the heading ids are assigned once it is (see
    // SectionProgress). So the jump is made here, after that first paint.
    let jump = 0;
    if (hash) {
      const id = hash.slice(1);
      // Two things make a single jump unreliable on these pages: the heading
      // ids are handed out by SectionProgress once the page has rendered,
      // and the page keeps growing afterwards as its figures load, which
      // leaves an early jump short of the target. So it is repeated until
      // the target sits at the top of the viewport, or for two seconds.
      // "instant" matters: the page sets scroll-behavior: smooth, and a
      // smooth scroll restarts from where it is each time it is asked
      // again, so a repeated smooth jump never arrives anywhere.
      let tries = 0;
      const scrollToHash = () => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ block: "start", behavior: "instant" });
        const landed = target && target.getClientRects().length > 0 && Math.abs(target.getBoundingClientRect().top) < 120;
        if (!landed && tries++ < 20) jump = window.setTimeout(scrollToHash, 100);
      };
      scrollToHash();
    }

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest("a[href^='#']");
      const id = link?.getAttribute("href")?.slice(1);
      if (id) openDetailsFor(id);

      const citationLink = (event.target as HTMLElement).closest("a[data-footnote-ref]");
      if (citationLink?.id) setReturnToId(citationLink.id);
    };
    container.addEventListener("click", onClick);
    return () => {
      clearTimeout(jump);
      container.removeEventListener("click", onClick);
    };
  }, [pathname, hash]);

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
