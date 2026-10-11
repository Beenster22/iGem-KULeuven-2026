import { ReactNode, useState } from "react";

interface ExpandableTextProps {
  title: ReactNode;
  // Extra labels for the right-hand side of the tab, beside the chevron.
  // Rendered as a sibling of the title rather than inside it, because the
  // page-wide index (SectionProgress) takes each row's label from the
  // heading's textContent — anything nested in the h3 would end up in it.
  meta?: ReactNode;
  children: ReactNode;
}
// Component translated from Astro to React, taken from 2025 Munich team's repo. Original Astro component can be found here: https://gitlab.igem.org/2025/munich/-/blob/1665a99ba477fe5f9ca6e8c41f79ca5d31a1a71e/src/components/ExpandableText.astro
// Generated with Claude Sonnet 5 (Anthropic), 2026-07-17
// Purpose: performed the Astro-to-React translation above.
// Edited with Claude Opus 5 (Anthropic), 2026-10-09: added the optional meta slot.
export function ExpandableText({ title, meta, children }: ExpandableTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="expandable-container">
      <button
        type="button"
        className="expandable-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {/* h3 (not a span) so the page-wide left index (SectionProgress, which
            scans h2/h3) picks up every protocol / notebook as a linkable
            subsection — the only consumers are protocols.mdx and
            NotebookDropdown (notebook.mdx), so promoting the title to a
            real heading is safe here. */}
        <h3 className="expandable-title">{title}</h3>
        {meta}
        <svg
          className="expandable-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="expandable-content">
          <div className="expandable-content-inner">{children}</div>
        </div>
      )}
    </div>
  );
}
