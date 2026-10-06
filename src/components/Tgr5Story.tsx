// Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
// Purpose: the last stretch of the home page, after "But why is this
// reaction important?", following the team's "Text for HOME PAGE" (2nd round
// of changes) and the comments on it:
//  - Tgr5MechanismSection: a pinned screen of two scroll steps. First an
//    animated version of the ILC3 part of the team's figure (panels B/C):
//    conjugated bile acids bind TGR5 on the cell, deconjugated ones do not,
//    and less IL-22 leaves the cell. Then the question "But how does this
//    cause issues?" pops up across the whole screen.
//  - Tgr5ConsequencesSection: a pinned screen where the three things the
//    team lists come in one per scroll step, joined by a line that grows
//    from one to the next with a bacterium at its head.
//  - EngineerSection: the team's closing statement beside P. vulgatus drawn
//    with a genetic circuit inside.
//  - FindOutMore: links to the main pages, rolling sideways like the sponsor
//    logos.
// The drawings are ILLUSTRATIONS of the mechanism as the team describes it,
// not data. All wording is the team's; nothing was added where the team's
// notes are still open (see CONSEQUENCES). Motion is off under
// prefers-reduced-motion, where nothing is pinned and everything is shown.
import { useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { SnapSteps } from "./HomeSnapScroll";
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
      aria-label="Illustration: bile acids arrive at the TGR5 receptor on an ILC3 cell. The few conjugated bile acids bind it, the many deconjugated ones do not, and less IL-22 is produced."
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
        d={`M${NUCLEUS.x + 60},${NUCLEUS.y - 38} Q${NUCLEUS.x + 130},${NUCLEUS.y - 110} ${CELL.x + CELL.r + 34},${CELL.y - 72}`}
        markerEnd="url(#tgr5-arrowhead)"
      />
      <circle
        className="tgr5-il22"
        cx={CELL.x + CELL.r + 62}
        cy={CELL.y - 62}
        r={16}
      />
      <text className="tgr5-label" x={CELL.x + CELL.r + 62} y={CELL.y - 18}>
        IL-22
      </text>
      <path
        className="tgr5-down"
        d={`M${CELL.x + CELL.r + 104},${CELL.y - 84} v34 m-11,-12 l11,14 l11,-14`}
      />

      <text className="tgr5-label tgr5-label--cell" x={CELL.x} y={VB_H - 6}>
        ILC3
      </text>

      <BileAcids animate={animate} />
    </svg>
  );
}

export function Tgr5MechanismSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const asking = usePinnedStep(wrapperRef, 2) === 1;

  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={{ "--snap-steps": 2 } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={2} />}
      <div
        className={`tgr5${prefersReducedMotion ? " tgr5--static" : " home-snap-stage"}${asking ? " tgr5--asking" : ""}`}
      >
        <div className="tgr5-figure" inert={asking}>
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
        <div className="tgr5-question" inert={!asking && !prefersReducedMotion}>
          <p className="story-text tgr5-question-text">
            But how does this <strong>cause issues?</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* What inactivating TGR5 contributes to                               */
/* ------------------------------------------------------------------ */

// IL-22 with an arrow down.
function Il22Art() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="tgr5-il22" cx={42} cy={50} r={26} />
      <text
        className="tgr5-label tgr5-label--small tgr5-label--light"
        x={42}
        y={55}
      >
        IL-22
      </text>
      <path
        className="tgr5-down tgr5-bob"
        d="M82,28 v40 m-11,-13 l11,15 l11,-15"
      />
    </svg>
  );
}

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

// Wording as supplied by the team. The explanations for the last two are
// still open in the team's notes ("still thinking what to write").
// TODO(team): add the explanations for insulin resistance and
// hyperandrogenism as `detail` once written.
const CONSEQUENCES: { title: string; detail?: string; art: ReactNode }[] = [
  {
    title: "IL-22 depletion",
    detail: "Meaning more inflammation",
    art: <Il22Art />,
  },
  { title: "Insulin resistance", art: <InsulinArt /> },
  { title: "Hyperandrogenism", art: <AndrogenArt /> },
];

export function Tgr5ConsequencesSection() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const step = usePinnedStep(wrapperRef, CONSEQUENCES.length);
  const shown = prefersReducedMotion ? CONSEQUENCES.length : step + 1;

  return (
    <div
      className={prefersReducedMotion ? undefined : "home-snap-pin"}
      ref={wrapperRef}
      style={{ "--snap-steps": CONSEQUENCES.length } as CSSProperties}
    >
      {!prefersReducedMotion && <SnapSteps steps={CONSEQUENCES.length} />}
      <div
        className={`tgr5-effects${prefersReducedMotion ? " tgr5-effects--static" : " home-snap-stage"}`}
      >
        <h3 className="tgr5-effects-heading">
          Inactivation of TGR5 contributes to
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
        and interfere with <strong>BSH function</strong>
      </p>
      {/* The cell of BshStreamAnimation.tsx, now with a genetic circuit in
          it that acts on BSH (drawn with the usual blunt "inhibits" line). */}
      <svg
        className="engineer-svg"
        viewBox="0 0 300 170"
        role="img"
        aria-label="Illustration: Phocaeicola vulgatus with an engineered genetic circuit inside that interferes with its BSH enzyme."
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

// The pages the team lists; "wet lab" and "dry lab" go to the first page of
// those menus (see pages.ts).
const MORE_LINKS = [
  { label: "Project description", to: "/description" },
  { label: "Wet lab", to: "/experiments" },
  { label: "Dry lab", to: "/dry-lab" },
  { label: "Integrated Human Practices", to: "/human-practices" },
  { label: "Entrepreneurship", to: "/entrepreneurship" },
];

export function FindOutMore() {
  const prefersReducedMotion = useReducedMotion();
  // Enough copies of the set to fill a wide screen twice over, so the loop
  // (which shifts the track by one half) never shows a gap. Only the first
  // set is announced and reachable by keyboard.
  const copies = prefersReducedMotion ? 1 : 4;

  return (
    <div className="find-more">
      <h3 className="find-more-heading">Find out more about EMPOWER:</h3>
      <div
        className={`find-more-band${prefersReducedMotion ? " find-more-band--static" : ""}`}
      >
        <div className="find-more-track">
          {Array.from({ length: copies }, (_, copy) =>
            MORE_LINKS.map((link) => (
              <Link
                key={`${copy}-${link.to}`}
                className="find-more-link"
                to={link.to}
                aria-hidden={copy > 0 || undefined}
                tabIndex={copy > 0 ? -1 : undefined}
              >
                {link.label}
              </Link>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
