// Generated with Claude Sonnet 5 (Anthropic), 2026-07-13 (reworked 2026-07-28, 2026-09-04)
// Reworked with Claude Opus 5.5 (Anthropic), 2026-10-06: the DNA strand and
// per-section dots are replaced by the team mascot, which hops along the
// list to whichever section is currently being read.
// Purpose: page-wide left-hand index tracking scroll position through
// sections, with always-visible titles and the mascot marking the current
// one. Scans the rendered page for h2/h3 directly (content pages compose
// several PageLayout blocks, so headings can't be read off any single
// block's props) and re-scans whenever the route or the page's DOM changes.
// h3s are tracked as subsections and rendered indented (see the "sub" class
// in App.css) so the hierarchy reads at a glance; opted-in h4s sit one level
// deeper ("sub-sub").
import { MouseEvent, RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { stringToSlug } from "../utils/stringToSlug";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  parentId?: string;
}

// h4s are only listed when they opt in with data-toc-sub (the sections inside
// an open notebook, see NotebookSection).
const HEADING_SELECTOR =
  "h2:not([data-toc-ignore]), h3:not([data-toc-ignore]), h4[data-toc-sub]";

interface SectionProgressProps {
  containerRef: RefObject<HTMLElement | null>;
}

type MascotMood = "smile" | "happy" | "excited";

const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";
const MASCOT_MOODS: MascotMood[] = ["smile", "happy", "excited"];
// Keep in sync with the transform transition on .section-progress-mascot.
const MASCOT_TRAVEL_MS = 450;

function collectHeadings(container: HTMLElement): Heading[] {
  const seen = new Map<string, number>();
  // Edited with Claude Opus 5.5 (Anthropic), 2026-10-13
  // Purpose: dropdown titles (ExpandableText) are h3s too, so on pages that
  // group dropdowns under a written h3 ("### Cell Culture" on Protocols) the
  // group and its protocols used to share one level. A dropdown title that
  // follows a written h3 is listed one level deeper instead.
  let underWrittenH3 = false;
  let currentParentId: string | undefined;
  return Array.from(container.querySelectorAll(HEADING_SELECTOR)).map((element) => {
    const isDropdownTitle = element.classList.contains("expandable-title");
    if (element.tagName === "H2") underWrittenH3 = false;
    else if (element.tagName === "H3" && !isDropdownTitle) underWrittenH3 = true;
    const text = (element.textContent || "").trim();
    let slug = stringToSlug(text) || "section";
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    element.id = slug;
    const level: 2 | 3 | 4 =
      element.tagName === "H4" || (isDropdownTitle && underWrittenH3) ? 4 : element.tagName === "H3" ? 3 : 2;
    if (level === 2) currentParentId = slug;
    return { id: slug, text, level, parentId: level === 2 ? undefined : currentParentId };
  });
}

// Headings land 5rem below the top of the screen when jumped to (see
// scroll-margin-top in App.css); the reading line sits just under that, so
// the section a reader jumped to counts as the current one.
const READING_LINE_PX = 92;
// How long a clicked row stays the current one regardless of scroll position
// if the browser never reports the end of the scroll.
const CLICK_LOCK_MS = 1500;

// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-17 (team feedback: on the
// Team page the mascot never followed the reader down to "Principal
// Investigators" and "Advisors"): the last sections of a page are often
// shorter than the screen, so their headings can never scroll up to the
// reading line. Over the final screenful of the page the line therefore moves
// down to the bottom of the screen, so each of those headings counts as read
// in turn as the page runs out.
function readingLine(): number {
  const viewport = window.innerHeight;
  const remaining = Math.max(
    0,
    document.documentElement.scrollHeight - viewport - window.scrollY,
  );
  if (remaining >= viewport) return READING_LINE_PX;
  return READING_LINE_PX + (viewport - READING_LINE_PX) * (1 - remaining / viewport);
}

