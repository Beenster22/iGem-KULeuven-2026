// Generated with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: let a link from another page reach a heading that sits inside a
// tab or segment which is not the open one — e.g. the experimental overview
// pointing at "CRISPR construct design", which lives in the Therapeutics
// segment of the results page.
//
// Only the active panel's content is rendered (see TabbedSections and
// SegmentedSelector), so the heading the hash names does not exist in the
// DOM yet and PageShell's jump has nothing to scroll to. The panels are the
// only place that knows what they contain, so each one checks the hash
// itself: it walks its own children for headings, slugifies them the same
// way SectionProgress does, and opens the panel that holds the match.
//
// Nested selectors work without extra wiring: an inner one only mounts once
// its parent has opened, and runs this same check on mount, while
// PageShell keeps retrying the scroll for two seconds.
import { ReactNode, isValidElement, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { stringToSlug } from "../utils/stringToSlug";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** Plain text of a React subtree, ignoring anything that is not a string. */
export function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * Slugs of every heading in a subtree. Headings nested inside other
 * components (an <ExpandableText>, say) count too: their content is still
 * part of this panel, and MDX leaves them in the element tree as children.
 */
export function headingSlugs(node: ReactNode, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((child) => headingSlugs(child, found));
    return found;
  }
  if (!isValidElement(node)) return found;

  if (typeof node.type === "string" && HEADING_TAGS.has(node.type)) {
    const text = textOf((node.props as { children?: ReactNode }).children);
    if (text) found.push(stringToSlug(text));
  }
  // A dropdown's title is rendered as a heading too (see ExpandableText), but
  // it is a prop, not a child, so it has to be read from there.
  const title = (node.props as { title?: ReactNode }).title;
  if (typeof node.type !== "string" && title) {
    const text = textOf(title);
    if (text) found.push(stringToSlug(text));
  }
  headingSlugs((node.props as { children?: ReactNode }).children, found);
  return found;
}

/**
 * Opens the panel whose content holds the heading named by the URL hash.
 * Does nothing when there is no hash, or when no panel matches — a hash
 * meant for somewhere else on the page is left to PageShell.
 */
export function useHashPanel(
  items: { content: ReactNode }[],
  setActiveIndex: (index: number) => void,
) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const slug = hash.slice(1);
    const index = items.findIndex((item) =>
      headingSlugs(item.content).includes(slug),
    );
    if (index !== -1) setActiveIndex(index);
    // setActiveIndex is a setState function, stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, items]);
}
