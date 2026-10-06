// Generated with Claude Sonnet 5 (Anthropic), 2026-07-13 (reworked 2026-07-28, 2026-09-04)
// Reworked with Claude Opus 5.5 (Anthropic), 2026-10-06: the DNA strand and
// per-section dots are replaced by the team mascot, which hops along the
// list to whichever section is currently being read.
// Purpose: page-wide left-hand index tracking scroll position through
// sections, with always-visible titles and the mascot marking the current
// one. Scans the rendered page for h2/h3 directly (content pages compose
// several PageLayout blocks, so headings can't be read off any single
// block's props) and re-scans whenever the route changes. h3s are tracked as
// subsections and rendered indented (see the "sub" class in App.css) so the
// hierarchy reads at a glance.
import { MouseEvent, RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { stringToSlug } from "../utils/stringToSlug";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

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
    return { id: slug, text, level };
  });
}

// A boxed left-hand rail, one row per section, with the mascot sitting next
// to the current section. Titles are always visible (no hover-to-reveal), so
// the box reserves real layout space.
export function SectionProgress({ containerRef }: SectionProgressProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  // Vertical center of the active row within the list, in px; null until
  // measured so the mascot first appears in place instead of sliding in.
  const [mascotY, setMascotY] = useState<number | null>(null);
  const [travelling, setTravelling] = useState(false);

  // Page content changes on navigation, so re-scan whenever the route does.
  // The DOM is already committed by the time this effect runs, so the scan
  // can happen synchronously without waiting on a paint/animation frame.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const found = collectHeadings(container);
    setHeadings(found);

    // Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
    // Purpose: heading ids only exist once the scan above has run, so a
    // link from another page to /page#section can't be resolved by the
    // browser on its own — jump to the requested section here instead.
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if (hashId) document.getElementById(hashId)?.scrollIntoView({ block: "start" });
    const target = found.find((heading) => heading.id === hashId);
    setActiveId(target?.id ?? found[0]?.id ?? "");
  }, [containerRef, location.pathname]);

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
  }, [headings, activeId]);

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
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  if (headings.length < 2) return null;

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
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={[
                activeId === heading.id ? "active" : null,
                heading.level === 3 ? "sub" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined}
            >
              <a href={`#${heading.id}`} onClick={(event) => handleClick(event, heading.id)}>
                <span className="section-progress-label">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
