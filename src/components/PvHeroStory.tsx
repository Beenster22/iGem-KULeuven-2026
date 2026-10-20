// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: the two screens that close the home page's story, after "This is
// linked to:". They replace EngineerSection (P. vulgatus with a genetic
// circuit drawn inside), which the team asked to drop.
//  - PvBalanceSection: "This is why we want to engineer P. vulgatus to
//    restore bile acid balance…". A pair of scales holds conjugated bile
//    acids on one pan and deconjugated ones on the other. Edited 2026-10-20
//    (team requests): on the first scroll it hangs to one side on its own;
//    on the second P. vulgatus flies in from the left, engineered — the
//    team's drawing of it with its genetic circuit inside and BSH beside
//    it, in the caped one's style and hairs — and drifts there; on the
//    third the circuit's "inhibits" line reaches BSH and the scales level.
//    (Before that it was the caped one flying in, and before that the
//    three consequence circles above flying down and becoming it.)
//  - PvCureSection: "… and achieve a therapeutic effect in PMOS". The four
//    areas PMOS affects (the circles of PmosEffectsSection) round the edge.
//    The engineered P. vulgatus flies on down from the screen above to the
//    middle, turning into the caped one on the way (useCellToHero.ts), then
//    goes to each in turn and clears it, then flies off and leaves the
//    EMPOWER logo where it stood.
// The drawings are ILLUSTRATIONS of the team's aim, not results: the scales
// stand for "balance" and the clearing for "a therapeutic effect", nothing
// more. Motion is off under prefers-reduced-motion, where both screens show
// their end state.
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";
import { EFFECT_LIST } from "./PmosEffectsSection";
import { BileAcidShape } from "./Tgr5Story";
import { SnapSteps } from "./HomeSnapScroll";
import { usePinnedStep } from "./usePinnedStep";
import { useCellToHero } from "./useCellToHero";
import { useThemeMode } from "../ThemeModeContext";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/* P. vulgatus, caped                                                  */
/* ------------------------------------------------------------------ */

// The cell of BshStreamAnimation.tsx stood on end, drawn about its centre.
const HERO = { w: 96, h: 210 };

// Pili all the way round an upright capsule of w x h drawn about its
// centre: down the right side, round the bottom, up the left side and over
// the top. `seed` varies the hairs from one cell to another.
function capsulePili(w: number, h: number, count: number, seed: number) {
  const r = w / 2;
  const straight = h - w;
  const perimeter = 2 * straight + 2 * Math.PI * r;
  return Array.from({ length: count }, (_, i) => {
    const d =
      ((i + 0.5 + (seededValue(i + seed) - 0.5) * 0.6) / count) * perimeter;
    let x: number;
    let y: number;
    let angle: number;
    if (d < straight) {
      [x, y, angle] = [r, -straight / 2 + d, 0];
    } else if (d < straight + Math.PI * r) {
      angle = (d - straight) / r;
      [x, y] = [r * Math.cos(angle), straight / 2 + r * Math.sin(angle)];
    } else if (d < 2 * straight + Math.PI * r) {
      [x, y, angle] = [
        -r,
        straight / 2 - (d - straight - Math.PI * r),
        Math.PI,
      ];
    } else {
      angle = Math.PI + (d - 2 * straight - Math.PI * r) / r;
      [x, y] = [r * Math.cos(angle), -straight / 2 + r * Math.sin(angle)];
    }
    const length = 13 + seededValue(i * 7 + seed + 1) * 9;
    const lean = (seededValue(i * 7 + seed + 2) - 0.5) * 0.7;
    const tipX = x + length * Math.cos(angle + lean);
    const tipY = y + length * Math.sin(angle + lean);
    const midX = x + length * 0.55 * Math.cos(angle - lean * 0.6);
    const midY = y + length * 0.55 * Math.sin(angle - lean * 0.6);
    return `M${x.toFixed(1)},${y.toFixed(1)} Q${midX.toFixed(1)},${midY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`;
  }).join(" ");
}

const HERO_PILI = capsulePili(HERO.w, HERO.h, 34, 900);

// Where the cape hangs from: across the cell's shoulders.
const SHOULDER_Y = -HERO.h / 2 + 34;

