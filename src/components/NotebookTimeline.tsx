// Generated with Claude Sonnet 5 (Anthropic), 2026-07-14
// Purpose: tabbed timeline for browsing dated notebook entries and their PDFs.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

interface NotebookEntryProps {
  label: string;
  pdfUrl?: string;
  children: ReactNode;
}

// A labeled slot for use inside NotebookTimeline. Never rendered directly —
// the parent reads its props via extractEntries instead.
export function NotebookEntry({ children }: NotebookEntryProps) {
  return <>{children}</>;
}

function extractEntries(children: ReactNode) {
  return Children.toArray(children)
    .filter((child): child is ReactElement<NotebookEntryProps> => isValidElement(child))
    .map((child) => ({
      label: child.props.label,
      pdfUrl: child.props.pdfUrl,
      content: child.props.children,
    }));
}

interface NotebookTimelineProps {
  children: ReactNode;
}

export function NotebookTimeline({ children }: NotebookTimelineProps) {
  const entries = useMemo(() => extractEntries(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = entries[activeIndex];

  return (
    <div className="notebook-timeline-wrapper">
      <ol className="notebook-timeline" role="tablist">
        {entries.map((entry, index) => (
          <li key={entry.label} className={index === activeIndex ? "active" : undefined}>
            <button
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className="notebook-timeline-dot" />
              <span className="notebook-timeline-label">{entry.label}</span>
            </button>
          </li>
        ))}
      </ol>
      {active && (
        <div className="notebook-entry">
          {active.content}
          {active.pdfUrl ? (
            <div className="notebook-entry-pdf">
              <iframe src={active.pdfUrl} title={`${active.label} notebook PDF`} />
              <a href={active.pdfUrl} download className="notebook-entry-download">
                Download PDF
              </a>
            </div>
          ) : (
            <p className="notebook-entry-pdf-placeholder">PDF not yet uploaded.</p>
          )}
        </div>
      )}
    </div>
  );
}
