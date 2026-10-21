// Generated with Claude Opus 5 (Anthropic), 2026-10-21
// Purpose: the guiding values on the Human Practices introduction — small
// squircle cards laid out in a row, each one a dropdown that opens in place
// to reveal the value's write-up. Same squircle language as
// <StakeholderGroup> further down the page, but compact and collapsible, so
// the introduction stays short and the reader opens only what they want.
import { ReactNode, useId, useState } from "react";

interface ValueCardProps {
  title: string;
  children: ReactNode;
}

export function ValueCard({ title, children }: ValueCardProps) {
  const [open, setOpen] = useState(false);
  const bodyId = `value-card-${useId().replace(/:/g, "")}`;

  return (
    <div className={`value-card${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="value-card-toggle"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className="value-card-title">{title}</span>
        <span className="value-card-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {/* Only mounted while open, so collapsed cards stay out of the page's
          text search and keyboard order. */}
      {open && (
        <div className="value-card-body" id={bodyId}>
          {children}
        </div>
      )}
    </div>
  );
}

export function ValueCards({ children }: { children: ReactNode }) {
  return <div className="value-cards">{children}</div>;
}
