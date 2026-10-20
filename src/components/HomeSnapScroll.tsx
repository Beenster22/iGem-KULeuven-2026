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
// (Edited 2026-10-21: for a while the wheel was held for two or three
// turns on each screen before moving on; taken back out the same day, team
// request — one turn to a screen, the next turn on to the next.) Edited
// again the same day (team feedback: it still took an extra turn): a turn
// made while a glide is still running used to be dropped, so the reader
// had to turn again; it is now kept, and the page glides on to the next
// stop as soon as the current glide lands. The glides are a little quicker
// too.

// How long a glide takes: a base, plus a little more the further it goes.
const GLIDE_BASE_MS = 550;
const GLIDE_PER_SCREEN_MS = 200;
const GLIDE_MAX_MS = 1050;
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
    // A turn made while the page was still gliding (1 down, -1 up, 0 none),
    // to carry out as soon as it lands.
    let queued = 0;
    let waiting: number | undefined;

    const stops = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const list = [0, max];
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        // One inside a pinned screen moves with it while it is pinned; its
        // pin's own markers stand for it.
        if (el.closest(".home-snap-stage")) return;
        const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
        if (y > 0 && y < max) list.push(y);
      });
      return list.sort((a, b) => a - b);
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
          carryOn();
        }
      };
      frame = requestAnimationFrame(step);
    };

    // On to the next stop in that direction (or back to the one before).
    const go = (direction: number) => {
      const y = window.scrollY;
      const list = stops();
      const to =
        direction > 0
          ? list.find((stop) => stop > y + NEAR_PX)
          : [...list].reverse().find((stop) => stop < y - NEAR_PX);
      if (to !== undefined) glideTo(to);
    };

    // A turn kept from while the page was moving: once it is still.
    const carryOn = () => {
      window.clearTimeout(waiting);
      if (!queued || gliding) return;
      if (scrollBusy()) {
        waiting = window.setTimeout(carryOn, 100);
        return;
      }
      const direction = queued;
      queued = 0;
      go(direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrollsItself(event.target, event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      const sameTurn = now - lastWheel < TURN_GAP_MS;
      lastWheel = now;
      // The rest of a turn already acted on (a touchpad's coasting
      // included): let it go.
      if (sameTurn || event.deltaY === 0) return;
      const direction = Math.sign(event.deltaY);
      // A new turn while the page is still moving: keep it for when it
      // lands.
      if (gliding || scrollBusy()) {
        queued = direction;
        if (!gliding) carryOn();
        return;
      }
      go(direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (frame !== null) cancelAnimationFrame(frame);
      window.clearTimeout(waiting);
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
// How long after the last scroll the whoosh starts to die away (ms).
const WHOOSH_SETTLE = 120;

function useBackdropApproach(skip: boolean) {
  useEffect(() => {
    if (skip) return;
    const layer = document.querySelector<HTMLElement>(".microbe-backdrop");
    if (!layer) return;
    let frame: number | null = null;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let settle: number | undefined;
    let clip = "";

    const whoosh = () => {
      const now = performance.now();
      const dt = now - lastTime;
      const y = window.scrollY;
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [skip]);
}
