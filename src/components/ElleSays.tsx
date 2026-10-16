// Generated with Claude Opus 5 (Anthropic), 2026-10-09
// Purpose: Elle — the team mascot already used in the page index
// (SectionProgress) and on every notebook entry (NotebookEntryMeta) — as a
// character who turns up on a page and says something. Built as one reusable
// component so she can be dropped onto any page that has room for her,
// rather than re-drawn per page.
//
// She idles with a gentle bob and tilt, and her speech bubble is not there on
// load: it arrives after `delay` once she has actually been scrolled into
// view, so the line reads as her speaking up rather than as static caption
// text. Elle herself is decorative (empty alt); the line she says is real
// text in the document, so it is read out and found by search like any other
// sentence. Under prefers-reduced-motion she holds still and the bubble is
// shown immediately.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

// Same artwork as the page index and the notebook entry headers.
const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";

export type ElleMood = "smile" | "happy" | "excited";

interface ElleSaysProps {
  // The line she says. Markdown/JSX both fine — it is rendered as-is.
  children: ReactNode;
  mood?: ElleMood;
  // How big she is. "lg" is the homepage greeting; "md" suits a gap in the
  // middle of a content page and "sm" a narrow column.
  size?: "sm" | "md" | "lg";
  // Which side of the bubble she stands on.
  side?: "left" | "right";
  // Milliseconds after she comes into view before the bubble appears.
  delay?: number;
  // Gives her a magnifying glass to hold, for the "let's have a look" lines.
  glass?: boolean;
  // Centres the whole pair in its container (the usual choice when she is
  // filling empty space rather than sitting beside something).
  center?: boolean;
  // When she is on something that is shown and hidden by script rather than
  // by scrolling — a pinned story step, say — pass whether that thing is
  // currently showing and the delay is counted from the moment it does.
  // Left out, she waits until she is scrolled into view instead.
  active?: boolean;
}

// A magnifying glass for Elle to hold up, sweeping slowly back and forth.
function MagnifyingGlass() {
  return (
    <svg className="elle-glass" viewBox="0 0 48 48" aria-hidden="true">
      <line className="elle-glass-handle" x1="30" y1="30" x2="43" y2="43" />
      <circle className="elle-glass-lens" cx="20" cy="20" r="13" />
      <path className="elle-glass-shine" d="M13 15 a9 9 0 0 1 6 -5" />
    </svg>
  );
}

export function ElleSays({
  children,
  mood = "smile",
  size = "md",
  side = "left",
  delay = 1200,
  glass = false,
  center = false,
  active,
}: ElleSaysProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [speaking, setSpeaking] = useState(false);

  // Driven by a caller that knows when she is on screen (the story steps are
  // stacked on top of each other, so every one of them is "in view" and an
  // observer would start all their timers at once).
  useEffect(() => {
    if (active === undefined) return;
    if (prefersReducedMotion) {
      setSpeaking(true);
      return;
    }
    if (!active) return;
    const timer = window.setTimeout(() => setSpeaking(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay, prefersReducedMotion]);

  // Otherwise: start counting when she is scrolled into view.
  useEffect(() => {
    if (active !== undefined) return;
    if (prefersReducedMotion) {
      setSpeaking(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Once she has spoken she stays spoken — the line should not vanish
        // when the reader scrolls back past her.
        timer = window.setTimeout(() => setSpeaking(true), delay);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [active, delay, prefersReducedMotion]);

  const classes = [
    "elle",
    `elle--${size}`,
    `elle--${side}`,
    center ? "elle--center" : null,
    speaking ? "elle--speaking" : null,
    prefersReducedMotion ? "elle--still" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} ref={ref}>
      <div className="elle-figure">
        <img
          className="elle-mascot"
          src={`${MASCOT_BASE}/uterus-${mood}.avif`}
          alt=""
          loading="lazy"
        />
        {glass && <MagnifyingGlass />}
      </div>
      <p className="elle-bubble">{children}</p>
    </div>
  );
}
