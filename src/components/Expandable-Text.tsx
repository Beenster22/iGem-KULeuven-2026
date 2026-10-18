import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { stringToSlug } from "../utils/stringToSlug";
import { headingSlugs, textOf } from "./useHashPanel";

interface ExpandableTextProps {
  title: ReactNode;
  // Extra labels for the right-hand side of the tab, beside the chevron.
  // Rendered as a sibling of the title rather than inside it, because the
  // page-wide index (SectionProgress) takes each row's label from the
  // heading's textContent — anything nested in the h3 would end up in it.
  meta?: ReactNode;
  // Opened and closed by the parent instead of by itself. Both must be given
  // together; left out, the dropdown keeps its own state as before. Used by
  // NotebookDropdown, where a cross-reference elsewhere on the page can ask a
  // notebook to open (see EntryLink).
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}
// Component translated from Astro to React, taken from 2025 Munich team's repo. Original Astro component can be found here: https://gitlab.igem.org/2025/munich/-/blob/1665a99ba477fe5f9ca6e8c41f79ca5d31a1a71e/src/components/ExpandableText.astro
// Generated with Claude Sonnet 5 (Anthropic), 2026-07-17
// Purpose: performed the Astro-to-React translation above.
// Edited with Claude Opus 5 (Anthropic), 2026-10-09: added the optional meta slot.
// Edited with Claude Opus 5 (Anthropic), 2026-10-17: the open state can be
// handed to the parent (open / onOpenChange), so a notebook can be opened
// from a link somewhere else on the page.
export function ExpandableText({
  title,
  meta,
  open,
  onOpenChange,
  children,
}: ExpandableTextProps) {
  const [ownOpen, setOwnOpen] = useState(false);
  const isOpen = open ?? ownOpen;

  // Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-17: a dropdown's
  // content is only rendered while it is open, so a link such as
  // /results#antibiotic-susceptibility-of-p-vulgatus would find nothing to
  // jump to. A dropdown on its own state therefore opens when the URL hash
  // names its own title or a heading inside it (nested dropdowns included —
  // each level opens in turn as the one above renders it).
  const { hash } = useLocation();
  useEffect(() => {
    if (open !== undefined) return;
    const check = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (!slug) return;
      if (stringToSlug(textOf(title)) === slug || headingSlugs(children).includes(slug)) {
        setOwnOpen(true);
      }
    };
    check();
    // A plain #link changes the hash without going through the router.
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
    // Only a change of hash should (re)open it, not every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);
  const setIsOpen = (next: boolean) => {
    setOwnOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className="expandable-container">
      <button
        type="button"
        className="expandable-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
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
