// Generated with Claude Opus 5.5 (Anthropic), 2026-10-05
// Edited with Claude Opus 5 (Anthropic), 2026-10-11 (team feedback: the page
// was hard to move around in): the wheel and the arrow keys are no longer
// taken over, so the home page scrolls continuously like any other page and
// comes to rest wherever it is left. All that is left here is the
// `home-snap` class, which on touch screens turns on the browser's own
// "proximity" snapping onto the `data-snap` stops (see HOME SNAP SECTIONS in
// App.css — it is deliberately not used on pointer devices, where the stops
// sit close enough together to trap the wheel). Nothing snaps under
// prefers-reduced-motion.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request: two
// scrolls on every screen once everything on it is showing, with the
// bacteria in the background coming towards the reader meanwhile): see
// SnapHold and useBackdropApproach below. And (team request, the same day)
// soft white swooshes sweep left to right across the page while it is
// scrolled, and a gut-wall border sweeps across a pinned screen when it
// moves on to its next part (StepBorder).
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export function HomeSnapScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    document.documentElement.classList.add("home-snap");
    return () => {
      document.documentElement.classList.remove("home-snap");
    };
  }, [prefersReducedMotion]);

  // Also drives the swooshes, which are drawn in the bands' own backgrounds
  // (see .page-body--home .home-section in App.css).
  useBackdropApproach(!!prefersReducedMotion);

  return null;
}

// A border passing over a pinned screen as it moves on to its next part, as
// if the reader were scrolling past the edge between two sections: up the
// screen going forwards, down it going back. Put it in the screen's stage
// with the index of the part showing.
export function StepBorder({ step }: { step: number }) {
  const [seen, setSeen] = useState(step);
  const [pass, setPass] = useState<{ n: number; up: boolean } | null>(null);
  if (step !== seen) {
    setSeen(step);
    setPass({ n: (pass?.n ?? 0) + 1, up: step > seen });
  }
  if (!pass) return null;
  return (
    <div
      key={pass.n}
      className={`home-step-border home-step-border--${pass.up ? "up" : "down"}`}
      aria-hidden="true"
    />
  );
}

// The stops of a pinned section: one invisible marker per step, spaced down
// its tall `.home-snap-pin` wrapper (which needs `--snap-steps` set to the
// same number). The first marks the section itself, the rest its steps; both
// are places the page may settle on.
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

// A screen that shows everything at once (no steps of its own), pinned
// like the stepped ones so the reader scrolls twice before the next screen
// comes up: one step, held for one more (--snap-extra, see .home-snap-pin).
// Wrap it round the screen in home.mdx. Without motion it is just the
// screen.
export function SnapHold({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <>{children}</>;
  return (
    <div
      className="home-snap-pin home-snap-hold"
      style={{ "--snap-steps": 1 } as CSSProperties}
    >
      <SnapSteps steps={1} />
      <div className="home-snap-stage">{children}</div>
    </div>
  );
}

// The faint bacteria behind each band (MicrobeBackdrop.tsx) travel as the
// reader scrolls through it: each backdrop gets --approach, 0 as its
// stretch of page comes up from the bottom of the window and 1 as it leaves
// at the top, and the items sweep across with it (see MICROBE BACKDROP in
// App.css). The stretch is the band, or the pinned screen the backdrop is
// held in, so the bacteria keep moving while the words stand still.
// Edited 2026-10-20 (team request: a whoosh, as if passing through the
// gut): <html> also gets --whoosh, the scrolling speed from -1 (up) to 1
// (down), which falls back to 0 when the scrolling stops; the bacteria
// streak with it.
// How fast (px per ms) counts as full speed.
const WHOOSH_FULL = 3;
// How long after the last scroll the whoosh starts to die away (ms).
const WHOOSH_SETTLE = 120;

function useBackdropApproach(skip: boolean) {
  useEffect(() => {
    if (skip) return;
    let frame: number | null = null;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let settle: number | undefined;
    const root = document.documentElement;

    const whoosh = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const speed = (window.scrollY - lastY) / dt / WHOOSH_FULL;
        root.style.setProperty(
          "--whoosh",
          Math.max(-1, Math.min(1, speed)).toFixed(3),
        );
      }
      lastY = window.scrollY;
      lastTime = now;
      // How far the swooshes have travelled: with the page, left to right.
      root.style.setProperty("--sweep", window.scrollY.toFixed(0));
      window.clearTimeout(settle);
      settle = window.setTimeout(
        () => root.style.setProperty("--whoosh", "0"),
        WHOOSH_SETTLE,
      );
    };

    const update = () => {
      frame = null;
      whoosh();
      const vh = window.innerHeight;
      document
        .querySelectorAll<HTMLElement>(".microbe-backdrop")
        .forEach((backdrop) => {
          const held = backdrop.closest(".home-snap-stage");
          const stretch =
            (held && backdrop.closest<HTMLElement>(".home-snap-pin")) ||
            backdrop.parentElement;
          if (!stretch) return;
          const box = stretch.getBoundingClientRect();
          if (box.bottom < -vh || box.top > 2 * vh) return;
          const approach = Math.min(
            1,
            Math.max(0, (vh - box.top) / (box.height + vh)),
          );
          backdrop.style.setProperty("--approach", approach.toFixed(4));
        });
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      root.style.removeProperty("--whoosh");
      root.style.removeProperty("--sweep");
    };
  }, [skip]);
}
