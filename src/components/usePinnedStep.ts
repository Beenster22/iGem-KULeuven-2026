// Generated with Claude Opus 5.5 (Anthropic), 2026-10-05
// Purpose: for a home-page section that stays pinned to the screen while the
// visitor scrolls through several steps (a tall `.home-snap-pin` wrapper with
// a sticky `.home-snap-stage` inside, see App.css): reports which step the
// scroll position is on. Purely derived from the scroll position, so it works
// the same with the wheel jumps of HomeSnapScroll.tsx, touch scrolling or the
// scrollbar.
import { useEffect, useState, type RefObject } from "react";

// How far into the scroll towards a step it already counts as reached: early,
// so the change starts as soon as the visitor moves on rather than half-way
// through the jump.
const REACHED_AT = 0.15;

export function usePinnedStep(
  wrapperRef: RefObject<HTMLElement | null>,
  steps: number,
) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || steps < 2) return;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      // The wrapper is one screen tall plus one stretch of scrolling per
      // further step.
      const stepPx = (wrapper.offsetHeight - window.innerHeight) / (steps - 1);
      if (stepPx <= 0) return;
      const scrolled = -wrapper.getBoundingClientRect().top;
      setStep(
        Math.min(
          steps - 1,
          Math.max(0, Math.floor(scrolled / stepPx + 1 - REACHED_AT)),
        ),
      );
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
    };
  }, [wrapperRef, steps]);

  return step;
}
