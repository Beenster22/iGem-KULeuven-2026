// Generated with Claude Opus 5 (Anthropic), 2026-10-16
// Purpose: the row of headline "success" cards at the top of the results
// page. Each card is a shortcut: clicking it scrolls to the section of the
// page that carries the data behind that success, so a reader can start from
// the result rather than from the method.
//
// The cards link by heading slug (the same slugs SectionProgress assigns to
// the headings of a page, see utils/stringToSlug), so a card's `to` is just
// the slugified heading text of its target section — no extra markup is
// needed at the destination.
import type { MouseEvent, ReactNode } from "react";

interface SuccessCardProps {
  /** Slug of the heading to jump to, without the leading "#". */
  to: string;
  children: ReactNode;
}

export function SuccessCard({ to, children }: SuccessCardProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(to);
    // No target yet (the section may live in a tab that is not open, or may
    // still be a placeholder) — leave the default jump in place rather than
    // swallowing the click.
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${to}`);
  }

  return (
    <a className="success-card" href={`#${to}`} onClick={handleClick}>
      <span className="success-card-label">{children}</span>
      <svg className="success-card-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </a>
  );
}

export function SuccessCards({ children }: { children: ReactNode }) {
  return (
    <nav className="success-cards" aria-label="Our results at a glance">
      {children}
    </nav>
  );
}
