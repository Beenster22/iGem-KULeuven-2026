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
// scrolled. (A gut-wall border that swept across a pinned screen when it
// moved on to its next part was taken out the same day, team request: no
// horizontal gut borders but the one into the footer.)
import {
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { GLIDE, markScrollBusy, scrollBusy } from "./scrollGlide";
import { MicrobeBackdrop } from "./MicrobeBackdrop";

export function HomeSnapScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    document.documentElement.classList.add("home-snap");
    return () => {
      document.documentElement.classList.remove("home-snap");
    };
  }, [prefersReducedMotion]);

  useBackdropApproach(!!prefersReducedMotion);
  useWheelPaging(!!prefersReducedMotion);

  // The background of bacteria and swooshes behind every band (edited
  // 2026-10-21: one layer for the whole page instead of one per band).
  return <MicrobeBackdrop />;
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request: all
// the transitions smoother). Nearly everything that moves on this page is
// tied to how far it has been scrolled, and a mouse wheel moves the page in
// jumps of about 100px a notch, so every one of those moved in jumps too.
// Edited the same day (team request: once a screen is showing, the next
// scroll goes straight on to the next thing, smoothly): with a mouse or
// touchpad, each turn of the wheel now glides the page to the next stop —
// the `data-snap` markers at the top of every screen and every step of a
// pinned one — or, scrolling up, back to the one before, so everything
// tied to the scroll plays through on the way. The rest of a turn (a
// touchpad's coasting included) is let go until the wheel has been still
// for a moment, so one turn never skips a screen. Not on touch screens
// (their own scrolling is smooth already, and snaps), not with the zoom
// gesture (ctrl + wheel), not inside a box that scrolls on its own, and not
// while one of the page's own glides is moving it (scrollBusy, see
// scrollGlide.ts). The scrollbar and the keys still scroll freely.
// Edited 2026-10-21 (team request: three scrolls on every screen before
// the next one, with the background moving every time): going down, when
// the next stop is the start of the next screen (rather than the next step
// of this one), the first two turns of the wheel hold the page still while
// the bacteria and swooshes behind it carry on (nudgeBackdrop), and the
// third moves on. Not on the opening video: the first turn leaves it.
// Turns of the wheel, once on a screen, that it takes to leave it.
const TURNS_TO_LEAVE = 3;
// How far a held turn carries the background on (screens), and how long:
// about as far and as fast as a glide to the next screen, so it looks the
// same every time.
const NUDGE_SCREENS = 1;
const NUDGE_MS = 900;

// How long a glide takes: a base, plus a little more the further it goes.
const GLIDE_BASE_MS = 650;
const GLIDE_PER_SCREEN_MS = 250;
const GLIDE_MAX_MS = 1300;
// How long the wheel must be still before the next turn counts as a new one.
const TURN_GAP_MS = 180;
// Stops closer than this to where the page is count as where it is.
const NEAR_PX = 6;

function scrollsItself(start: EventTarget | null, deltaY: number) {
  for (
    let el = start instanceof Element ? start : null;
    el && el !== document.body && el !== document.documentElement;
    el = el.parentElement
  ) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      const room =
        deltaY > 0
          ? el.scrollHeight - el.clientHeight - el.scrollTop
          : el.scrollTop;
      if (room > 0) return true;
    }
  }
  return false;
}