// The section being read: the last heading at or above the reading line.
function currentHeadingId(headings: Heading[]): string {
  let current = "";
  const line = readingLine();
  for (const heading of headings) {
    const element = document.getElementById(heading.id);
    // Headings inside a hidden section (see PhasePager) have no layout box.
    if (!element || element.getClientRects().length === 0) continue;
    if (!current) current = heading.id;
    if (element.getBoundingClientRect().top > line) break;
    current = heading.id;
  }
  return current || (headings[0]?.id ?? "");
}

function sameHeadings(a: Heading[], b: Heading[]) {
  return (
    a.length === b.length &&
    a.every((heading, i) => heading.id === b[i].id && heading.text === b[i].text && heading.level === b[i].level)
  );
}

// A boxed left-hand rail, one row per section, with the mascot sitting next
// to the current section. Titles are always visible (no hover-to-reveal), so
// the box reserves real layout space.
export function SectionProgress({ containerRef }: SectionProgressProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  // Pages opt in by rendering an element with data-toc-collapsible: subsections
  // then only show under the one expanded h2 (accordion style).
  const [collapsible, setCollapsible] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  // Vertical center of the active row within the list, in px; null until
  // measured so the mascot first appears in place instead of sliding in.
  const [mascotY, setMascotY] = useState<number | null>(null);
  const [travelling, setTravelling] = useState(false);
  // Timer id while a clicked row is held as the current one; 0 otherwise.
  const clickLock = useRef(0);

  // Page content changes on navigation, so re-scan whenever the route does.
  // The DOM is already committed by the time this effect runs, so the scan
  // can happen synchronously without waiting on a paint/animation frame.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const found = collectHeadings(container);
    setHeadings(found);
    setCollapsible(container.querySelector("[data-toc-collapsible]") !== null);
    setOpenGroup("");

    // Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
    // Purpose: heading ids only exist once the scan above has run, so a
    // link from another page to /page#section can't be resolved by the
    // browser on its own — jump to the requested section here instead.
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if (hashId) document.getElementById(hashId)?.scrollIntoView({ block: "start" });
    const target = found.find((heading) => heading.id === hashId);
    setActiveId(target?.id ?? found[0]?.id ?? "");
  }, [containerRef, location.pathname]);

  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-08
  // Purpose: dropdowns only render their content while open, so headings come
  // and go without a route change (opening a notebook reveals its sections).
  // Re-scan when the page's DOM changes so the index follows along.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    const rescan = () => {
      frame = 0;
      const found = collectHeadings(container);
      setHeadings((current) => (sameHeadings(current, found) ? current : found));
      // If the current section was inside a dropdown that just closed, fall
      // back to the last heading above the reading line.
      setActiveId((current) => {
        if (found.some((heading) => heading.id === current)) return current;
        return currentHeadingId(found);
      });
    };

    const observer = new MutationObserver(() => {
      if (!frame) frame = window.requestAnimationFrame(rescan);
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [containerRef, location.pathname]);

  // Keep the group holding the section being read expanded.
  useEffect(() => {
    const active = headings.find((heading) => heading.id === activeId);
    if (active) setOpenGroup(active.parentId ?? active.id);
  }, [activeId, headings]);

  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-08
  // Purpose: follow the reader's scroll position. Replaces an
  // IntersectionObserver band that started below where a clicked heading
  // lands, so jumping upwards marked the section after the clicked one.
  // A clicked row stays current until its scroll has finished (or the reader
  // scrolls themselves), which also covers sections near the end of the page
  // that can never reach the reading line.
  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (clickLock.current) return;
      setActiveId(currentHeadingId(headings));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const releaseLock = () => {
      window.clearTimeout(clickLock.current);
      clickLock.current = 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", releaseLock);
    window.addEventListener("wheel", releaseLock, { passive: true });
    window.addEventListener("touchmove", releaseLock, { passive: true });
    window.addEventListener("keydown", releaseLock);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", releaseLock);
      window.removeEventListener("wheel", releaseLock);
      window.removeEventListener("touchmove", releaseLock);
      window.removeEventListener("keydown", releaseLock);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
  // Purpose: measure where the active row sits so the mascot can be moved to
  // it. Re-measured on resize too, since labels re-wrap once the web font
  // loads and that shifts every row below.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector<HTMLElement>("li.active");
      setMascotY(active ? active.offsetTop + active.offsetHeight / 2 : null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [headings, activeId, openGroup, collapsible]);

  // On long pages the box scrolls internally; keep the active row (and so
  // the mascot) in view. Scrolls the box itself rather than using
  // scrollIntoView, which could interrupt the page's own smooth scroll.
  useEffect(() => {
    const box = listRef.current?.parentElement;
    const active = listRef.current?.querySelector<HTMLElement>("li.active");
    if (!box || !active) return;

    const margin = 48;
    const boxRect = box.getBoundingClientRect();
    const rowRect = active.getBoundingClientRect();
    if (rowRect.top < boxRect.top + margin) {
      box.scrollBy({ top: rowRect.top - boxRect.top - margin, behavior: "smooth" });
    } else if (rowRect.bottom > boxRect.bottom - margin) {
      box.scrollBy({ top: rowRect.bottom - boxRect.bottom + margin, behavior: "smooth" });
    }
  }, [activeId]);

  // The mascot looks happy and hops for as long as it is on the move.
  const previousY = useRef<number | null>(null);
  useEffect(() => {
    const from = previousY.current;
    previousY.current = mascotY;
    if (from === null || mascotY === null || from === mascotY) return;

    setTravelling(true);
    const timer = window.setTimeout(() => setTravelling(false), MASCOT_TRAVEL_MS);
    return () => window.clearTimeout(timer);
  }, [mascotY]);

  const atLastSection = headings.length > 0 && activeId === headings[headings.length - 1].id;
  const mood: MascotMood = travelling ? "happy" : atLastSection ? "excited" : "smile";

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    // A heading inside a hidden section (see PhasePager) has to be revealed first.
    window.dispatchEvent(new CustomEvent("reveal-section", { detail: id }));
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    window.clearTimeout(clickLock.current);
    clickLock.current = window.setTimeout(() => {
      clickLock.current = 0;
    }, CLICK_LOCK_MS);
  }

  if (headings.length < 2) return null;

  const parentsWithChildren = new Set(headings.map((heading) => heading.parentId));
  const visibleHeadings = collapsible
    ? headings.filter((heading) => heading.level === 2 || heading.parentId === openGroup)
    : headings;
  // If the reader collapses the group they are in, the mascot stays on its
  // (still visible) section header instead of vanishing.
  const activeHeading = headings.find((heading) => heading.id === activeId);
  const shownActiveId =
    collapsible && activeHeading?.parentId && activeHeading.parentId !== openGroup
      ? activeHeading.parentId
      : activeId;

  return (
    <nav className="section-progress" aria-label="Page sections">
      <div className="section-progress-box">
        <p className="section-progress-heading">On this page</p>
        <ul ref={listRef}>
          {mascotY !== null && (
            <li
              className={`section-progress-mascot${travelling ? " travelling" : ""}`}
              style={{ transform: `translateY(${mascotY}px)` }}
              aria-hidden="true"
            >
              <span className="section-progress-mascot-body">
                {/* All moods stay mounted so swapping faces never waits on a download. */}
                {MASCOT_MOODS.map((name) => (
                  <img
                    key={name}
                    src={`${MASCOT_BASE}/uterus-${name}.avif`}
                    alt=""
                    className={name === mood ? "shown" : undefined}
                  />
                ))}
              </span>
            </li>
          )}
          {visibleHeadings.map((heading) => {
            const expandable = collapsible && parentsWithChildren.has(heading.id);
            const isOpen = openGroup === heading.id;
            return (
              <li
                key={heading.id}
                className={[
                  shownActiveId === heading.id ? "active" : null,
                  heading.level >= 3 ? "sub" : null,
                  heading.level === 4 ? "sub-sub" : null,
                  expandable ? "expandable" : null,
                  expandable && isOpen ? "open" : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined}
              >
                <a href={`#${heading.id}`} onClick={(event) => handleClick(event, heading.id)}>
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
