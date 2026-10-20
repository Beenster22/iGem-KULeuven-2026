// Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
// Purpose: the last stretch of the home page, after "But why is this
// reaction important?", following the team's "Text for HOME PAGE" (2nd round
// of changes) and the comments on it:
//  - Tgr5MechanismSection: one screen showing which conjugated bile acid
//    binds TGR5 where (added 2026-10-07; redrawn 2026-10-15 as the binding
//    animation in Tgr5BindingDiagram, see there). Cut back
//    to this single screen on 2026-10-08 after Marie's review: the ILC3
//    close-up that followed it and the question "But how does this cause
//    issues?" were both dropped, so the page goes straight from here to the
//    consequences.
//  - Tgr5Ilc3Figure: that ILC3 close-up, kept so the team can use it on
//    another page (registered in mdx-components.ts). An animated version of
//    the ILC3 part of the team's figure (panels B/C): conjugated bile acids
//    bind TGR5 on the cell, deconjugated ones do not, and less IL-22 leaves
//    the cell. Not used on the home page.
//  - Tgr5ConsequencesSection: a pinned screen where the three things the
//    team lists come in one per scroll step, joined by a line that grows
//    from one to the next with a bacterium at its head.
//  - EngineerSection: the team's closing statement beside P. vulgatus drawn
//    with a genetic circuit inside.
//  - FindOutMore: boxes linking to the main pages (and the special prizes).
// The drawings are ILLUSTRATIONS of the mechanism as the team describes it,
// not data. All wording is the team's; nothing was added where the team's
// notes are still open (see CONSEQUENCES). Motion is off under
// prefers-reduced-motion, where nothing is pinned and everything is shown.
import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
import {
  BubblesIcon,
  LightbulbIcon,
  MagnifierIcon,
  RocketIcon,
  RulerIcon,
} from "./FindOutMoreIcons";
import { usePinnedStep } from "./usePinnedStep";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const HEX_R = 12;
const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return `${(HEX_R * Math.cos(angle)).toFixed(2)},${(HEX_R * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

/* ------------------------------------------------------------------ */
/* TGR5 mechanism                                                      */
/* ------------------------------------------------------------------ */

const VB_W = 760;
const VB_H = 400;
const CELL = { x: 440, y: 200, r: 165 };
const NUCLEUS = { x: 462, y: 196, r: 98 };
// Where a bile acid docks: the outer end of the TGR5 receptor, which sits in
// the membrane on the cell's left.
const DOCK = { x: 252, y: 200 };
// The IL-22 that has left the cell. Moved down level with the middle of the
// cell on Marie's review comment (2026-10-08), where it sat well above it.
const IL22_OUT = { x: CELL.x + CELL.r + 62, y: CELL.y - 18 };

interface BileAcid {
  id: number;
  conjugated: boolean;
  path: string;
  duration: number;
  delay: number;
  rest: [number, number];
}

// Mostly deconjugated bile acids, which come up to the receptor and drift
// off again, with a few conjugated ones left that still reach it and bind
// (team comment: "leave some of the conjugated bile acids still present").
function buildBileAcids(): BileAcid[] {
  return Array.from({ length: 8 }, (_, i) => {
    const r = (k: number) => seededValue(i * 13 + k);
    const conjugated = i % 4 === 0;
    const startY = 50 + r(1) * 300;
    const start = `M${20 + r(2) * 30},${startY}`;
    const duration = 5.5 + r(3) * 2.5;
    const delay = -((i + r(4) * 0.5) / 8) * duration;
    if (conjugated) {
      return {
        id: i,
        conjugated,
        duration,
        delay,
        path: `${start} C110,${startY} 170,${DOCK.y} ${DOCK.x - HEX_R - 4},${DOCK.y}`,
        rest: [150, startY],
      };
    }
    // Turns away just short of the receptor, up or down.
    const away = r(5) > 0.5 ? 1 : -1;
    const nearY = DOCK.y + away * (22 + r(6) * 18);
    const endY = away > 0 ? 330 + r(7) * 50 : 70 - r(7) * 50;
    return {
      id: i,
      conjugated,
      duration,
      delay,
      path: `${start} C110,${startY} 180,${nearY} ${DOCK.x - 26},${nearY} S${130 + r(8) * 60},${endY} ${60 + r(9) * 60},${endY}`,
      rest: [70 + r(8) * 130, startY],
    };
  });
}

function BileAcidShape({ conjugated }: { conjugated: boolean }) {
  return conjugated ? (
    <>
      <line
        className="bsh-bond"
        x1={-HEX_R + 1}
        y1={0}
        x2={-HEX_R - 8}
        y2={0}
      />
      <circle className="bsh-tag" cx={-HEX_R - 14} cy={0} r={6} />
      <polygon className="bsh-hex bsh-hex--conjugated" points={HEX_POINTS} />
    </>
  ) : (
    <polygon className="bsh-hex bsh-hex--deconjugated" points={HEX_POINTS} />
  );
}

function BileAcids({ animate }: { animate: boolean }) {
  const acids = useMemo(buildBileAcids, []);
  return (
    <>
      {acids.map((acid) =>
        animate ? (
          <g key={acid.id} opacity={0}>
            <BileAcidShape conjugated={acid.conjugated} />
            <animateMotion
              dur={`${acid.duration}s`}
              begin={`${acid.delay}s`}
              repeatCount="indefinite"
              path={acid.path}
              // A conjugated one stays docked for the last part of its loop.
              {...(acid.conjugated && {
                calcMode: "linear",
                keyTimes: "0;0.6;1",
                keyPoints: "0;1;1",
              })}
            />
            <animate
              attributeName="opacity"
              dur={`${acid.duration}s`}
              begin={`${acid.delay}s`}
              repeatCount="indefinite"
              values="0;1;1;0"
              keyTimes="0;0.08;0.9;1"
            />
          </g>
        ) : (
          <g
            key={acid.id}
            transform={`translate(${acid.rest[0]},${acid.rest[1]})`}
          >
            <BileAcidShape conjugated={acid.conjugated} />
          </g>
        ),
      )}
    </>
  );
}

function Tgr5Diagram({ animate }: { animate: boolean }) {
  return (
    <svg
      className="tgr5-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="Illustration: bile acids arrive at the TGR5 receptor on an immune cell. The few conjugated bile acids bind it, the many deconjugated ones do not, and less IL-22 is produced."
    >
      <defs>
        <marker
          id="tgr5-arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" className="tgr5-arrow-head" />
        </marker>
      </defs>

      <circle className="tgr5-cell" cx={CELL.x} cy={CELL.y} r={CELL.r} />
      <circle
        className="tgr5-nucleus"
        cx={NUCLEUS.x}
        cy={NUCLEUS.y}
        r={NUCLEUS.r}
      />

      {/* TGR5: a bundle of helices through the membrane. */}
      <g className="tgr5-receptor">
        {[-18, -6, 6, 18].map((dy, i) => (
          <rect
            key={dy}
            x={DOCK.x + 2}
            y={DOCK.y + dy - 5}
            width={54}
            height={10}
            rx={5}
            transform={`rotate(${i % 2 ? 7 : -7} ${DOCK.x + 29} ${DOCK.y + dy})`}
          />
        ))}
      </g>
      <text
        className="tgr5-label tgr5-label--dark"
        x={DOCK.x + 34}
        y={DOCK.y + 54}
      >
        TGR5
      </text>

      {/* Signal from the receptor to the nucleus. */}
      <path
        className="tgr5-arrow tgr5-arrow--signal"
        d={`M${DOCK.x + 62},${DOCK.y + 14} Q${DOCK.x + 110},${DOCK.y + 70} ${NUCLEUS.x - 62},${NUCLEUS.y + 34}`}
        markerEnd="url(#tgr5-arrowhead)"
      />

      {/* In the nucleus: GATA3 switching on the IL-22 gene. */}
      <path
        className="tgr5-dna"
        d={`M${NUCLEUS.x - 70},${NUCLEUS.y + 12} q10,-12 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0`}
      />
      <rect
        className="tgr5-factor"
        x={NUCLEUS.x - 74}
        y={NUCLEUS.y - 22}
        width={66}
        height={28}
        rx={14}
      />
      <text
        className="tgr5-label tgr5-label--small tgr5-label--light"
        x={NUCLEUS.x - 41}
        y={NUCLEUS.y - 3}
      >
        GATA3
      </text>
      <path
        className="tgr5-arrow tgr5-arrow--gene"
        d={`M${NUCLEUS.x - 4},${NUCLEUS.y + 2} v-22 h14`}
        markerEnd="url(#tgr5-arrowhead)"
      />
      <rect
        className="tgr5-gene"
        x={NUCLEUS.x + 14}
        y={NUCLEUS.y - 34}
        width={60}
        height={28}
        rx={4}
      />
      <text
        className="tgr5-label tgr5-label--small tgr5-label--light"
        x={NUCLEUS.x + 44}
        y={NUCLEUS.y - 15}
      >
        IL-22
      </text>

      {/* IL-22 leaving the cell: less of it. */}
      <path
        className="tgr5-arrow"
        d={`M${NUCLEUS.x + 78},${NUCLEUS.y - 20} Q${CELL.x + CELL.r - 28},${IL22_OUT.y - 44} ${IL22_OUT.x - 22},${IL22_OUT.y - 4}`}
        markerEnd="url(#tgr5-arrowhead)"
      />
      <circle className="tgr5-il22" cx={IL22_OUT.x} cy={IL22_OUT.y} r={16} />
      <text className="tgr5-label" x={IL22_OUT.x} y={IL22_OUT.y + 38}>
        IL-22
      </text>
      <path
        className="tgr5-down"
        d={`M${IL22_OUT.x + 42},${IL22_OUT.y - 22} v34 m-11,-12 l11,14 l11,-14`}
      />

      <text className="tgr5-label tgr5-label--cell" x={CELL.x} y={VB_H - 6}>
        Immune cell
      </text>

      <BileAcids animate={animate} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TGR5 on an immune cell and in the gut: which bile acid binds where     */
/* ------------------------------------------------------------------ */

// Added with Claude Opus 5.5 (Anthropic), 2026-10-07; redrawn 2026-10-15
// (team requests): the detail is gone (no L cell, GLP-1, insulin, IL-22 or
// outcomes). Two halves: on the left one large immune cell (was "ILC3") with
// TGR5 on top, on the right a stretch of gut epithelium with TGR5 on a villus.
// Above them a pool of all four bile acids of the BSH section (both
// conjugated and both deconjugated, in the same colours, see
// .bsh-molecule--1 in App.css) drifts about, and now and then one goes down
// to a receptor. Each receptor binds one of the two conjugated bile acids
// more strongly: the upper-stream one (then yellow, now orange) at the
// immune cell, the lower-stream one (purple) in the gut (confirmed by
// the team, 2026-10-15). Not a hard exclusion (team request): the other
// conjugated one binds too, only less often and briefly. Deconjugated bile
// acids come close and turn away, as in the team's ILC3 figure
// (Tgr5Ilc3Figure above).
// When the diagram comes into view the bile acids pour in from the top of
// the screen (from the BSH section above, as it were) and settle into the
// pool. Edited 2026-10-15 (team feedback): this used to be a stream tied to
// the scroll position between the two sections; it is now a short timed
// animation that plays by itself, again each time the diagram comes back
// into view. Everything runs in one requestAnimationFrame loop
// (useBindingLoop), so an arriving bile acid lands on its live spot in the
// pool.
const OV_W = 1000;
const OV_H = 520;
// The gut wall: villi drawn as one band that winds up and down. `r` is the
// radius of each turn, so a villus and the gap after it take up 4r.
const GUT = { x: 580, top: 260, bottom: 470, r: 30, villi: 3, receptor: 1 };
const GUT_RECEPTOR_X = GUT.x + GUT.r * 4 * GUT.receptor + GUT.r;
const IMMUNE = { x: 250, y: 370, r: 110 };
// Half the length of a receptor standing upright (see ReceptorShape).
const RECEPTOR_HALF = 27;
// The bile acids are drawn larger here than in the rest of the page.
// Edited with Claude Opus 5 (Anthropic), 2026-10-20: briefly 11/12, to
// match the BSH reaction, but the team want this screen at the size it
// had been, so it is back at 1.6. The acids that fly down to it take
// their size from here (useBileAcidFlight.ts imports this), so they wait
// and fall at this size too and nothing changes size on the way.
export const ACID_SCALE = 1.6;
// How far above the top of a receptor a docked bile acid sits.
const ACID_R = HEX_R * ACID_SCALE;
const DOCK_GAP = RECEPTOR_HALF + ACID_R + 3;
// Where the pool is: the band above the two cells.
const POOL = { left: 60, right: 940, top: 40, bottom: 175 };

function buildGutPath() {
  const { x, top, bottom, r, villi } = GUT;
  let d = `M${x},${top + r}`;
  for (let i = 0; i < villi; i++) {
    d += ` a${r},${r} 0 0 1 ${2 * r},0 V${bottom - r}`;
    // After the last villus the band runs off downwards instead of turning.
    d +=
      i < villi - 1
        ? ` a${r},${r} 0 0 0 ${2 * r},0 V${top + r}`
        : ` V${bottom}`;
  }
  return d;
}

// A receptor standing in a membrane that runs left to right through (x, y):
// a bundle of helices.
function ReceptorShape({ x, y }: { x: number; y: number }) {
  return (
    <g className="tgr5-receptor" transform={`translate(${x} ${y}) rotate(90)`}>
      {[-18, -6, 6, 18].map((dy, i) => (
        <rect
          key={dy}
          x={-RECEPTOR_HALF}
          y={dy - 5}
          width={RECEPTOR_HALF * 2}
          height={10}
          rx={5}
          transform={`rotate(${i % 2 ? 7 : -7} 0 ${dy})`}
        />
      ))}
    </g>
  );
}

type Point = [number, number];
// 0 is the upper-stream pair of the BSH section (orange conjugated, yellow
// deconjugated), 1 the lower-stream pair (dark/light purple).
type AcidKind = 0 | 1;

interface Site {
  x: number;
  top: number;
  dock: Point;
  // Which way is away from the middle of the diagram.
  away: -1 | 1;
}

const SITES: Site[] = [
  {
    x: IMMUNE.x,
    top: IMMUNE.y - IMMUNE.r,
    dock: [IMMUNE.x, IMMUNE.y - IMMUNE.r - DOCK_GAP],
    away: -1,
  },
  {
    x: GUT_RECEPTOR_X,
    top: GUT.top,
    dock: [GUT_RECEPTOR_X, GUT.top - DOCK_GAP],
    away: 1,
  },
];

interface PoolAcid {
  id: number;
  kind: AcidKind;
  conjugated: boolean;
  // Drifting about its home: amplitude, period (s) and phase in x and y.
  home: Point;
  amp: Point;
  period: Point;
  phase: Point;
  // Pouring in: where across the screen top it comes from (0-1), how late
  // it sets off (s), and how much it turns on the way.
  entryX: number;
  delay: number;
  spin: number;
}

// Four of each: conjugated orange (0-3), conjugated dark purple (4-7),
// deconjugated yellow (8-11), deconjugated light purple (12-15). The homes are a
// jittered 8 x 2 grid over the pool, shuffled so the colours mix.
const ACID_COUNT = 16;
// Pouring in: each bile acid sets off up to ENTRY_STAGGER s after the first
// and takes ENTRY_FLIGHT s to land.
const ENTRY_STAGGER = 1.2;
const ENTRY_FLIGHT = 1.8;
function buildPool(): PoolAcid[] {
  const slots = Array.from({ length: ACID_COUNT }, (_, i) => i).sort(
    (a, b) => seededValue(a + 700) - seededValue(b + 700),
  );
  return Array.from({ length: ACID_COUNT }, (_, i) => {
    const r = (k: number) => seededValue(i * 17 + k + 500);
    const kind = (Math.floor(i / 4) % 2) as AcidKind;
    const conjugated = i < 8;
    const slot = slots[i];
    const col = slot % 8;
    const row = Math.floor(slot / 8);
    const cellW = (POOL.right - POOL.left) / 8;
    const cellH = (POOL.bottom - POOL.top) / 2;
    return {
      id: i,
      kind,
      conjugated,
      home: [
        POOL.left + cellW * (col + 0.2 + r(3) * 0.6),
        POOL.top + cellH * (row + 0.25 + r(4) * 0.5),
      ],
      amp: [18 + r(5) * 22, 10 + r(6) * 12],
      period: [5 + r(7) * 4, 4 + r(8) * 3],
      phase: [r(9) * Math.PI * 2, r(10) * Math.PI * 2],
      entryX: r(1),
      delay: r(11) * ENTRY_STAGGER,
      spin: (r(13) - 0.5) * 2,
    };
  });
}

// One loop of BIND_LOOP seconds: who goes to which receptor, and when
// (seconds into the loop). "dock" binds, "near" comes close and turns away.
// Each receptor is visited by its preferred conjugated bile acid twice, for
// long, and by the other conjugated one once, briefly.
const BIND_LOOP = 24;
interface BindEvent {
  acid: number;
  site: 0 | 1;
  type: "dock" | "near";
  start: number;
  arrive: number;
  leave: number;
  end: number;
}
const ev = (
  acid: number,
  site: 0 | 1,
  type: "dock" | "near",
  start: number,
  hold: number,
): BindEvent => ({
  acid,
  site,
  type,
  start,
  arrive: 1.8,
  leave: 1.8 + hold,
  end: 1.8 + hold + 1.6,
});
const BIND_EVENTS: BindEvent[] = [
  // Immune cell: prefers orange.
  ev(0, 0, "dock", 0, 6.2),
  ev(8, 0, "near", 5, 0),
  ev(12, 0, "near", 9.4, 0),
  ev(4, 0, "dock", 11.6, 0.9),
  ev(1, 0, "dock", 15.2, 5.4),
  // Gut: prefers dark purple.
  ev(5, 1, "dock", 12, 6.2),
  ev(13, 1, "near", 17, 0),
  ev(9, 1, "near", 21.4, 0),
  ev(2, 1, "dock", 23.6, 0.9),
  ev(6, 1, "dock", 3.2, 5.4),
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

// Where a bile acid is in the pool diagram `t` seconds in, and the receptor
// it is bound to (with how long it has been bound), if any.
function poolPosition(
  acid: PoolAcid,
  t: number,
): { at: Point; bound?: { site: 0 | 1; since: number } } {
  const drift: Point = [
    acid.home[0] + acid.amp[0] * Math.sin((t / acid.period[0]) * 2 * Math.PI + acid.phase[0]),
    acid.home[1] + acid.amp[1] * Math.sin((t / acid.period[1]) * 2 * Math.PI + acid.phase[1]),
  ];
  for (const e of BIND_EVENTS) {
    if (e.acid !== acid.id) continue;
    const local = (((t - e.start) % BIND_LOOP) + BIND_LOOP) % BIND_LOOP;
    if (local >= e.end) continue;
    const site = SITES[e.site];
    const target: Point =
      e.type === "dock"
        ? site.dock
        : [site.dock[0] - site.away * 40, site.dock[1] - 36];
    const pull =
      local < e.arrive
        ? smooth(local / e.arrive)
        : local < e.leave
          ? 1
          : 1 - smooth((local - e.leave) / (e.end - e.leave));
    const bound =
      e.type === "dock" && local >= e.arrive && local < e.leave
        ? { site: e.site, since: local - e.arrive }
        : undefined;
    return { at: lerp(drift, target, pull), bound };
  }
  return { at: drift };
}

// A ring pulses out from a bound bile acid every RING_EVERY seconds.
const RING_EVERY = 1.4;

function AcidShape({ conjugated }: { conjugated: boolean }) {
  return conjugated ? (
    <BileAcidShape conjugated />
  ) : (
    <polygon className="bsh-hex bsh-hex--deconjugated" points={HEX_POINTS} />
  );
}

interface LoopRefs {
  svg: RefObject<SVGSVGElement | null>;
  acids: RefObject<(SVGGElement | null)[]>;
  rings: RefObject<(SVGCircleElement | null)[]>;
}

function useBindingLoop(acids: PoolAcid[], refs: LoopRefs, enabled: boolean) {
  useEffect(() => {
    const svg = refs.svg.current;
    if (!enabled || !svg) return;
    let frame = 0;
    let visible = false;
    const start = performance.now();
    // When the bile acids started pouring in (null until the diagram is in
    // view), and from where: the top of the screen in the diagram's units.
    let entryAt: number | null = null;
    let entryTop = -400;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.35 && entryAt === null) {
          entryAt = performance.now();
          const ctm = svg.getScreenCTM();
          entryTop = ctm ? (-60 - ctm.f) / ctm.d : -400;
        } else if (!entry.isIntersecting) {
          // Out of view: pour them in again next time.
          entryAt = null;
        }
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(svg);

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (now - start) / 1000;
      const states = acids.map((acid) => poolPosition(acid, t));
      const sinceEntry = entryAt === null ? -1 : (now - entryAt) / 1000;

      states.forEach((s, i) => {
        const el = refs.acids.current[i];
        if (!el) return;
        const acid = acids[i];
        const k = clamp01((sinceEntry - acid.delay) / ENTRY_FLIGHT);
        if (k >= 1) {
          el.setAttribute(
            "transform",
            `translate(${s.at[0].toFixed(1)} ${s.at[1].toFixed(1)})`,
          );
          el.setAttribute("opacity", "1");
          return;
        }
        // Falls from the top of the screen, swaying, slowing as it lands.
        const e = 1 - Math.pow(1 - k, 3);
        const fromX = POOL.left + acid.entryX * (POOL.right - POOL.left);
        const x =
          fromX +
          (s.at[0] - fromX) * e +
          30 * Math.sin(Math.PI * k) * Math.sin(2 * Math.PI * (1.5 * k + acid.entryX));
        const y = entryTop + (s.at[1] - entryTop) * e;
        const rotate = 200 * acid.spin * (1 - e);
        el.setAttribute(
          "transform",
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)})`,
        );
        el.setAttribute("opacity", clamp01(k * 6).toFixed(2));
      });

      SITES.forEach((_, site) => {
        const ring = refs.rings.current[site];
        if (!ring) return;
        const boundIndex = states.findIndex(
          (s, i) =>
            s.bound?.site === site &&
            sinceEntry - acids[i].delay >= ENTRY_FLIGHT,
        );
        const bound = states[boundIndex]?.bound;
        // In the colour of whichever bile acid is bound.
        if (bound) {
          ring.setAttribute(
            "class",
            `tgr5-bind-pulse tgr5-bind-pulse--${acids[boundIndex].kind}`,
          );
        }
        const age = bound ? (bound.since % RING_EVERY) / RING_EVERY : 1;
        ring.setAttribute("r", (ACID_R * (1 + 1.6 * age)).toFixed(1));
        ring.setAttribute("opacity", (0.9 * (1 - age)).toFixed(2));
      });
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [acids, refs, enabled]);
}

