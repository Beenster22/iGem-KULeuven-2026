// Generated with Claude Opus 5.5 (Anthropic), 2026-10-14
// Purpose: full-text search over every content page, opened from the navbar
// button or with Ctrl/Cmd+K (or "/"). The index is built at build time by
// src/search/searchIndexPlugin.ts and only downloaded the first time the
// dialog opens. Results link to the matching heading; a heading inside a
// closed dropdown (protocols, notebook) is reached by opening the dropdown.
import { FC, KeyboardEvent as ReactKeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPathMapping, stringToSlug } from "../utils";
import type { SearchSection } from "../search/searchIndexPlugin";

interface Entry extends SearchSection {
  path: string;
  pageTitle: string;
  haystack: string;
}

interface Result {
  entry: Entry;
  score: number;
}

const MAX_RESULTS = 30;
// How long to keep looking for a heading after navigating: ids are assigned
// by SectionProgress once the page renders, and opened dropdowns render
// their content a moment later.
const JUMP_TIMEOUT_MS = 2000;
const JUMP_POLL_MS = 50;
// Room left above a heading for the fixed navbar (matches the 5rem
// scroll-margin-top headings get in App.css).
const NAVBAR_OFFSET_PX = 80;

let indexPromise: Promise<Entry[]> | null = null;

