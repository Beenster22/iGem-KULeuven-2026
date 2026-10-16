// Generated with Claude Sonnet 5 (Anthropic), 2026-07-13 (reworked 2026-07-28, 2026-09-04)
// Purpose: page-wide left-hand index tracking scroll position through
// sections, styled as a DNA strand that threads directly through each
// section's dot (rather than a decorative graphic beside the list), with
// always-visible titles. Scans the rendered page for h2/h3 directly (content
// pages compose several PageLayout blocks, so headings can't be read off any
// single block's props) and re-scans whenever the route changes. h3s are
// tracked as subsections and rendered indented off the strand (see the
// "sub" class in App.css) so the hierarchy reads at a glance.
import { MouseEvent, RefObject, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { stringToSlug } from "../utils/stringToSlug";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
  parentId?: string;
}

interface SectionProgressProps {
  containerRef: RefObject<HTMLElement | null>;
}

function collectHeadings(container: HTMLElement): Heading[] {
  const seen = new Map<string, number>();
  let currentParentId: string | undefined;
  return Array.from(
    container.querySelectorAll("h2:not([data-toc-ignore]), h3:not([data-toc-ignore])"),
  ).map((element) => {
    const text = (element.textContent || "").trim();
    let slug = stringToSlug(text) || "section";
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    element.id = slug;
    const level: 2 | 3 = element.tagName === "H3" ? 3 : 2;
    if (level === 2) currentParentId = slug;
    return { id: slug, text, level, parentId: level === 3 ? currentParentId : undefined };
  });
}

// A boxed left-hand rail, one row per section, with a DNA helix running
// alongside the list and the current section highlighted. Titles are always
// visible (no hover-to-reveal), so the box reserves real layout space.
export function SectionProgress({ containerRef }: SectionProgressProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  // Pages opt in by rendering an element with data-toc-collapsible: h3
  // subsections then only show under the one expanded h2 (accordion style).
  const [collapsible, setCollapsible] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
  const location = useLocation();

  // Page content changes on navigation, so re-scan whenever the route does.
  // The DOM is already committed by the time this effect runs, so the scan
  // can happen synchronously without waiting on a paint/animation frame.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const found = collectHeadings(container);
    setHeadings(found);
    setActiveId(found[0]?.id ?? "");
    setCollapsible(container.querySelector("[data-toc-collapsible]") !== null);
    setOpenGroup("");
  }, [containerRef, location.pathname]);

  // Keep the group holding the section being read expanded.
  useEffect(() => {
    const active = headings.find((heading) => heading.id === activeId);
    if (active) setOpenGroup(active.parentId ?? active.id);
  }, [activeId, headings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [containerRef, headings]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  if (headings.length < 2) return null;

  const parentsWithChildren = new Set(headings.map((heading) => heading.parentId));
  const visibleHeadings = collapsible
    ? headings.filter((heading) => heading.level === 2 || heading.parentId === openGroup)
    : headings;

  return (
    <nav className="section-progress" aria-label="Page sections">
      <div className="section-progress-box">
        <p className="section-progress-heading">On this page</p>
        <ul>
          {visibleHeadings.map((heading) => {
            const expandable = collapsible && parentsWithChildren.has(heading.id);
            const isOpen = openGroup === heading.id;
            return (
              <li
                key={heading.id}
                className={[
                  activeId === heading.id ? "active" : null,
                  heading.level === 3 ? "sub" : null,
                  expandable ? "expandable" : null,
                  expandable && isOpen ? "open" : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined}
              >
                <a href={`#${heading.id}`} onClick={(event) => handleClick(event, heading.id)}>
                  <span className="section-progress-dot" />
                  <span className="section-progress-label">{heading.text}</span>
                </a>
                {expandable && (
                  <button
                    type="button"
                    className="section-progress-toggle"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${heading.text}`}
                    onClick={() => setOpenGroup(isOpen ? "" : heading.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