function Tgr5BindingDiagram({ animate }: { animate: boolean }) {
  const gutPath = useMemo(buildGutPath, []);
  const acids = useMemo(buildPool, []);
  const svgRef = useRef<SVGSVGElement>(null);
  const acidRefs = useRef<(SVGGElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const refs = useMemo<LoopRefs>(
    () => ({ svg: svgRef, acids: acidRefs, rings: ringRefs }),
    [],
  );
  useBindingLoop(acids, refs, animate);

  // Without motion: everything at home, with the preferred bile acid bound
  // at each receptor.
  const staticAt = (acid: PoolAcid): Point =>
    acid.id === 0 ? SITES[0].dock : acid.id === 5 ? SITES[1].dock : acid.home;

  return (
    <svg
      ref={svgRef}
      className="tgr5-svg tgr5-svg--overview"
      viewBox={`0 0 ${OV_W} ${OV_H}`}
      role="img"
      aria-label="Illustration: a mixture of conjugated and deconjugated bile acids above TGR5 receptors on an immune cell and on an epithelial cell of the gut. Each receptor binds one of the two conjugated bile acids more often and for longer, and the other one only now and then; the deconjugated bile acids come close but do not bind."
    >
      <circle
        className="tgr5-cell"
        cx={IMMUNE.x}
        cy={IMMUNE.y}
        r={IMMUNE.r}
      />
      <text
        className="tgr5-label tgr5-label--dark"
        x={IMMUNE.x}
        y={IMMUNE.y + 8}
      >
        Immune cell
      </text>

      {/* The gut wall as villi; the dashes mark off its cells. */}
      <path className="tgr5-gut tgr5-gut--edge" d={gutPath} />
      <path className="tgr5-gut" d={gutPath} />
      <path className="tgr5-gut tgr5-gut--cells" d={gutPath} />
      <text className="tgr5-label" x={GUT_RECEPTOR_X} y={OV_H - 8}>
        Epithelial cell
      </text>

      {SITES.map((site, i) => (
        <g key={site.x}>
          <ReceptorShape x={site.x} y={site.top} />
          <text
            className="tgr5-label tgr5-label--start"
            x={site.x + 34}
            y={site.top - 14}
          >
            TGR5
          </text>
          {/* The pulse ring, in the colour of the bile acid bound (set by
              useBindingLoop); site i prefers kind i. */}
          <circle
            className={`tgr5-bind-pulse tgr5-bind-pulse--${i}`}
            cx={site.dock[0]}
            cy={site.dock[1]}
            r={animate ? ACID_R : ACID_R * 1.8}
            opacity={animate ? 0 : 1}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
          />
        </g>
      ))}

      {/* Hidden until they pour in (see useBindingLoop).
          Edited with Claude Opus 5 (Anthropic), 2026-10-19 (team request):
          named so the acids flying down from the BSH screen can land on
          them and hand over (see useBileAcidFlight.ts); --acids-in keeps
          the pool waiting until that moment. */}
      <g className="tgr5-pool">
        {acids.map((acid, i) => {
          const at = staticAt(acid);
          return (
            <g
              key={acid.id}
              className={`tgr5-pool-acid bsh-molecule--${acid.kind}`}
              transform={`translate(${at[0]} ${at[1]})`}
              opacity={animate ? 0 : undefined}
              ref={(el) => {
                acidRefs.current[i] = el;
              }}
            >
              <g transform={`scale(${ACID_SCALE})`}>
                <AcidShape conjugated={acid.conjugated} />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// One screen, so one snap stop.
const MECHANISM_STEPS = 1;

export function Tgr5MechanismSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      style={{ "--snap-steps": MECHANISM_STEPS } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={MECHANISM_STEPS} />}
      <div
        className={`tgr5${prefersReducedMotion ? " tgr5--static" : " home-snap-stage"}`}
      >
        <div className="tgr5-figures">
          <div className="tgr5-figure">
            {/* TODO(team): heading written by the assistant from the review
              comment, not supplied by the team. Check or replace. */}
            <h3 className="tgr5-heading">
              Conjugated bile acids bind TGR5 receptors on cells in the gut
            </h3>
            <Tgr5BindingDiagram animate={!prefersReducedMotion} />
          </div>
        </div>
      </div>
    </div>
  );
}

// The ILC3 close-up that used to be the second step of the screen above.
// Taken off the home page on Marie's review (2026-10-08) but kept whole, so
// it can go on another page: drop <Tgr5Ilc3Figure /> into any .mdx file.
export function Tgr5Ilc3Figure() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="tgr5-figure">
      <h3 className="tgr5-heading">
        Deconjugation of bile acids depletes levels of IL-22 through a TGR5
        receptor
      </h3>
      <Tgr5Diagram animate={!prefersReducedMotion} />
      <ul className="tgr5-legend">
        <li>
          <svg viewBox="-34 -14 48 28" aria-hidden="true">
            <BileAcidShape conjugated />
          </svg>
          conjugated bile acid
        </li>
        <li>
          <svg viewBox="-14 -14 28 28" aria-hidden="true">
            <BileAcidShape conjugated={false} />
          </svg>
          deconjugated bile acid
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* What inactivating TGR5 contributes to                               */
/* ------------------------------------------------------------------ */

// A drop with a glucose ring in it.
function InsulinArt() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path
        className="tgr5-drop tgr5-bob"
        d="M50,10 C50,10 22,46 22,64 a28,28 0 0 0 56,0 C78,46 50,10 50,10 Z"
      />
      <polygon
        className="tgr5-ring"
        points={HEX_POINTS}
        transform="translate(50 64) scale(1.15)"
      />
    </svg>
  );
}

// The four rings of a steroid hormone, with an arrow up.
function AndrogenArt() {
  const hex = (cx: number, cy: number) => (
    <polygon
      className="tgr5-ring"
      points={HEX_POINTS}
      transform={`translate(${cx} ${cy}) scale(1.05)`}
    />
  );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(-4 8) scale(0.85)">
        {hex(20, 66)}
        {hex(41.8, 66)}
        {hex(52.7, 47.1)}
        <polygon
          className="tgr5-ring"
          points="63.6,40.8 76,37 83,47.1 76,57.2 63.6,53.4"
        />
      </g>
      <path
        className="tgr5-up tgr5-bob"
        d="M84,72 v-40 m-11,13 l11,-15 l11,15"
      />
    </svg>
  );
}

// A follicle that keeps its egg: the release is crossed out.
function AnovulationArt() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="tgr5-ring" cx={44} cy={56} r={32} />
      <circle className="tgr5-il22" cx={44} cy={56} r={13} />
      <path className="tgr5-down" d="M70,12 l22,22 m0,-22 l-22,22" />
    </svg>
  );
}