function PvHero() {
  return (
    <g className="pv-hero">
      {/* Behind the cell, flaring out either side of it. */}
      <g className="pv-hero-cape">
        <path
          d={`M-34,${SHOULDER_Y} C-70,${SHOULDER_Y + 40} -104,40 -112,${HERO.h / 2 + 8}
              Q-82,${HERO.h / 2 - 6} -56,${HERO.h / 2 + 10} Q-26,${HERO.h / 2 + 22} 0,${HERO.h / 2 + 8}
              Q22,${HERO.h / 2 + 22} 56,${HERO.h / 2 + 10} Q82,${HERO.h / 2 - 6} 112,${HERO.h / 2 + 8}
              C104,40 70,${SHOULDER_Y + 40} 34,${SHOULDER_Y} Z`}
        />
      </g>
      <g className="pv-hero-body">
        {/* A pale edge under the hairs, so they still read where they
            cross the cape. */}
        <path className="pv-hero-pili-halo" d={HERO_PILI} />
        <path className="pv-hero-pili" d={HERO_PILI} />
        <rect
          className="pv-hero-outer"
          x={-HERO.w / 2}
          y={-HERO.h / 2}
          width={HERO.w}
          height={HERO.h}
          rx={HERO.w / 2}
        />
        <rect
          className="pv-hero-inner"
          x={-HERO.w / 2 + 8}
          y={-HERO.h / 2 + 8}
          width={HERO.w - 16}
          height={HERO.h - 16}
          rx={HERO.w / 2 - 8}
        />
      </g>
      {/* The cape's tie across the front, with its clasp. */}
      <path
        className="pv-hero-tie"
        d={`M-36,${SHOULDER_Y - 2} Q0,${SHOULDER_Y + 16} 36,${SHOULDER_Y - 2}`}
      />
      <circle className="pv-hero-clasp" cx={0} cy={SHOULDER_Y + 7} r={7} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* P. vulgatus, engineered                                             */
/* ------------------------------------------------------------------ */

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-20 (team request,
// with the team's picture of it): P. vulgatus lying on its side with the
// genetic circuit inside it — promoter, two parts and a terminator — and
// beside it the BSH it silences, reached by the blunt "inhibits" line. The
// same cell as the caped one (same purple, same hairs), only longer, so the
// circuit fits. Drawn about its centre; the circuit is the old "why we
// engineer" drawing's, moved to that centre.
const CELL = { w: 288, h: 158 };
// Drawn upright and turned on its side, so the hairs come from the same
// recipe as the caped cell's.
const CELL_PILI = capsulePili(CELL.h, CELL.w, 46, 950);
// From the yellow part down and across to BSH, ending in the blunt bar.
const INHIBIT_PATH = "M-4,1 v20 q0,12 14,12 h14 m0,-10 v20";

function PvEngineered() {
  // The dashed line is uncovered along its length by a solid copy of it
  // that grows from the yellow part to BSH (stroke-dashoffset on a path one
  // unit long), so it stays dashed as it draws out.
  const revealId = useId();
  return (
    <g className="pv-engineer">
      <defs>
        <mask
          id={revealId}
          maskUnits="userSpaceOnUse"
          x={-200}
          y={-200}
          width={400}
          height={400}
        >
          <path
            className="pv-engineer-inhibit-reveal"
            d={INHIBIT_PATH}
            pathLength={1}
          />
        </mask>
      </defs>
      <g transform="rotate(90)">
        <path className="pv-hero-pili-halo" d={CELL_PILI} />
        <path className="pv-hero-pili" d={CELL_PILI} />
        <rect
          className="pv-hero-outer"
          x={-CELL.h / 2}
          y={-CELL.w / 2}
          width={CELL.h}
          height={CELL.w}
          rx={CELL.h / 2}
        />
        <rect
          className="pv-hero-inner"
          x={-CELL.h / 2 + 10}
          y={-CELL.w / 2 + 10}
          width={CELL.h - 20}
          height={CELL.w - 20}
          rx={CELL.h / 2 - 10}
        />
      </g>
      <line className="pv-engineer-dna" x1={-98} y1={-13} x2={26} y2={-13} />
      <path
        className="pv-engineer-promoter"
        d="M-88,-13 v-20 h16 m-7,-6 l8,6 l-8,6"
      />
      <rect
        className="pv-engineer-part pv-engineer-part--a"
        x={-64}
        y={-24}
        width={36}
        height={22}
        rx={4}
      />
      <rect
        className="pv-engineer-part pv-engineer-part--b"
        x={-22}
        y={-24}
        width={36}
        height={22}
        rx={4}
      />
      <path className="pv-engineer-terminator" d="M22,-13 v-14 m-7,0 h14" />
      {/* The line draws itself out on the third step and BSH dims as it
          is reached (see .pv-engineer-* in App.css). */}
      <path
        className="pv-engineer-inhibit"
        d={INHIBIT_PATH}
        mask={`url(#${revealId})`}
      />
      <rect
        className="pv-engineer-bsh"
        x={32}
        y={13}
        width={78}
        height={40}
        rx={20}
      />
      <text className="pv-engineer-bsh-label" x={71} y={39}>
        BSH
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Restoring the balance                                               */
/* ------------------------------------------------------------------ */

const BAL_W = 1000;
const BAL_H = 470;
// Where the engineered cell lands, left of the scales.
const CELL_AT = { x: 228, y: 236 };
const CELL_SCALE = 1.08;
// The scales: the pivot at the top of the post, and half the beam.
const PIVOT = { x: 690, y: 140 };
const ARM = 200;
// How far below its hook a pan's dish hangs, and half its width.
const PAN_DROP = 120;
const PAN_HALF = 96;
// The bile acids are a little smaller here than on the TGR5 screens, so
// three fit on a pan.
const BAL_ACID_SCALE = 1.3;
const BAL_ACID_R = 12 * BAL_ACID_SCALE;
const ROW_1 = PAN_DROP - BAL_ACID_R - 3;
const ROW_2 = ROW_1 - 2 * BAL_ACID_R + 3;

// Each pan's bile acids, around its centre. `stream` is the colour pair
// (bsh-molecule--0 / --1), `when` whether it is there before P. vulgatus
// arrives, after, or both. Conjugated ones are drawn with the tag to their
// left, so they sit a little right of centre.
type When = "both" | "before" | "after";
const CONJUGATED: { x: number; y: number; stream: 0 | 1; when: When }[] = [
  { x: -16, y: ROW_1, stream: 0, when: "both" },
  { x: 44, y: ROW_1, stream: 1, when: "both" },
  { x: 14, y: ROW_2, stream: 1, when: "after" },
];
const DECONJUGATED: { x: number; y: number; stream: 0 | 1; when: When }[] = [
  { x: -36, y: ROW_1, stream: 0, when: "both" },
  { x: 0, y: ROW_1, stream: 1, when: "both" },
  { x: 36, y: ROW_1, stream: 0, when: "both" },
  { x: 0, y: ROW_2, stream: 1, when: "before" },
];

function Pan({
  side,
  label,
  conjugated,
  acids,
}: {
  side: -1 | 1;
  label: string;
  conjugated: boolean;
  acids: typeof CONJUGATED;
}) {
  return (
    <g transform={`translate(${side * ARM} 0)`}>
      {/* Turned back by as much as the beam is turned, so it hangs
          straight down whichever way the beam tips. */}
      <g className="pv-pan">
        <path
          className="pv-scale-string"
          d={`M${-PAN_HALF + 12},${PAN_DROP} L0,0 L${PAN_HALF - 12},${PAN_DROP}`}
        />
        {acids.map((acid, i) => (
          <g
            key={i}
            className={`pv-pan-acid pv-pan-acid--${acid.when}`}
            transform={`translate(${acid.x} ${acid.y})`}
          >
            <g className="pv-pan-acid-move">
              <g
                className={`bsh-molecule--${acid.stream}`}
                transform={`scale(${BAL_ACID_SCALE})`}
              >
                <BileAcidShape conjugated={conjugated} />
              </g>
            </g>
          </g>
        ))}
        <path
          className="pv-scale-dish"
          d={`M${-PAN_HALF},${PAN_DROP} Q0,${PAN_DROP + 52} ${PAN_HALF},${PAN_DROP} Z`}
        />
        <text className="tgr5-label" x={0} y={PAN_DROP + 64}>
          {label}
        </text>
      </g>
      <circle className="pv-scale-hook" cx={0} cy={0} r={6} />
    </g>
  );
}

function PvBalanceFigure() {
  // Its own id, so a second copy of this drawing cannot steal the glow.
  const glowId = useId();
  return (
    <svg
      className="pv-balance-svg"
      viewBox={`0 0 ${BAL_W} ${BAL_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Illustration: a pair of scales with conjugated bile acids on one pan and deconjugated bile acids on the other, tipped towards the deconjugated side. Phocaeicola vulgatus, engineered with a genetic circuit inside it, arrives beside it; the circuit silences its BSH enzyme, and the scales level out."
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="55%" stopColor="currentColor" stopOpacity={0.09} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle
        className="pv-hero-glow"
        cx={CELL_AT.x}
        cy={CELL_AT.y}
        r={210}
        fill={`url(#${glowId})`}
      />
      <g
        transform={`translate(${CELL_AT.x} ${CELL_AT.y}) scale(${CELL_SCALE})`}
      >
        {/* Flies in from the left (data-arrived), then drifts a little in
            place (.pv-cell-drift). */}
        <g className="pv-cell-arrive">
          <g className="pv-cell-drift">
            <PvEngineered />
          </g>
        </g>
      </g>

      {/* The scales: post and foot, then the beam with a pan on each end. */}
      <rect
        className="pv-scale-frame"
        x={PIVOT.x - 7}
        y={PIVOT.y}
        width={14}
        height={BAL_H - 50 - PIVOT.y}
        rx={4}
      />
      <rect
        className="pv-scale-frame"
        x={PIVOT.x - 95}
        y={BAL_H - 56}
        width={190}
        height={18}
        rx={9}
      />
      <g transform={`translate(${PIVOT.x} ${PIVOT.y})`}>
        <g className="pv-beam">
          <rect
            className="pv-scale-frame"
            x={-ARM - 8}
            y={-7}
            width={2 * ARM + 16}
            height={14}
            rx={7}
          />
          <Pan side={-1} label="conjugated" conjugated acids={CONJUGATED} />
          <Pan
            side={1}
            label="deconjugated"
            conjugated={false}
            acids={DECONJUGATED}
          />
        </g>
        <circle className="pv-scale-pivot" cx={0} cy={0} r={13} />
      </g>
    </svg>
  );
}

// Three steps (team request, 2026-10-20): the scales on their own; the
// engineered P. vulgatus flying in; its circuit silencing BSH, and the
// scales levelling.
const BALANCE_STEPS = 3;

export function PvBalanceSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const step = usePinnedStep(wrapperRef, BALANCE_STEPS);
  // CSS does the rest, on data-arrived and data-balanced.
  const arrived = prefersReducedMotion || step >= 1;
  const balanced = prefersReducedMotion || step >= 2;
  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={{ "--snap-steps": BALANCE_STEPS } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={BALANCE_STEPS} />}
      <section
        className={`pv-balance home-snap-screen${prefersReducedMotion ? "" : " home-snap-stage"}`}
        data-snap=""
        data-arrived={arrived ? "1" : "0"}
        data-balanced={balanced ? "1" : "0"}
      >
        {/* Wording supplied by the team, 2026-10-20. */}
        <h3 className="pv-heading">
          This is why we want to engineer <em>P. vulgatus</em> to{" "}
          <strong>restore bile acid balance</strong>…
        </h3>
        <PvBalanceFigure />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Clearing the symptoms                                               */
/* ------------------------------------------------------------------ */

const CURE_W = 1000;
const CURE_H = 560;
const CURE_CENTRE = { x: 500, y: 270 };
const CURE_HERO_SCALE = 0.8;
const SYMPTOM_R = 80;
// Round the edge, in the order P. vulgatus visits them: clockwise from the
// top left.
const SYMPTOM_AT: [number, number][] = [
  [200, 130],
  [800, 130],
  [800, 400],
  [200, 400],
];
// Where it stops beside each one: on the line in from the middle, just
// short of the circle, leaning the way it is going.
const STOPS = SYMPTOM_AT.map(([x, y]) => {
  const dx = x - CURE_CENTRE.x;
  const dy = y - CURE_CENTRE.y;
  const length = Math.hypot(dx, dy);
  const reach = SYMPTOM_R + 70;
  return {
    x: x - (dx / length) * reach,
    y: y - (dy / length) * reach,
    lean: dx > 0 ? 14 : -14,
  };
});
// Timing of each visit (ms): getting there, then the moment it clears.
// Edited 2026-10-20 (team request: a little faster): was 900 / 650, with
// START 700, LIFT_OFF 500 and FLY_AWAY 1400 below.
const TRAVEL = 600;
const PAUSE = 400;
// How long after the screen comes into view it sets off.
const START = 400;
// Done, it takes off from the middle (team request, 2026-10-20): after
// this long back there it flies off up and to the right, taking FLY_AWAY
// ms, and only once it is off the screen altogether does the EMPOWER logo
// grow out of the spot it left. FLY_TO is far enough out of the drawing
// to be off the screen at any window size.
const LIFT_OFF = 300;
const FLY_AWAY = 1000;
const FLY_TO = { x: CURE_CENTRE.x + 1400, y: -1400, turn: 32, scale: 0.6 };

// The team's logo with its name, in the variant for each theme as in the
// footer: dark purple ink on the light page, light purple on the dark one.
const LOGO_BY_MODE = {
  light:
    "https://static.igem.wiki/teams/6299/wiki/icons/logo-dark-purple-text.avif",
  dark: "https://static.igem.wiki/teams/6299/wiki/icons/logo-light-purple-text.avif",
} as const;
const LOGO_BOX = { w: 460, h: 380 };

// The rays that burst out of a circle as it clears.
const RAYS = Array.from({ length: 10 }, (_, i) => (i / 10) * 2 * Math.PI);

function useCureSequence(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  // Where it is (-1: the middle), how many it has cleared, and whether it
  // has flown off (and the logo come out).
  const [at, setAt] = useState(-1);
  const [cleared, setCleared] = useState(enabled ? 0 : SYMPTOM_AT.length);
  const [away, setAway] = useState(!enabled);
  const [logo, setLogo] = useState(!enabled);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let timers: number[] = [];
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    const play = () => {
      waiting = undefined;
      stop();
      let t = START;
      SYMPTOM_AT.forEach((_, i) => {
        timers.push(window.setTimeout(() => setAt(i), t));
        t += TRAVEL;
        timers.push(window.setTimeout(() => setCleared(i + 1), t));
        t += PAUSE;
      });
      timers.push(window.setTimeout(() => setAt(-1), t));
      t += TRAVEL + LIFT_OFF;
      timers.push(window.setTimeout(() => setAway(true), t));
      t += FLY_AWAY;
      timers.push(window.setTimeout(() => setLogo(true), t));
    };
    // Edited 2026-10-20 (team request): P. vulgatus now flies down to the
    // middle from the screen above (useReceptorZoom, which keeps
    // --receptor-in at 0 on this screen until it has landed), so the round
    // of the symptoms waits for it to be there.
    let waiting: number | undefined;
    const landed = () => el.style.getPropertyValue("--receptor-in") !== "0";
    const startWhenLanded = () => {
      if (landed()) play();
      else waiting = window.setTimeout(startWhenLanded, 100);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          if (timers.length === 0 && waiting === undefined) startWhenLanded();
        } else if (!entry.isIntersecting) {
          // Out of view: start again from the beginning next time.
          window.clearTimeout(waiting);
          waiting = undefined;
          stop();
          setAt(-1);
          setCleared(0);
          setAway(false);
          setLogo(false);
        }
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(waiting);
      stop();
      observer.disconnect();
    };
  }, [ref, enabled]);

  return { at, cleared, away, logo };
}

function PvCureFigure({
  at,
  cleared,
  away,
  logo,
}: {
  at: number;
  cleared: number;
  away: boolean;
  logo: boolean;
}) {
  const glowId = useId();
  const { mode } = useThemeMode();
  const stop = at >= 0 ? STOPS[at] : { ...CURE_CENTRE, lean: 0 };
  // It leans only while it is on its way somewhere.
  const moving = at >= 0 && cleared <= at;
  const heroTransform = away
    ? `translate(${FLY_TO.x}px, ${FLY_TO.y}px) rotate(${FLY_TO.turn}deg) scale(${FLY_TO.scale})`
    : `translate(${stop.x}px, ${stop.y}px) rotate(${moving ? stop.lean : 0}deg) scale(${CURE_HERO_SCALE})`;
  return (
    <svg
      className={`pv-cure-svg${logo ? " pv-cure-svg--done" : ""}`}
      viewBox={`0 0 ${CURE_W} ${CURE_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Illustration: Phocaeicola vulgatus, wearing a cape, stands among four circles for the areas PMOS affects — hormonal imbalance, reproductive issues, metabolic complications and psychological burden — and goes to each in turn, clearing it, then flies away and the EMPOWER logo appears where it stood, and the labels fade."
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="55%" stopColor="currentColor" stopOpacity={0.08} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle
        cx={CURE_CENTRE.x}
        cy={CURE_CENTRE.y}
        r={190}
        fill={`url(#${glowId})`}
      />

      {EFFECT_LIST.map((effect, i) => {
        const [x, y] = SYMPTOM_AT[i];
        const art = SYMPTOM_R * 1.25;
        return (
          <g
            key={effect.id}
            className={`pv-symptom symptom-group--${effect.id}${i < cleared ? " pv-symptom--cleared" : ""}`}
          >
            <g className="pv-symptom-rays">
              {RAYS.map((a) => (
                <line
                  key={a}
                  x1={x + Math.cos(a) * (SYMPTOM_R + 10)}
                  y1={y + Math.sin(a) * (SYMPTOM_R + 10)}
                  x2={x + Math.cos(a) * (SYMPTOM_R + 34)}
                  y2={y + Math.sin(a) * (SYMPTOM_R + 34)}
                />
              ))}
            </g>
            <g className="pv-symptom-circle">
              <circle className="pv-symptom-disc" cx={x} cy={y} r={SYMPTOM_R} />
              <svg
                x={x - art / 2}
                y={y - art / 2}
                width={art}
                height={art}
                viewBox={effect.viewBox}
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
              >
                {effect.art}
              </svg>
            </g>
            <text className="pv-symptom-label" x={x} y={y + SYMPTOM_R + 38}>
              {effect.label}
            </text>
          </g>
        );
      })}

      {/* The logo, which grows out of the spot P. vulgatus takes off
          from. */}
      <g transform={`translate(${CURE_CENTRE.x} ${CURE_CENTRE.y})`}>
        <g className={`pv-cure-logo${logo ? " pv-cure-logo--shown" : ""}`}>
          <image
            href={LOGO_BY_MODE[mode]}
            x={-LOGO_BOX.w / 2}
            y={-LOGO_BOX.h / 2}
            width={LOGO_BOX.w}
            height={LOGO_BOX.h}
            preserveAspectRatio="xMidYMid meet"
          >
            <title>EMPOWER</title>
          </image>
        </g>
      </g>

      <g
        className={`pv-cure-hero${away ? " pv-cure-hero--away" : ""}`}
        style={
          {
            transform: heroTransform,
            "--travel": `${away ? FLY_AWAY : TRAVEL}ms`,
          } as CSSProperties
        }
      >
        <PvHero />
      </g>
    </svg>
  );
}

export function PvCureSection() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // The engineered P. vulgatus flies on from the balance screen above,
  // turning into the caped one on the way, and lands in the middle of
  // this one.
  useCellToHero({
    stageRef: ref,
    from: ".pv-balance-svg .pv-engineer",
    to: ".pv-cure-svg .pv-hero",
    lengthRatio: HERO.h / CELL.w,
    skip: !!prefersReducedMotion,
  });
  const { at, cleared, away, logo } = useCureSequence(
    ref,
    !prefersReducedMotion,
  );
  return (
    <section className="pv-cure home-snap-screen" data-snap="" ref={ref}>
      {/* Wording supplied by the team, 2026-10-20 (reworded the same day:
          "potentially"). */}
      <h3 className="pv-heading">
        … and potentially achieve a <strong>therapeutic effect</strong> in PMOS
      </h3>
      <PvCureFigure at={at} cleared={cleared} away={away} logo={logo} />
    </section>
  );
}
