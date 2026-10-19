// Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team request)
// Purpose: the home page's last hand-off — what the magnifying glass is
// showing on the gut ("quest" step, StoryScrollSection.tsx) becomes the
// circle of bacteria on the screen below it (TwoGutsSection.tsx). As that
// screen scrolls in, a stand-in lens travels from the glass to where the
// circle comes to rest, growing to its size, and its close-up of the
// microbes fades into the drawn bacteria as it arrives. Tied to the scroll
// position, so scrolling back up plays it the other way.
//
// Modelled on useLineToGlobe.ts, which hands the counter's underline over
// to the globe the same way.
import { useEffect, type RefObject } from "react";

/** The circle on the screen below, and the screen it belongs to. */
const WINDOW_STAGE = ".two-guts";
const WINDOW_CIRCLE = ".two-guts-lens-bg";

// Scroll progress (0 = the next screen's top at the bottom of the window,
// 1 = it has reached the top) by which the hand-over is done.
const CLOSED_AT = 0.8;
// The microbes give way to the drawn bacteria over the last of the journey.
const FADE_FROM = 0.55;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function useLensToGutWindow({
  lensRef,
  skip,
}: {
  /** The magnifying glass's round face (.quest-lens-glass). */
  lensRef: RefObject<HTMLElement | null>;
  skip: boolean;
}) {
  useEffect(() => {
    const glass = lensRef.current;
    if (!glass || skip) return;
    // The whole glass, handle and all, steps aside while the stand-in flies.
    const magnifier = glass.closest<HTMLElement>(".quest-lens") ?? glass;

    const overlay = document.createElement("div");
    overlay.className = "lens-to-window";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="quest-lens-glass">' +
      '<div class="quest-lens-drift"><div class="quest-lens-spin">' +
      '<img class="quest-lens-view" alt="" />' +
      "</div></div></div>";
    const spin = overlay.querySelector<HTMLElement>(".quest-lens-spin");
    const view = overlay.querySelector<HTMLImageElement>(".quest-lens-view");
    document.body.appendChild(overlay);

    let frame: number | null = null;
    let flying = false;

    const rest = () => {
      overlay.style.visibility = "hidden";
      magnifier.style.visibility = "";
      flying = false;
    };

    const update = () => {
      frame = null;
      const stage = document.querySelector<HTMLElement>(WINDOW_STAGE);
      const target = stage?.querySelector<SVGGraphicsElement>(WINDOW_CIRCLE);
      const pin = stage?.closest<HTMLElement>(".home-snap-pin");
      if (!stage || !target || !pin) return rest();

      const g = clamp01(1 - pin.getBoundingClientRect().top / window.innerHeight);
      if (g <= 0) {
        // Not there yet: the glass is the reader's own, the circle is itself.
        stage.style.removeProperty("--window-in");
        return rest();
      }
      if (g >= CLOSED_AT) {
        // Arrived: the circle has taken over.
        stage.style.setProperty("--window-in", "1");
        return rest();
      }

      const from = glass.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      if (!from.width || !to.width) return rest();

      // Freeze the patch of the microbes the glass was showing, so the
      // stand-in starts as exactly what was under the lens.
      if (!flying) {
        flying = true;
        const liveSpin = glass.querySelector<HTMLElement>(".quest-lens-spin");
        const liveView = glass.querySelector<HTMLImageElement>(".quest-lens-view");
        if (spin && liveSpin) spin.style.rotate = getComputedStyle(liveSpin).rotate;
        if (view && liveView) {
          view.src = liveView.currentSrc || liveView.src;
          view.style.translate = getComputedStyle(liveView).translate;
        }
      }

      const e = easeInOut(g / CLOSED_AT);
      const size = lerp(from.width, to.width, e);
      // Explicit: the stylesheet keeps it hidden while it is not flying.
      overlay.style.visibility = "visible";
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;
      overlay.style.transform = `translate(${lerp(
        from.left + from.width / 2,
        to.left + to.width / 2,
        e,
      ) - size / 2}px, ${lerp(
        from.top + from.height / 2,
        to.top + to.height / 2,
        e,
      ) - size / 2}px)`;
      // The microbes hand over to the drawn bacteria on the way in.
      const swap = clamp01((g / CLOSED_AT - FADE_FROM) / (1 - FADE_FROM));
      overlay.style.opacity = String(1 - swap);
      stage.style.setProperty("--window-in", String(swap));
      magnifier.style.visibility = "hidden";
    };

    // Replaces any frame still waiting rather than skipping: a frame asked
    // for while the tab was in the background never runs, and skipping on
    // that would leave the hand-over stuck once the reader came back.
    const onScroll = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      document
        .querySelector<HTMLElement>(WINDOW_STAGE)
        ?.style.removeProperty("--window-in");
      magnifier.style.visibility = "";
      overlay.remove();
    };
  }, [lensRef, skip]);
}
