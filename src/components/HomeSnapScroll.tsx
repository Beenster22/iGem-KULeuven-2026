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
import { GLIDE } from "./scrollGlide";
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
  usePaging(!!prefersReducedMotion);

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
// gesture (ctrl + wheel), and not inside a box that scrolls on its own. The
// scrollbar and the keys still scroll freely.
// (Edited 2026-10-21: for a while the wheel was held for two or three
// turns on each screen before moving on; taken back out the same day, team
// request — one turn to a screen, the next turn on to the next.) The
// glides were made a little quicker the same day. (A turn made during a
// glide was briefly kept and carried out when it landed; taken out again,
// team request: the page should only ever move when the reader turns the
// wheel.)

// How long a glide takes: a base, plus a little more the further it goes.
const GLIDE_BASE_MS = 550;
const GLIDE_PER_SCREEN_MS = 200;
const GLIDE_MAX_MS = 1050;
// Edited 2026-10-21 (team request: one scroll moves one section, never
// more, however hard or soft — it was too sensitive): a scroll is
// everything the wheel or touchpad sends until it has been still for
// SCROLL_GAP_MS (a touchpad's coasting included), and it moves the page
// one stop, once. Scrolling the same way again while the page is still
// gliding there does nothing; scrolling the other way turns it back. The
// faint tail of a touchpad's coasting (pushes under MIN_PUSH) never starts
// a scroll of its own.
const SCROLL_GAP_MS = 300;
const MIN_PUSH = 4;
// How much bigger than the push before it a push has to be to count as the
// reader's hand again rather than the tail of the last swipe, and the
// smallest push that may count (so the jitter at the very end of a
// touchpad's coasting never does).
const RE_PUSH = 1.5;
const MIN_RE_PUSH = 8;
// How far below the hardest push of the scroll so far it has to fall for
// the next rise to count as the reader's hand again.
const DIP = 0.3;
// How long after the page last moved a rise may count as a scroll of its
// own. A second swipe is slower in coming than this; a wobble inside one
// swipe is quicker.
const ACT_GAP_MS = 450;
// Edited 2026-10-21 (team request: one swipe to a section on a touch
// screen too). How far a finger has to travel for a swipe to move the page
// on a section.
const SWIPE_PX = 24;
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

function usePaging(skip: boolean) {
  useEffect(() => {
    if (skip) return;
    let frame: number | null = null;
    let gliding = false;
    let lastWheel = 0;
    // The current scroll's direction, and whether it has moved the page.
    let lastSign = 0;
    let acted = true;
    // The size of the last push, and the hardest of the scroll so far, to
    // tell a fresh push from the tail of the one before it (below).
    let lastPush = 0;
    let peak = 0;
    let dipped = false;
    let lastActed = -Infinity;
    // Where the current glide is heading.
    let target = 0;

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
      target = to;
      if (frame !== null) cancelAnimationFrame(frame);
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

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrollsItself(event.target, event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      const sign = Math.sign(event.deltaY);
      if (!sign) return;
      // A new scroll: the wheel had stopped, or it now goes the other way.
      if (now - lastWheel > SCROLL_GAP_MS || sign !== lastSign) {
        acted = false;
        peak = 0;
        dipped = false;
      }
      lastWheel = now;
      lastSign = sign;
      // This scroll has already moved the page, or is only coasting. (In
      // px: some browsers count a mouse wheel's notches in lines or pages.)
      const push =
        Math.abs(event.deltaY) *
        (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? window.innerHeight : 1);
      // A touchpad's coasting only ever dies away, so a push that rises
      // again once it has fallen well below the hardest of the scroll so
      // far is the reader's hand again, not the tail of the last swipe:
      // that is a scroll of its own, and counts towards the next section.
      // (The rise at the start of a swipe is not one — the fall has to
      // come first, or every swipe would count twice.)
      if (push > peak) peak = push;
      if (push < peak * DIP) dipped = true;
      // A hand is never this quick: a rise sooner than ACT_GAP_MS after
      // the page last moved is a wobble in the middle of the swipe that
      // moved it, not a swipe of its own. (Without this a shaky swipe
      // moved the page on two sections, the second of them once the first
      // glide had finished and stopped swallowing it.)
      if (
        dipped &&
        push > lastPush * RE_PUSH &&
        push >= MIN_RE_PUSH &&
        now - lastActed > ACT_GAP_MS
      ) {
        acted = false;
        dipped = false;
        peak = push;
      }
      lastPush = push;
      if (acted || push < MIN_PUSH) return;
      acted = true;
      lastActed = now;
      // Already gliding that way: one scroll, one section.
      if (gliding && Math.sign(target - window.scrollY) === sign) return;
      go(sign);
    };

    // TOUCH SCREENS
    // The browser's own scrolling carries a swipe on for as long as its
    // momentum lasts, which is most of a section on a short page and
    // several on this one, so a swipe is taken over here the same way a
    // turn of the wheel is: the page does not follow the finger, it moves
    // on one section when the finger lifts. A swipe inside something that
    // scrolls on its own (a table, a long caption) is left alone.
    let touchFrom = 0;
    let touchAt = 0;
    let swiping = false;
    // Edited with Claude Opus 5.5 (Anthropic), 2026-10-21 (team request: on a
    // phone only two of the "Find out more" cards could be seen, because the
    // swipe after them went straight to the foot of the page): from the
    // first `data-snap="free"` band down, a swipe scrolls the page the
    // ordinary way. Only a swipe up from that band's very top still goes
    // back one section, into the story above it.
    const freeFrom = () => {
      const el = document.querySelector<HTMLElement>('[data-snap="free"]');
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
    };

    const onTouchStart = (event: TouchEvent) => {
      swiping = event.touches.length === 1;
      if (!swiping) return;
      touchFrom = touchAt = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!swiping || event.touches.length !== 1) return;
      touchAt = event.touches[0].clientY;
      const moved = touchFrom - touchAt;
      if (scrollsItself(event.target, moved)) {
        swiping = false;
        return;
      }
      const free = freeFrom();
      if (free !== null && window.scrollY >= free - NEAR_PX) {
        // Not stopping the browser until the finger has a direction: a
        // swipe whose first move is blocked cannot scroll at all after.
        if (moved === 0) return;
        if (moved > 0 || window.scrollY > free + NEAR_PX) {
          // In the free part: the browser scrolls, and the swipe is not paged.
          swiping = false;
          return;
        }
      }
      if (event.cancelable) event.preventDefault();
    };

    const onTouchEnd = () => {
      if (!swiping) return;
      swiping = false;
      const moved = touchFrom - touchAt;
      if (Math.abs(moved) >= SWIPE_PX) go(Math.sign(moved));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      if (frame !== null) cancelAnimationFrame(frame);
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
