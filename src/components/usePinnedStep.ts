// Generated with Claude Opus 5.5 (Anthropic), 2026-10-05
// Purpose: for a home-page section that stays pinned to the screen while the
// visitor scrolls through several steps (a tall `.home-snap-pin` wrapper with
// a sticky `.home-snap-stage` inside, see App.css): reports which step the
// scroll position is on. Purely derived from the scroll position, so it works
// the same with the wheel, touch scrolling or the scrollbar.
import { useEffect, useState, type RefObject } from "react";

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15 (team feedback: too
// easy to scroll straight past a step): every step, the last one included,
// now has its own full stretch of scrolling (the wrapper is one screen tall
// plus one stretch per step, see .home-snap-pin in App.css), and the step
// changes just before the scroll reaches the next one's stop.
const EARLY = 0.1;

// Edited with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request: once
// everything on a screen is showing, two scrolls to get to the next): by
// default the last step is now held for one extra step, which with its own
// makes two (--snap-extra on .home-snap-pin in App.css). The wrapper's
// own --snap-extra is read, so this always matches its height.
export const SNAP_HOLD = 1;

function wrapperExtra(wrapper: HTMLElement) {
  const value = parseFloat(
    getComputedStyle(wrapper).getPropertyValue("--snap-extra"),
  );
  return Number.isFinite(value) ? value : SNAP_HOLD;
}

export function usePinnedStep(
  wrapperRef: RefObject<HTMLElement | null>,
  steps: number,
  // Extra steps' worth of scrolling the last step is held for (--snap-extra
  // on the wrapper). Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20.
  // Left out, it is read from the wrapper.
  extra?: number,
) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || steps < 2) return;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const stepPx =
        (wrapper.offsetHeight - window.innerHeight) /
        (steps + (extra ?? wrapperExtra(wrapper)));
      if (stepPx <= 0) return;
      const scrolled = -wrapper.getBoundingClientRect().top;
      setStep(
        Math.min(
          steps - 1,
          Math.max(0, Math.floor(scrolled / stepPx + EARLY)),
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
  }, [wrapperRef, steps, extra]);

  return step;
}