// The three the team lists in its review of the home page (2026-10-07), in
// that order; they replace the earlier "IL-22 depletion — Meaning more
// inflammation" as first item. The explanations are still open in the team's
// notes ("still thinking what to write").
// TODO(team): add the explanations as `detail` once written.
const CONSEQUENCES: { title: string; detail?: string; art: ReactNode }[] = [
  { title: "Hyperinsulinaemia", art: <InsulinArt /> },
  { title: "Anovulation", art: <AnovulationArt /> },
  { title: "Hyperandrogenism", art: <AndrogenArt /> },
];

// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team feedback: the
// third consequence was too easy to skip): the last one stays on screen for
// this many extra steps of scrolling (--snap-extra, see .home-snap-pin).
const LAST_STEP_EXTRA = 2;

export function Tgr5ConsequencesSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const step = usePinnedStep(wrapperRef, CONSEQUENCES.length, LAST_STEP_EXTRA);
  const shown = prefersReducedMotion ? CONSEQUENCES.length : step + 1;

  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={
        {
          "--snap-steps": CONSEQUENCES.length,
          "--snap-extra": prefersReducedMotion ? 0 : LAST_STEP_EXTRA,
        } as CSSProperties
      }
    >
      {!prefersReducedMotion && <SnapSteps steps={CONSEQUENCES.length} />}
      <div
        className={`tgr5-effects${prefersReducedMotion ? " tgr5-effects--static" : " home-snap-stage"}`}
      >
        {/* Retitled on Marie's review (2026-10-08): TGR5 is not inactivated.
            Reworded on team request (2026-10-16). Reworded again on team
            feedback (2026-10-17): the jump from the binding diagram above to
            this screen read as a non sequitur, so the title now names "this
            binding" explicitly and states the causal step (unbalanced pool
            -> less binding) before its consequences. */}
        <h3 className="tgr5-effects-heading">
          If the bile acid pool is unbalanced, this binding happens less.
          This may lead to:
        </h3>
        <ol
          className="tgr5-effects-list"
          style={
            {
              "--count": CONSEQUENCES.length,
              "--shown": shown,
            } as CSSProperties
          }
        >
          {/* The line joining the items, grown as far as the newest one,
              with a bacterium at its head. */}
          <li className="tgr5-effects-line" aria-hidden="true">
            <span className="tgr5-effects-line-fill" />
            <span className="tgr5-effects-line-head" />
          </li>
          {CONSEQUENCES.map((entry, i) => (
            <li
              key={entry.title}
              className={`tgr5-effect${i < shown ? " tgr5-effect--shown" : ""}`}
              inert={i >= shown}
            >
              <div className="tgr5-effect-art">{entry.art}</div>
              <h4 className="tgr5-effect-title">{entry.title}</h4>
              {entry.detail && (
                <p className="tgr5-effect-detail">{entry.detail}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Why we engineer P. vulgatus                                         */
/* ------------------------------------------------------------------ */

export function EngineerSection() {
  return (
    <div className="engineer">
      <p className="story-text engineer-text">
        This is why we want to <strong>engineer</strong> <em>P. vulgatus</em>{" "}
        to restore bile acid balance and achieve a therapeutic effect in <strong>PMOS</strong>
      </p>
      {/* The cell of BshStreamAnimation.tsx, now with a genetic circuit in
          it that silences BSH (drawn with the usual blunt "inhibits" line). */}
      <svg
        className="engineer-svg"
        viewBox="0 0 300 170"
        role="img"
        aria-label="Illustration: Phocaeicola vulgatus with an engineered genetic circuit inside that silences expression of its BSH enzyme."
      >
        <rect
          className="bsh-membrane-outer"
          x={6}
          y={6}
          width={288}
          height={158}
          rx={79}
        />
        <rect
          className="bsh-membrane-inner"
          x={16}
          y={16}
          width={268}
          height={138}
          rx={69}
        />
        <g className="engineer-circuit">
          <line className="engineer-dna" x1={52} y1={72} x2={176} y2={72} />
          <path
            className="engineer-promoter"
            d="M62,72 v-20 h16 m-7,-6 l8,6 l-8,6"
          />
          <rect
            className="engineer-part engineer-part--a"
            x={86}
            y={61}
            width={36}
            height={22}
            rx={4}
          />
          <rect
            className="engineer-part engineer-part--b"
            x={128}
            y={61}
            width={36}
            height={22}
            rx={4}
          />
          <path className="engineer-terminator" d="M172,72 v-14 m-7,0 h14" />
        </g>
        <path
          className="engineer-inhibit"
          d="M146,86 v20 q0,12 14,12 h14 m0,-10 v20"
        />
        <rect
          className="engineer-bsh"
          x={182}
          y={98}
          width={78}
          height={40}
          rx={20}
        />
        <text className="engineer-bsh-label" x={221} y={124}>
          BSH
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Find out more                                                       */
/* ------------------------------------------------------------------ */

// The pages the team lists, as boxes (the team's note of 2026-10-17). Each
// special prize card links to its own dedicated page.
interface MoreCard {
  title: string;
  tagline: string;
  to: string;
  icon: ReactNode;
  specialPrize?: boolean;
}

const MORE_CARDS: MoreCard[] = [
  {
    title: "Project Description",
    tagline: "Find the details here",
    to: "/description",
    icon: <LightbulbIcon />,
  },
  {
    title: "Results",
    tagline: "See what we discovered",
    to: "/results",
    icon: <MagnifierIcon />,
  },
  {
    title: "Best Measurement",
    tagline: "Our measurement work",
    to: "/measurement",
    icon: <RulerIcon />,
    specialPrize: true,
  },
  {
    title: "Integrated Human Practices",
    tagline: "How people shaped EMPOWER",
    to: "/human-practices",
    icon: <BubblesIcon />,
    specialPrize: true,
  },
  {
    title: "Entrepreneurship",
    tagline: "From idea to licensing deal",
    to: "/entrepreneurship",
    icon: <RocketIcon />,
    specialPrize: true,
  },
];

export function FindOutMore() {
  return (
    <div className="find-more">
      <h3 className="find-more-heading">Find out more about EMPOWER:</h3>
      <div className="find-more-cards">
        {MORE_CARDS.map((card, index) => (
          <Link
            key={card.to}
            className={`find-more-card find-more-card--${index % 2 === 0 ? "dark" : "light"}`}
            to={card.to}
          >
            <span className="find-more-card-art">{card.icon}</span>
            <span className="find-more-card-title">{card.title}</span>
            <span className="find-more-card-tagline">{card.tagline}</span>
            {card.specialPrize && (
              <span className="find-more-card-prize">
                <span aria-hidden="true">★</span> Special prize{" "}
                <span aria-hidden="true">★</span>
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
