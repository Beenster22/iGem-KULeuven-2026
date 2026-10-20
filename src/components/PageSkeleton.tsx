// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: what a page shows while its code is still downloading (every page
// is its own chunk, see src/contents/index.tsx). The page header is already
// on screen by then, so this stands in for the body only: the index column on
// the left and a few placeholder paragraphs and cards, so the layout doesn't
// jump when the real content arrives.
const PARAGRAPH_WIDTHS = ["100%", "96%", "88%", "100%", "62%"];

function Paragraph({ lines = PARAGRAPH_WIDTHS }: { lines?: string[] }) {
  return (
    <div className="skeleton-paragraph">
      {lines.map((width, index) => (
        <span key={index} className="skeleton-block skeleton-line" style={{ width }} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-shell skeleton-page" role="status" aria-live="polite">
      <span className="visually-hidden">Loading page…</span>
      <div className="skeleton-index" aria-hidden="true">
        {[70, 90, 60, 80, 65].map((width, index) => (
          <span key={index} className="skeleton-block skeleton-line" style={{ width: `${width}%` }} />
        ))}
      </div>
      <div className="container page-shell-content skeleton-content" aria-hidden="true">
        <span className="skeleton-block skeleton-heading" />
        <Paragraph />
        <Paragraph lines={["100%", "92%", "100%", "70%"]} />
        <span className="skeleton-block skeleton-card" />
        <span className="skeleton-block skeleton-heading skeleton-heading--short" />
        <Paragraph />
        <Paragraph lines={["100%", "84%", "56%"]} />
      </div>
    </div>
  );
}