function useWheelPaging(skip: boolean) {
  useEffect(() => {
    if (skip || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let frame: number | null = null;
    let gliding = false;
    let lastWheel = 0;
    // Turns held so far on the screen the page is resting on, and where.
    let held = 0;
    let heldAt = -1;
    let nudgeFrame: number | null = null;

    const nudgeBackdrop = () => {
      const from = sweepOffset;
      const by = window.innerHeight * NUDGE_SCREENS;
      const start = performance.now();
      const step = (now: number) => {
        const u = Math.min(1, (now - start) / NUDGE_MS);
        sweepOffset = from + by * GLIDE(u, 0);
        refreshBackdrop?.();
        nudgeFrame = u < 1 ? requestAnimationFrame(step) : null;
      };
      if (nudgeFrame !== null) cancelAnimationFrame(nudgeFrame);
      nudgeFrame = requestAnimationFrame(step);
    };

    // Each stop, and whether it starts a screen (data-snap="") rather than
    // being the next step of one (data-snap="step"); the top and bottom of
    // the page count as screens.
    const stops = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const list = [
        { y: 0, screen: true },
        { y: max, screen: true },
      ];
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        // One inside a pinned screen moves with it while it is pinned; its
        // pin's own markers stand for it.
        if (el.closest(".home-snap-stage")) return;
        const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
        if (y > 0 && y < max) list.push({ y, screen: el.dataset.snap !== "step" });
      });
      return list.sort((a, b) => a.y - b.y);
    };

    const glideTo = (to: number) => {
      const from = window.scrollY;
      const distance = to - from;
      const duration = Math.min(
        GLIDE_MAX_MS,
        GLIDE_BASE_MS +
          (Math.abs(distance) / window.innerHeight) * GLIDE_PER_SCREEN_MS,
      );
      const start = performance.now();
      gliding = true;
      markScrollBusy(start + duration);
      const step = (now: number) => {
        const u = Math.min(1, (now - start) / duration);
        window.scrollTo({ top: from + distance * GLIDE(u, 0), behavior: "instant" });
        if (u < 1) {
          frame = requestAnimationFrame(step);
        } else {
          frame = null;
          gliding = false;
        }
      };
      frame = requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrollsItself(event.target, event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      const sameTurn = now - lastWheel < TURN_GAP_MS;
      lastWheel = now;
      // Still gliding, one of the page's own glides is moving it, or this
      // is the rest of the turn that started the glide: let it go.
      if (gliding || scrollBusy() || sameTurn || event.deltaY === 0) return;
      const y = window.scrollY;
      const list = stops();
      const to =
        event.deltaY > 0
          ? list.find((stop) => stop.y > y + NEAR_PX)
          : [...list].reverse().find((stop) => stop.y < y - NEAR_PX);
      if (!to) return;
      if (event.deltaY > 0 && to.screen && y > NEAR_PX) {
        if (Math.abs(y - heldAt) > NEAR_PX) {
          heldAt = y;
          held = 0;
        }
        held += 1;
        if (held < TURNS_TO_LEAVE) {
          nudgeBackdrop();
          return;
        }
      }
      held = 0;
      heldAt = -1;
      glideTo(to.y);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (frame !== null) cancelAnimationFrame(frame);
      if (nudgeFrame !== null) cancelAnimationFrame(nudgeFrame);
    };
  }, [skip]);
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
// like the stepped ones: one step, held for one more (--snap-extra, see
// .home-snap-pin).
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

// The faint bacteria in the background (MicrobeBackdrop.tsx) travel as the
// reader scrolls: they flow down the screen with --sweep, how far the page
// has been scrolled. Edited 2026-10-20 (team request: a whoosh, as if
// passing through the gut): the layer also gets --whoosh, the scrolling
// speed from -1 (up) to 1 (down), which falls back to 0 when the scrolling
// stops; the swooshes show with it. Edited 2026-10-21 (team feedback:
// scrolling lagged): both are set on the background layer alone, which is
// one layer for the whole page, so a frame of scrolling restyles that
// layer and nothing else. It also gets where the bands start and end on
// the screen (--clip-top, --clip-bottom), so it shows only over them.
// How fast (px per ms) counts as full speed.
const WHOOSH_FULL = 5;
// Edited 2026-10-21 (team request: the background keeps moving on a turn
// of the wheel that holds the page still): how far the background has been
// carried on beyond the page's own scroll position (see useWheelPaging),
// and how to redraw it after moving it on.
let sweepOffset = 0;
let refreshBackdrop: (() => void) | null = null;
// How long after the last scroll the whoosh starts to die away (ms).
const WHOOSH_SETTLE = 120;

function useBackdropApproach(skip: boolean) {
  useEffect(() => {
    if (skip) return;
    const layer = document.querySelector<HTMLElement>(".microbe-backdrop");
    if (!layer) return;
    let frame: number | null = null;
    let lastY = window.scrollY + sweepOffset;
    let lastTime = performance.now();
    let settle: number | undefined;
    let clip = "";

    const whoosh = () => {
      const now = performance.now();
      const dt = now - lastTime;
      const y = window.scrollY + sweepOffset;
      if (dt > 0) {
        const speed = (y - lastY) / dt / WHOOSH_FULL;
        layer.style.setProperty(
          "--whoosh",
          Math.max(-1, Math.min(1, speed)).toFixed(3),
        );
      }
      lastY = y;
      lastTime = now;
      layer.style.setProperty("--sweep", y.toFixed(0));
      window.clearTimeout(settle);
      settle = window.setTimeout(
        () => layer.style.setProperty("--whoosh", "0"),
        WHOOSH_SETTLE,
      );
    };

    // From the top of the first band to the top of the last ("Find out
    // more", where the passage through the gut ends).
    const clipToBands = () => {
      const bands = document.querySelectorAll<HTMLElement>(
        ".page-body--home .home-section",
      );
      if (!bands.length) return;
      const vh = window.innerHeight;
      const top = bands[0].getBoundingClientRect().top;
      const end = bands[bands.length - 1].getBoundingClientRect().top;
      const next = `${Math.round(Math.min(vh, Math.max(0, top)))} ${Math.round(
        Math.min(vh, Math.max(0, vh - end)),
      )}`;
      // Only when it changes, which is only near either end.
      if (next === clip) return;
      clip = next;
      const [clipTop, clipBottom] = next.split(" ");
      layer.style.setProperty("--clip-top", `${clipTop}px`);
      layer.style.setProperty("--clip-bottom", `${clipBottom}px`);
    };

    const update = () => {
      frame = null;
      whoosh();
      clipToBands();
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    refreshBackdrop = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      refreshBackdrop = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [skip]);
}
