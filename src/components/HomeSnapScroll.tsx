// Generated with Claude Opus 5.5 (Anthropic), 2026-10-05
// Purpose: makes the home page read as separate full-screen sections. Every
// element marked `data-snap` is a stop; a small scroll of the wheel (or an
// arrow / Page / space key) glides the page to the next or previous stop
// instead of scrolling freely, so each section is seen on its own. Below the
// last stop (references, footer) and inside a section taller than the screen
// the page scrolls normally. Touch devices keep native scrolling with gentle
// CSS snapping (see HOME SNAP SECTIONS in App.css), and nothing is taken over
// under prefers-reduced-motion.
import { useEffect, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

// Glide to another section, and the shorter one between the steps of a
// pinned section (where the page itself does not appear to move).
const JUMP_MS = 850;
const STEP_MS = 500;
// Wheel movement (px) that counts as "the visitor wants to move on".
const WHEEL_THRESHOLD = 50;
// After a glide, wheel events closer together than this are the tail of the
// same trackpad swipe and must not trigger another one.
const QUIET_MS = 110;

interface Stop {
  y: number;
  step: boolean;
}

function getStops(): Stop[] {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight + 2;
  const stops: Stop[] = [{ y: 0, step: false }];
  document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
    const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
    if (y <= maxScroll) stops.push({ y, step: el.dataset.snap === "step" });
  });
  return stops.sort((a, b) => a.y - b.y);
}

// Where a move in `dir` should glide to, or null to leave the scrolling to
// the browser. `nativeStep` is how far the browser would scroll by itself.
function pickTarget(dir: number, nativeStep: number) {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const stops = getStops();

  if (dir > 0) {
    const next = stops.find((stop) => stop.y > y + 2);
    // Past the last section, or the rest of this one is still off screen.
    if (!next || next.y - y > vh + 4) return null;
    return { y: next.y, ms: next.step ? STEP_MS : JUMP_MS };
  }

  // Still below the last section after this scroll: nothing to snap to yet.
  if (y - nativeStep > stops[stops.length - 1].y) return null;
  let index = -1;
  for (let i = stops.length - 1; i >= 0; i--) {
    if (stops[i].y < y - 2) {
      index = i;
      break;
    }
  }
  if (index < 0 || y - stops[index].y > vh + 4) return null;
  return {
    y: stops[index].y,
    ms: stops[index + 1]?.step ? STEP_MS : JUMP_MS,
  };
}

export function HomeSnapScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    document.documentElement.classList.add("home-snap");

    let animating = false;
    let settling = false;
    let frame = 0;
    let lastWheel = 0;
    let accumulated = 0;

    const glideTo = (to: number, ms: number) => {
      const from = window.scrollY;
      const start = performance.now();
      animating = true;
      const tick = (now: number) => {
        // Clamped at 0 too: a frame's timestamp can predate `start`.
        const t = Math.min(1, Math.max(0, (now - start) / ms));
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // "instant": Bootstrap makes scrolling smooth by default, which would
        // animate every frame of this animation a second time.
        window.scrollTo({
          top: from + (to - from) * eased,
          behavior: "instant",
        });
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          animating = false;
          settling = true;
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (animating) {
        event.preventDefault();
        return;
      }
      if (settling) {
        if (gap < QUIET_MS) {
          event.preventDefault();
          return;
        }
        settling = false;
      }

      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? innerHeight : 1);
      const dir = Math.sign(delta);
      if (!dir) return;
      const target = pickTarget(dir, Math.abs(delta));
      if (!target) {
        accumulated = 0;
        return;
      }
      event.preventDefault();
      if (gap > 200 || Math.sign(accumulated) !== dir) accumulated = 0;
      accumulated += delta;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;
      accumulated = 0;
      glideTo(target.y, target.ms);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }
      // Leave the keys alone wherever they already do something (the
      // inflammation slider, buttons, links).
      const target = event.target as HTMLElement | null;
      if (
        target?.closest?.(
          "input, textarea, select, button, a, summary, [contenteditable]",
        )
      ) {
        return;
      }
      let dir = 0;
      let nativeStep = 40;
      switch (event.key) {
        case "ArrowDown":
          dir = 1;
          break;
        case "ArrowUp":
          dir = -1;
          break;
        case "PageDown":
          dir = 1;
          nativeStep = window.innerHeight;
          break;
        case "PageUp":
          dir = -1;
          nativeStep = window.innerHeight;
          break;
        case " ":
          dir = event.shiftKey ? -1 : 1;
          nativeStep = window.innerHeight;
          break;
        default:
          return;
      }
      if (animating) {
        event.preventDefault();
        return;
      }
      const goal = pickTarget(dir, nativeStep);
      if (!goal) return;
      event.preventDefault();
      glideTo(goal.y, goal.ms);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("home-snap");
    };
  }, [prefersReducedMotion]);

  return null;
}

// The stops of a pinned section: one invisible marker per step, spaced down
// its tall `.home-snap-pin` wrapper (which needs `--snap-steps` set to the
// same number). The first is an ordinary section stop, the rest are steps.
export function SnapSteps({ steps }: { steps: number }) {
  return (
    <>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          className="home-snap-marker"
          data-snap={i === 0 ? "" : "step"}
          style={{ "--i": i } as CSSProperties}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
