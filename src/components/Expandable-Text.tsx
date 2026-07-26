import { ReactNode, useState } from "react";

interface ExpandableTextProps {
  title: ReactNode;
  children: ReactNode;
}
// Component translated from Astro to React, taken from 2025 Munich team's repo. Original Astro component can be found here: https://gitlab.igem.org/2025/munich/-/blob/1665a99ba477fe5f9ca6e8c41f79ca5d31a1a71e/src/components/ExpandableText.astro
// Generated with Claude Sonnet 5 (Anthropic), 2026-07-17
// Purpose: performed the Astro-to-React translation above.
export function ExpandableText({ title, children }: ExpandableTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="expandable-container">
      <button
        type="button"
        className="expandable-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="expandable-title">{title}</span>
        <svg
          className="expandable-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(90deg)" : undefined }}
        >
          <path d="m9 18 6-6-6-6" />
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
