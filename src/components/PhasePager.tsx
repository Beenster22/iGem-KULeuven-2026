// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-16
// Purpose: turns a long content page into one-section-at-a-time "chapters".
// Rendered once near the top of a page (src/contents/entrepreneurship.mdx),
// it finds the page's boxed "## " sections (see src/mdx/rehypeSections.ts),
// shows only one of them, and adds Previous / Next buttons at the bottom of
// each so a reader works through the page phase by phase instead of one
// endless scroll. The hidden sections stay in the DOM, so the left-hand
// section index still lists every phase.
//
// Anything that points at a heading inside a hidden section — a click in the
// index (which dispatches "reveal-section", see SectionProgress.tsx), an
// in-page #link, or a #hash in the address bar — first reveals the section
// that holds it.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { RESTORING_ATTR } from "./useScrollMemory";

interface Slot {
  slot: HTMLElement;
  title: string;
}

export function PhasePager({
  nextPage,
}: {
  // Shown instead of nothing after the page's last section, so a reader who
  // works through the whole page phase by phase lands on the next page in
  // the wiki's reading order rather than a dead end (team feedback).
  nextPage?: { to: string; label: string };
}) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [active, setActive] = useState(0);

  const show = useCallback((index: number) => {
    sectionsRef.current.forEach((section, i) => {
      section.hidden = i !== index;
    });
    setActive(index);
    // Lets the section index re-pick the current heading right away.
    window.dispatchEvent(new Event("scroll"));
  }, []);

  const reveal = useCallback(
    (id: string) => {
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      const index = sectionsRef.current.findIndex((section) => section.contains(target));
      if (index >= 0 && sectionsRef.current[index].hidden) show(index);
    },
    [show],
  );

  useEffect(() => {
    const container = markerRef.current?.parentElement;
    if (!container) return;

    const sections = Array.from(container.children).filter((child): child is HTMLElement =>
      child.matches("section.content-section"),
    );
    if (sections.length < 2) return;
    sectionsRef.current = sections;

    const created = sections.map((section) => {
      const slot = document.createElement("div");
      slot.className = "phase-nav";
      section.appendChild(slot);
      return { slot, title: section.querySelector("h2")?.textContent?.trim() ?? "" };
    });
    setSlots(created);
    show(0);

    // Headings only get their ids once the section index has scanned the page,
    // so a #hash from the address bar may need a while to resolve (a page opened
    // from a link elsewhere on the site renders slower than a reload).
    const hash = decodeURIComponent(window.location.hash.slice(1));
    let tries = 0;
    let frame = 0;
    const revealHash = () => {
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        reveal(hash);
        // A return with the back button puts the reader back where they
        // were instead (useScrollMemory), so the jump to the #hash waits out.
        if (!document.documentElement.hasAttribute(RESTORING_ATTR)) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
        }
      } else if (hash && tries++ < 120) {
        frame = window.setTimeout(revealHash, 16);
      }
    };
    if (hash) frame = window.setTimeout(revealHash, 16);

    const onReveal = (event: Event) => reveal((event as CustomEvent<string>).detail);
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href^='#']");
      const id = link?.getAttribute("href")?.slice(1);
      if (id) reveal(decodeURIComponent(id));
    };
    const onHashChange = () => reveal(decodeURIComponent(window.location.hash.slice(1)));

    window.addEventListener("reveal-section", onReveal);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(frame);
      window.removeEventListener("reveal-section", onReveal);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
      created.forEach(({ slot }) => slot.remove());
      sections.forEach((section) => {
        section.hidden = false;
      });
      setSlots([]);
    };
  }, [reveal, show]);

  function go(index: number) {
    show(index);
    const section = sectionsRef.current[index];
    const heading = section?.querySelector("h2");
    // history.state kept for useScrollMemory (the router's key for this visit).
    if (heading?.id) history.replaceState(history.state, "", `#${heading.id}`);
    section?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <span ref={markerRef} hidden data-phase-pager />
      {slots.map(({ slot }, index) =>
        createPortal(
          <>
            {index > 0 ? (
              <button
                type="button"
                className="btn-empower phase-nav-btn"
                onClick={() => go(index - 1)}
              >
                <span aria-hidden="true">←</span> Previous: {slots[index - 1].title}
              </button>
            ) : (
              <span />
            )}
            {index < slots.length - 1 ? (
              <button
                type="button"
                className="btn-empower phase-nav-btn phase-nav-next"
                onClick={() => go(index + 1)}
              >
                Next: {slots[index + 1].title} <span aria-hidden="true">→</span>
              </button>
            ) : (
              nextPage && (
                <Link to={nextPage.to} className="btn-empower phase-nav-btn phase-nav-next">
                  Next: {nextPage.label} <span aria-hidden="true">→</span>
                </Link>
              )
            )}
          </>,
          slot,
          String(index),
        ),
      )}
      <span hidden data-active-phase={active} />
    </>
  );
}
