// Generated with Claude Opus 5.5 (Anthropic), 2026-10-18
// Purpose: Elle's tour of the body (team request), on the screen straight
// after the "PMOS manifests differently in patients" circles. Once that
// screen is scrolled to, it plays by itself: the uterus in the
// "Reproductive issues" circle grows into Elle holding a magnifying glass
// and the lady from the home-page video appears, with "So many symptoms…
// but no known etiology" beside her; Elle looks at her uterus, her liver,
// her torso (hormones) and her brain in turn — each one shown close up in a
// lens, with the same drawing as its circle — and then goes and stands
// beside her, turns sad, and the question marks appear. Scrolling back up plays it backwards,
// Elle shrinking back into the uterus in the circle.
//
// Everything is one timeline (render(t) below, t in seconds) driven towards
// its end or its start, so it can turn round smoothly at any moment. Elle
// and the close-ups are drawn on a fixed layer over the page and placed
// from the circle's and the lady's live positions every frame, so they stay
// put while the page glides or is scrolled. Under prefers-reduced-motion the
// screen simply shows its end state.
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { EFFECT_ART } from "./PmosEffectsSection";
import { PMOS_EFFECTS_ID } from "./globeDrop";
import { GLIDE } from "./scrollGlide";
import { navBottom } from "./useFallingM";

// Elle's place on the next screen, presenting (StoryScrollSection.tsx).
const PROFESSOR_SELECTOR = "[data-elle-professor]";
// The lady's waist, as a share of her picture's height: when it scrolls up
// to the navigation bar, Elle sets off for that next screen.
const WAIST = 0.4;

// The uterus drawing in the "Reproductive issues" circle, which Elle grows
// out of.
const SOURCE_SELECTOR = `#${PMOS_EFFECTS_ID} .symptom-group--reproductive .pmos-effect-art svg`;

// The lady from the home-page video, without the gut, as uploaded by the
// team (on the video's dark background — see .elle-tour-lady in App.css).
const LADY_SRC =
  "https://static.igem.wiki/teams/6299/wiki/home-page/woman-no-gut-sharp.avif";
// Her picture's size in px (the frame of the video she comes from).
const LADY_WIDTH = 976;
const LADY_HEIGHT = 1644;

const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";
// Elle's artwork's own size (all moods share it).
const ELLE_ASPECT = 1668 / 1211;
// Elle's width as a share of the lady's height.
const ELLE_SIZE = 0.3;

// Where Elle looks, in order, as a share of the lady's picture (measured on
// it): just above the crotch, under the ribs on her right (the viewer's
// left), the middle of her torso, and her forehead. Each shows the drawing
// of the circle with the same id.
const STOPS = [
  { id: "reproductive", x: 0.5, y: 0.49 },
  { id: "metabolic", x: 0.44, y: 0.375 },
  { id: "hormonal", x: 0.53, y: 0.3 },
  { id: "wellbeing", x: 0.5, y: 0.075 },
] as const;
// The close-up's diameter, as a share of the lady's width.
const CLOSE_UP_SIZE = 0.62;

// Timings, in seconds. Edited with Claude Opus 5.5 (Anthropic), 2026-10-18
// (team feedback: it took too long): a short look at each stop and then
// straight on to the next.
const FLY = 0.9; // circle → first stop
const HOLD = 0.8; // looking at a stop
const MOVE = 0.45; // between stops
const TO_SIDE = 0.7; // last stop → beside her
// How long a close-up takes to open, and to close again before she moves.
const OPEN = 0.25;
const CLOSE = 0.2;
const arrive = (k: number) => FLY + k * (HOLD + MOVE);
const leave = (k: number) => arrive(k) + HOLD;
const LAST_LEAVE = leave(STOPS.length - 1);
// Her greeting, as she grows out of the circle: gone again well before she
// starts touring the stops, so it reads as her arriving rather than
// captioning the tour itself.
const GREET_AT = 0.4;
const GREET_FADE = 0.35;

