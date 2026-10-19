// Generated with Claude Opus 5 (Anthropic), 2026-10-19 (team request)
// Purpose: the home page's last hand-off — the magnifying glass on the gut
// ("quest" step, StoryScrollSection.tsx) becomes the circle of bacteria on
// the screen below it (TwoGutsSection.tsx). As that screen scrolls in, a
// stand-in copy of the glass travels down to where the circle comes to
// rest, growing to its size; the glass steps aside while it flies and the
// circle waits until it arrives. Tied to the scroll position, so scrolling
// back up plays it the other way.
//
// Edited with Claude Opus 5 (Anthropic), 2026-10-19 (team request: make it
// quicker): the glass already shows that same circle by its last stop (see
// .quest-lens-circle in App.css), so there is nothing to cross-fade — the
// hand-over is pure movement, and the circle simply takes over on arrival.
// The stand-in is a copy of the glass as it stands, frozen, so it sets off
// as exactly what the reader was looking at even mid-tour.
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
    document.body.appendChild(overlay);

    let frame: number | null = null;
    let flying = false;

    const rest = () => {
      overlay.style.visibility = "hidden";
      magnifier.style.visibility = "";
      flying = false;
    };

    // A copy of the glass exactly as it looks now: its layers' opacities and
    // the patch of the microbes under it are driven by animations, which a
    // plain clone would restart, so they are written in as plain styles.
    const takeCopy = () => {
      const copy = glass.cloneNode(true) as HTMLElement;
      copy.style.position = "absolute";
      copy.style.inset = "0";
      const freeze = (selector: string, properties: string[]) => {
        const live = glass.querySelector(selector);
        const made = copy.querySelector<HTMLElement>(selector);
        if (!live || !made) return;
        const now = getComputedStyle(live);
        made.style.animation = "none";
        for (const property of properties) {
          made.style.setProperty(property, now.getPropertyValue(property));
        }
      };
      freeze(".quest-lens-photo", ["opacity"]);
      freeze(".quest-lens-circle", ["opacity"]);
      freeze(".quest-lens-drift", ["translate", "rotate"]);
      freeze(".quest-lens-spin", ["rotate"]);
      freeze(".quest-lens-view", ["translate"]);
      // The copied circle brings a clip path whose name is already in use.
      const clip = copy.querySelector("clipPath");
      if (clip) {
        const name = `${clip.id}-copy`;
        copy.querySelectorAll("[clip-path]").forEach((node) => {
          node.setAttribute("clip-path", `url(#${name})`);
        });
        clip.id = name;
      }
      overlay.replaceChildren(copy);
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

      if (!flying) {
        flying = true;
        takeCopy();
      }

      const e = easeInOut(g / CLOSED_AT);
      const size = lerp(from.width, to.width, e);
      const x = lerp(from.left + from.width / 2, to.left + to.width / 2, e);
      const y = lerp(from.top + from.height / 2, to.top + to.height / 2, e);
      // Explicit: the stylesheet keeps it hidden while it is not flying.
      overlay.style.visibility = "visible";
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;
      overlay.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      // Nothing to cross-fade: the circle below simply waits its turn.
      stage.style.setProperty("--window-in", "0");
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