function loadIndex(): Promise<Entry[]> {
  indexPromise ??= import("virtual:search-index").then(({ default: pages }) => {
    const pathByComponent = new Map<FC, { path: string; title: string; lead: string }>();
    for (const [path, page] of Object.entries(getPathMapping())) {
      pathByComponent.set(page.component, { path, title: page.title ?? "", lead: page.lead ?? "" });
    }
    const entries: Entry[] = [];
    for (const { component, sections: pageSections } of pages) {
      let sections = pageSections;
      const page = pathByComponent.get(component);
      if (!page) continue; // a content file that isn't routed in pages.ts
      const intro = sections.find((section) => !section.heading);
      // The page itself is always a result, with its lead as the text when
      // it has no introduction of its own.
      if (!intro) sections = [{ heading: "", trail: [], anchors: [], text: page.lead }, ...sections];
      for (const section of sections) {
        const text = section.heading ? section.text : `${page.lead} ${section.text}`.trim();
        entries.push({
          ...section,
          text,
          path: page.path,
          pageTitle: page.title,
          haystack: `${page.title} ${section.trail.join(" ")} ${section.heading} ${text}`.toLowerCase(),
        });
      }
    }
    return entries;
  });
  return indexPromise;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function search(entries: Entry[], query: string): Result[] {
  const phrase = query.trim().toLowerCase();
  const terms = phrase.split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const results: Result[] = [];
  for (const entry of entries) {
    if (!terms.every((term) => entry.haystack.includes(term))) continue;
    const heading = entry.heading.toLowerCase();
    const title = entry.pageTitle.toLowerCase();
    const trail = entry.trail.join(" ").toLowerCase();
    const text = entry.text.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (heading.includes(term)) score += 10;
      if (title.includes(term)) score += 4;
      if (trail.includes(term)) score += 3;
      score += Math.min(text.split(term).length - 1, 5);
    }
    if (terms.length > 1 && entry.haystack.includes(phrase)) score += 8;
    if (!entry.heading) score += 1; // the page itself, ahead of an equal section
    results.push({ entry, score });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
}

function highlight(text: string, terms: string[]): ReactNode[] {
  if (!terms.length) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text
    .split(pattern)
    .map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

// A short excerpt of the text around the first match.
function snippet(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  const hits = terms.map((term) => lower.indexOf(term)).filter((i) => i !== -1);
  const at = hits.length ? Math.min(...hits) : 0;
  let start = Math.max(0, at - 60);
  let end = Math.min(text.length, at + 140);
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  if (end < text.length) end = text.lastIndexOf(" ", end) || end;
  return `${start > 0 ? "… " : ""}${text.slice(start, end)}${end < text.length ? " …" : ""}`;
}

// Finds the most specific anchor present on the page. Each anchor is looked
// up inside the dropdown / "## " section of the one before it, since
// headings like "Materials" repeat in every protocol. Headings are matched by
// the slug of their text (the same slug SectionProgress turns into their id)
// so a heading that has just appeared can be found before it is given an id.
function resolveAnchor(anchors: string[]): { element: Element; index: number } | null {
  let scope: ParentNode = document;
  let found: { element: Element; index: number } | null = null;
  for (let index = anchors.length - 1; index >= 0; index--) {
    const slug = anchors[index];
    const element = Array.from(scope.querySelectorAll("h1, h2, h3, h4, h5, h6")).find(
      (heading) => stringToSlug((heading.textContent || "").trim()) === slug,
    );
    if (!element) break;
    found = { element, index };
    scope = element.closest(".expandable-container, .notebook-section, .content-section") ?? scope;
  }
  return found;
}

// Scrolls to the most specific anchor that exists, opening closed dropdowns
// along the way, until the first anchor is reached or time runs out.
function jumpTo(anchors: string[]) {
  if (!anchors.length) {
    window.scrollTo({ top: 0 });
    return;
  }
  const deadline = performance.now() + JUMP_TIMEOUT_MS;
  let scrolledTo: Element | null = null;
  const opened = new Set<Element>();
  const step = () => {
    const found = resolveAnchor(anchors);
    if (found) {
      const toggle = found.element.closest(".expandable-header, .notebook-section-header");
      // Each toggle is clicked once at most, so a dropdown that hasn't
      // re-rendered yet by the next check isn't toggled shut again.
      if (toggle && !opened.has(toggle) && toggle.getAttribute("aria-expanded") === "false") {
        opened.add(toggle);
        (toggle as HTMLElement).click();
      }
      if (found.element !== scrolledTo) {
        // Instant, not smooth: each step (dropdown, then the heading inside
        // it) would otherwise cancel the previous step's scroll animation.
        const top = found.element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX;
        window.scrollTo({ top, behavior: "instant" });
        scrolledTo = found.element;
      }
      if (found.index === 0) return;
    }
    if (performance.now() < deadline) setTimeout(step, JUMP_POLL_MS);
  };
  setTimeout(step, JUMP_POLL_MS);
}

export function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        className="navbar-search-button"
        onClick={() => setOpen(true)}
        aria-label="Search the wiki (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
    loadIndex().then(setEntries);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const terms = useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const results = useMemo(() => (entries ? search(entries, query) : []), [entries, query]);

  useEffect(() => setSelected(0), [query]);
  useEffect(() => {
    listRef.current?.children[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const go = (entry: Entry) => {
    onClose();
    const hash = entry.anchors[0] ? `#${entry.anchors[0]}` : "";
    if (entry.path !== location.pathname || hash !== location.hash) {
      navigate(`${entry.path}${hash}`);
    }
    jumpTo(entry.anchors);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[selected]) {
      event.preventDefault();
      go(results[selected].entry);
    }
  };

  return (
    <div className="search-backdrop" onMouseDown={onClose}>
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search the wiki"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="search-input-row">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder="Search pages, protocols, notebook…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results.length ? `search-result-${selected}` : undefined}
          />
          <kbd className="search-esc" onClick={onClose}>
            Esc
          </kbd>
        </div>

        {query.trim() && (
          <div className="search-body">
            {!entries ? (
              <p className="search-status">Loading…</p>
            ) : results.length === 0 ? (
              <p className="search-status">No results for “{query.trim()}”.</p>
            ) : (
              <ul id="search-results" ref={listRef} className="search-results" role="listbox">
                {results.map(({ entry }, i) => (
                  <li
                    key={`${entry.path}-${entry.anchors[0] ?? ""}-${i}`}
                    id={`search-result-${i}`}
                    role="option"
                    aria-selected={i === selected}
                    className={`search-result ${i === selected ? "selected" : ""}`}
                    onMouseMove={() => setSelected(i)}
                    onClick={() => go(entry)}
                  >
                    <span className="search-result-path">
                      <span className="search-result-trail">
                        {[entry.pageTitle, ...entry.trail].join(" › ")}
                        {entry.heading && " › "}
                      </span>
                      {entry.heading && highlight(entry.heading, terms)}
                    </span>
                    {entry.text && (
                      <span className="search-result-snippet">
                        {highlight(snippet(entry.text, terms), terms)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