// The sentence comes in with the lady; the question marks only once Elle
// has turned sad beside her (team request, 2026-10-18).
const TEXT_AT = 0.3;
const SAD_AT = LAST_LEAVE + 0.15;
const SAD_FOR = 0.5;
const QUESTIONS_AT = SAD_AT + SAD_FOR;
const END = QUESTIONS_AT + 0.5;
// Rewinding goes this much faster than playing. Edited with Claude Opus 5
// (Anthropic), 2026-10-20 (team request: going back to the uterus took too
// long).
const REWIND_SPEED = 5;

// Scroll triggers, as a share of the window's height: the tour starts once
// its screen's top has come up past START_AT, and rewinds once it has gone
// back down past REWIND_AT.
const START_AT = 0.55;
const REWIND_AT = 0.7;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const u = clamp01(v);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const lerpBox = (a: Box, b: Box, u: number): Box => ({
  x: lerp(a.x, b.x, u),
  y: lerp(a.y, b.y, u),
  w: lerp(a.w, b.w, u),
  h: lerp(a.h, b.h, u),
});

// A magnifying glass for Elle to hold, its lens centred at (20, 20).
function Glass() {
  return (
    <svg className="elle-tour-glass" viewBox="0 0 48 48" aria-hidden="true">
      <line className="elle-tour-glass-handle" x1="30" y1="30" x2="43" y2="43" />
      <circle className="elle-tour-glass-lens" cx="20" cy="20" r="13" />
      <path className="elle-tour-glass-shine" d="M13 15 a9 9 0 0 1 6 -5" />
    </svg>
  );
}
// Where the glass sits on Elle's box (shares of her width), and where its
// lens centre then is: below and to the left of her, so she stands to the
// right of whatever she is looking at.
const GLASS_LEFT = -0.32;
const GLASS_TOP = 0.42 / ELLE_ASPECT;
const GLASS_SIZE = 0.5;
const LENS_X = GLASS_LEFT + (GLASS_SIZE * 20) / 48;
const LENS_Y = GLASS_TOP + (GLASS_SIZE * 20) / 48;

// The teal question mark of the old "etiology" screen (see
// .story-art--question in App.css), on its own beside the sentence (team
// request, 2026-10-18; moved to its right and stilled, 2026-10-20).
function QuestionMark() {
  return (
    <div
      className="story-art story-art--question elle-tour-questions"
      aria-hidden="true"
    >
      <span>?</span>
    </div>
  );
}

export function ElleTour() {
  const prefersReducedMotion = !!useReducedMotion();
  // Its own id, so a second copy of this screen cannot steal the filter.
  const inkId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ladyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLElement | null)[]>([]);
  const questionsRef = useRef<HTMLDivElement>(null);
  // The fixed layer's parts.
  const elleRef = useRef<HTMLDivElement>(null);
  const uterusRef = useRef<SVGSVGElement>(null);
  const happyRef = useRef<HTMLImageElement>(null);
  const sadRef = useRef<HTMLImageElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const closeUpRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lady = ladyRef.current;
    const slot = slotRef.current;
    const elle = elleRef.current;
    if (!wrapper || !lady || !slot || !elle) return;
    const source = () => document.querySelector<SVGSVGElement>(SOURCE_SELECTOR);

    let t = prefersReducedMotion ? END : 0;
    let direction = 0; // +1 playing, -1 rewinding, 0 still
    let frame: number | null = null;
    let last = 0;

    const setOpacity = (el: Element | null | undefined, value: number) => {
      if (el) (el as HTMLElement).style.opacity = String(value);
    };

    const render = () => {
      const fig = lady.getBoundingClientRect();
      const w = fig.height * ELLE_SIZE;
      const h = w / ELLE_ASPECT;
      // Elle's box with her lens over stop k.
      const atStop = (k: number): Box => ({
        x: fig.left + STOPS[k].x * fig.width - LENS_X * w,
        y: fig.top + STOPS[k].y * fig.height - LENS_Y * w,
        w,
        h,
      });
      // Her place beside the lady, held where it sits while the screen is
      // pinned: once the screen scrolls on, she stays put on the screen
      // (team request, 2026-10-18) rather than scrolling away with it.
      const stage = slot.parentElement!.getBoundingClientRect();
      const side = slot.getBoundingClientRect();
      const sideBox: Box = {
        x: side.left,
        y: side.top - Math.min(0, stage.top),
        w: side.width,
        h: side.height,
      };
      const circle = source();
      const circleRect = circle?.getBoundingClientRect();
      const startBox: Box = circleRect
        ? { x: circleRect.left, y: circleRect.top, w: circleRect.width, h: circleRect.height }
        : atStop(0);

      // Where Elle is, and how far through a move (for a little hop).
      let box: Box;
      let hop = 0;
      if (t <= FLY) {
        box = lerpBox(startBox, atStop(0), smooth(t / FLY));
      } else if (t >= LAST_LEAVE) {
        const u = clamp01((t - LAST_LEAVE) / TO_SIDE);
        box = lerpBox(atStop(STOPS.length - 1), sideBox, smooth(u));
        hop = u < 1 ? Math.sin(Math.PI * u) : 0;
      } else {
        const k = Math.min(STOPS.length - 1, Math.floor((t - FLY) / (HOLD + MOVE)));
        if (t <= leave(k)) {
          box = atStop(k);
        } else {
          const u = clamp01((t - leave(k)) / MOVE);
          box = lerpBox(atStop(k), atStop(k + 1), smooth(u));
          hop = Math.sin(Math.PI * u);
        }
      }

      // Once the tour is over and the lady's waist has scrolled up to the
      // navigation bar, she follows the scroll down to her place on the
      // next screen (the professor, see StoryScrollSection.tsx), arriving
      // just as that screen pins, and hands over to the Elle drawn there.
      // Her offset from that place shrinks along a curve that starts at
      // just the speed holding her still, so she leaves without a jolt.
      // She stays sad: the professor is the same sad Elle, with glasses on.
      let handedOver = false;
      const professor = document.querySelector<HTMLElement>(PROFESSOR_SELECTOR);
      const story = professor?.closest<HTMLElement>(".story-scroll");
      if (t >= END && professor && story && !prefersReducedMotion) {
        const unpinnedTop =
          wrapper.getBoundingClientRect().top + window.scrollY +
          wrapper.offsetHeight - slot.parentElement!.offsetHeight;
        const waistAt =
          unpinnedTop + (fig.top - stage.top) + WAIST * fig.height - navBottom();
        const landAt = story.getBoundingClientRect().top + window.scrollY;
        const span = landAt - waistAt;
        const q = span > 0 ? clamp01((window.scrollY - waistAt) / span) : 1;
        if (q > 0) {
          const p = professor.getBoundingClientRect();
          const shift = Math.min(window.scrollY, landAt) - waistAt;
          const gap0 = p.top + shift - sideBox.y; // how far below her it started
          const e = GLIDE(q, gap0 > 0 ? Math.min(1.5, span / gap0) : 0);
          box = {
            x: p.left + (sideBox.x - p.left) * (1 - e),
            y: p.top + (sideBox.y - (p.top + shift)) * (1 - e),
            w: lerp(sideBox.w, p.width, e),
            h: lerp(sideBox.h, p.height, e),
          };
          handedOver = q >= 1;
        }
      }
      professor?.classList.toggle("is-here", handedOver || prefersReducedMotion);

      const shown = t > 0 && !handedOver;
      elle.style.visibility = shown ? "" : "hidden";
      elle.style.width = `${box.w}px`;
      elle.style.height = `${box.h}px`;
      elle.style.transform = `translate(${box.x}px, ${box.y - hop * box.h * 0.18}px) rotate(${hop * 7}deg)`;
      // The circle's uterus is handed over to the fixed layer while it is out.
      if (circle && !prefersReducedMotion) circle.style.visibility = t > 0 ? "hidden" : "";

      const sad = smooth((t - SAD_AT) / SAD_FOR);
      setOpacity(uterusRef.current, 1 - smooth((t - 0.1) / 0.5));
      setOpacity(happyRef.current, smooth((t - 0.15) / 0.5) * (1 - sad));
      setOpacity(sadRef.current, sad);
      const greet =
        smooth((t - GREET_AT) / GREET_FADE) *
        (1 - smooth((t - (leave(0) - GREET_FADE)) / GREET_FADE));
      if (greetingRef.current) {
        greetingRef.current.style.visibility = greet > 0.01 ? "" : "hidden";
        greetingRef.current.style.opacity = String(greet);
      }
      // Each close-up grows out of the lens once she is there, and shrinks
      // back into it before she moves on. It is the lens grown big, so the
      // glass itself steps aside while one is open. Kept from poking out
      // above the top of her picture (the brain).
      const size = fig.width * CLOSE_UP_SIZE;
      let open = 0;
      STOPS.forEach((stop, k) => {
        const el = closeUpRefs.current[k];
        if (!el) return;
        const g =
          smooth((t - arrive(k) - 0.03) / OPEN) *
          (1 - smooth((t - leave(k) + CLOSE) / CLOSE));
        open = Math.max(open, g);
        const cx = fig.left + stop.x * fig.width;
        const cy = Math.max(fig.top + stop.y * fig.height, fig.top + size / 2);
        el.style.visibility = g > 0 ? "" : "hidden";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = String(Math.min(1, g * 2));
        el.style.transform = `translate(${cx - size / 2}px, ${cy - size / 2}px) scale(${0.12 + 0.88 * g})`;
      });
      setOpacity(
        glassRef.current,
        smooth((t - 0.5) / 0.4) *
          (1 - smooth((t - LAST_LEAVE) / 0.4)) *
          (1 - Math.min(1, open * 1.5)),
      );
      setOpacity(lady, smooth((t - 0.2) / 0.5));

      // The sentence, a part at a time, alongside the lady; the question
      // marks once Elle is sad.
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        const u = smooth((t - TEXT_AT - i * 0.4) / 0.5);
        line.style.opacity = String(u);
        line.style.translate = `0 ${(1 - u) * 0.5}em`;
      });
      const q = smooth((t - QUESTIONS_AT) / 0.5);
      if (questionsRef.current) {
        // Fades in once Elle is sad, at its own size: the team want the
        // mark itself to stand still (2026-10-20).
        questionsRef.current.style.opacity = String(q);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t = Math.min(END, Math.max(0, t + direction * dt * (direction < 0 ? REWIND_SPEED : 1)));
      if ((direction > 0 && t >= END) || (direction < 0 && t <= 0)) direction = 0;
      render();
      frame = direction !== 0 ? requestAnimationFrame(tick) : null;
    };
    const play = (to: number) => {
      direction = to;
      if (frame === null) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    // Edited 2026-10-21 (team request: nobody is ever locked into an
    // animation — the page scrolls whenever, either way): the tour no
    // longer glides the page into place by itself or holds the wheel back
    // while it does, and nothing holds the page on this screen until the
    // tour is over. Scrolling on before it is over takes the tour straight
    // to its end as the page starts to move, so Elle sets off for the next
    // screen with it.
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY;
      lastY = y;

      if (!prefersReducedMotion) {
        const top = wrapper.getBoundingClientRect().top;
        const vh = window.innerHeight;
        // Scrolled on past the screen before the tour finished: skip to its
        // end, so Elle is ready to move on to the next screen.
        if (
          direction > 0 &&
          down &&
          slot.parentElement!.getBoundingClientRect().top < -0.02 * vh
        ) {
          t = END;
          direction = 0;
        }
        if (direction <= 0 && t < END && down && top < START_AT * vh && top > -vh) {
          play(1);
        } else if (direction >= 0 && t > 0 && top > REWIND_AT * vh) {
          play(-1);
        }
      }
      // Keep everything on the fixed layer over its spot while not playing.
      if (direction === 0 && frame === null) frame = requestAnimationFrame(() => {
        frame = null;
        render();
      });
    };

    // Landing on the page already past the tour: show its end.
    if (!prefersReducedMotion && wrapper.getBoundingClientRect().top < -window.innerHeight) {
      t = END;
    }
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      const circle = source();
      if (circle) circle.style.visibility = "";
    };
  }, [prefersReducedMotion]);

  const uterus = EFFECT_ART.reproductive;
  return (
    <div className="elle-tour" ref={wrapperRef} data-snap="">
      <div className="elle-tour-stage">
        <div className="elle-tour-lady" ref={ladyRef} aria-hidden="true">
          {/* Her picture is a video still with the video's near-black
              behind her, and no transparency of its own. On the dark band
              a "lighten" blend is enough to lose that background, but on
              the light one it left her almost invisible and every blend
              that did show her left her near-black rather than the colour
              asked for. This turns the picture's own brightness into
              transparency — the near-black becomes nothing, she becomes
              solid — and fills what is left with one flat colour (team
              request, 2026-10-20). TODO(team): a cut-out of her with real
              transparency would let all of this go. */}
          <svg className="elle-tour-ink" aria-hidden="true">
            <filter
              id={inkId}
              colorInterpolationFilters="sRGB"
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0.3 0.59 0.11 0 0"
                result="lit"
              />
              {/* Measured off the picture itself: seven tenths of it sits
                  at 0.10-0.15, the near-black behind her, and a fifth at
                  0.75-0.80, her own fill. Everything above the first is
                  made solid and everything below it nothing, with the
                  change spread over a little so her edge stays smooth,
                  and the whole of her is then filled with one colour
                  (team request, 2026-10-20: completely purple). */}
              <feComponentTransfer in="lit" result="cut">
                <feFuncA type="linear" slope="6" intercept="-1.8" />
              </feComponentTransfer>
              <feFlood className="elle-tour-ink-fill" result="ink" />
              <feComposite in="ink" in2="cut" operator="in" />
            </filter>
          </svg>
          <img
            src={LADY_SRC}
            alt=""
            width={LADY_WIDTH}
            height={LADY_HEIGHT}
            style={{ "--lady-ink": `url(#${inkId})` } as CSSProperties}
          />
        </div>
        {/* Where Elle ends up, beside the lady (she is drawn on the fixed
            layer below, placed over this). */}
        <div className="elle-tour-slot" ref={slotRef} aria-hidden="true" />
        <div className="elle-tour-words">
          <p className="story-text">
            <span className="elle-tour-line" ref={(el) => void (lineRefs.current[0] = el)}>
              So many symptoms…
            </span>
            <span className="elle-tour-line" ref={(el) => void (lineRefs.current[1] = el)}>
              …but no known <strong>etiology</strong>
            </span>
          </p>
          <div ref={questionsRef} className="elle-tour-questions-wrap">
            <QuestionMark />
          </div>
        </div>
      </div>
      {createPortal(
        <div className="elle-tour-layer" aria-hidden="true">
          {STOPS.map((stop, k) => (
            <div
              key={stop.id}
              className={`elle-tour-close-up symptom-group--${stop.id}`}
              ref={(el) => void (closeUpRefs.current[k] = el)}
            >
              <svg viewBox={EFFECT_ART[stop.id].viewBox} preserveAspectRatio="xMidYMid meet">
                {EFFECT_ART[stop.id].art}
              </svg>
            </div>
          ))}
          <div className="elle-tour-elle" ref={elleRef}>
            <svg
              ref={uterusRef}
              className="elle-tour-uterus"
              viewBox={uterus.viewBox}
              preserveAspectRatio="xMidYMid meet"
            >
              {uterus.art}
            </svg>
            <img ref={happyRef} src={`${MASCOT_BASE}/uterus-excited.avif`} alt="" />
            <img ref={sadRef} src={`${MASCOT_BASE}/uterus-sad.avif`} alt="" />
            <div
              ref={glassRef}
              className="elle-tour-glass-wrap"
              style={
                {
                  "--glass-left": GLASS_LEFT,
                  "--glass-top": GLASS_TOP,
                  "--glass-size": GLASS_SIZE,
                } as CSSProperties
              }
            >
              <Glass />
            </div>
            <div ref={greetingRef} className="elle-tour-greeting">
              Hi, I&rsquo;m Elle!
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
