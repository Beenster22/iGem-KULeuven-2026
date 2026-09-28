// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Purpose: home-page section between "What is PMOS?" and the inflammation
// slider — an animated version of the team's abstract figure (panel A):
// conjugated bile acids (pale hexagon + attached glycine/taurine group)
// stream in from the left, disappear into P. vulgatus where BSH acts, and
// leave on the right as a red deconjugated bile acid with the amino-acid
// group split off and drifting away separately — so the deconjugation step
// itself is what the motion shows. Each molecule runs one synced SMIL
// lifecycle (enter -> inside -> split and exit) with zero JS per frame;
// layout variation comes from a deterministic seededValue so it's stable
// across renders. Labels are HTML (not SVG text) so they stay readable when
// the diagram scales down on phones.
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const VB_W = 1000;
const VB_H = 300;

// Bacterium: horizontal double-membrane capsule like the abstract figure.
const BAC_X = 380;
const BAC_Y = 72;
const BAC_W = 240;
const BAC_H = 116;
const BAC_MID_Y = BAC_Y + BAC_H / 2;
const BAC_LEFT = BAC_X;
const BAC_RIGHT = BAC_X + BAC_W;

const ARROW_Y = 228;
const MOLECULE_COUNT = 7;
const HEX_R = 11;
const TAG_R = 6;

const HEX_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return `${(HEX_R * Math.cos(angle)).toFixed(2)},${(HEX_R * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

// Fractions of each molecule's loop: travelling in, hidden inside the cell
// (BSH acting), then the two products leaving.
const IN_END = 0.42;
const OUT_START = 0.56;

function bezierPath(x1: number, y1: number, x2: number, y2: number, curve: number) {
  const c1x = x1 + (x2 - x1) * 0.35;
  const c2x = x1 + (x2 - x1) * 0.7;
  return `M${x1},${y1} C${c1x},${y1 + curve} ${c2x},${y2 + curve * 0.4} ${x2},${y2}`;
}

interface Molecule {
  id: number;
  duration: number;
  delay: number;
  inPath: string;
  hexOutPath: string;
  tagOutPath: string;
  // Resting positions for the reduced-motion (static) version.
  staticIn: [number, number];
  staticHexOut: [number, number];
  staticTagOut: [number, number];
}

function buildMolecules(): Molecule[] {
  return Array.from({ length: MOLECULE_COUNT }, (_, i) => {
    const r = (k: number) => seededValue(i * 11 + k);
    const duration = 6.5 + r(1) * 2.5;
    // Evenly staggered around the loop (plus jitter) so the stream is steady.
    const delay = -((i + r(2) * 0.5) / MOLECULE_COUNT) * duration;

    const startX = 150 + r(3) * 60;
    const startY = 50 + r(4) * 200;
    const entryY = BAC_MID_Y + (r(5) - 0.5) * 30;
    const curve = (r(6) > 0.5 ? 1 : -1) * (12 + r(7) * 20);

    const exitY = BAC_MID_Y + (r(8) - 0.5) * 30;
    const hexEnd: [number, number] = [760 + r(9) * 40, 45 + r(10) * 190];
    // Glycine/taurine peels away in the opposite vertical direction.
    const tagEnd: [number, number] = [
      720 + r(12) * 50,
      hexEnd[1] < BAC_MID_Y ? hexEnd[1] + 50 + r(13) * 40 : hexEnd[1] - 50 - r(13) * 40,
    ];

    return {
      id: i,
      duration,
      delay,
      inPath: bezierPath(startX, startY, BAC_LEFT + 30, entryY, curve),
      hexOutPath: bezierPath(BAC_RIGHT - 30, exitY, hexEnd[0], hexEnd[1], -curve * 0.6),
      tagOutPath: bezierPath(BAC_RIGHT - 30, exitY, tagEnd[0], tagEnd[1], curve * 0.8),
      staticIn: [startX + 40, startY],
      staticHexOut: hexEnd,
      staticTagOut: tagEnd,
    };
  });
}

interface PhaseProps {
  path: string;
  duration: number;
  delay: number;
  phase: "in" | "out";
}

// Moves the parent element along `path` during its phase of the shared loop
// and keeps it invisible the rest of the time.
function PhaseMotion({ path, duration, delay, phase }: PhaseProps) {
  const dur = `${duration}s`;
  const begin = `${delay}s`;
  const motion =
    phase === "in"
      ? { keyTimes: `0;${IN_END};1`, keyPoints: "0;1;1" }
      : { keyTimes: `0;${OUT_START};1`, keyPoints: "0;0;1" };
  const opacity =
    phase === "in"
      ? { values: "0;1;1;0;0", keyTimes: `0;0.06;${IN_END - 0.04};${IN_END};1` }
      : { values: "0;0;1;1;0", keyTimes: `0;${OUT_START};${OUT_START + 0.05};0.9;1` };
  return (
    <>
      <animateMotion
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        calcMode="linear"
        path={path}
        {...motion}
      />
      <animate attributeName="opacity" dur={dur} begin={begin} repeatCount="indefinite" {...opacity} />
    </>
  );
}

function ConjugatedMolecule() {
  return (
    <>
      <line className="bsh-bond" x1={HEX_R - 1} y1={0} x2={HEX_R + 8} y2={0} />
      <circle className="bsh-tag" cx={HEX_R + 8 + TAG_R} cy={0} r={TAG_R} />
      <polygon className="bsh-hex bsh-hex--conjugated" points={HEX_POINTS} />
    </>
  );
}

function Molecules({ animate }: { animate: boolean }) {
  const molecules = useMemo(buildMolecules, []);

  if (!animate) {
    return (
      <>
        {molecules.map((m) => (
          <g key={m.id}>
            <g transform={`translate(${m.staticIn[0]},${m.staticIn[1]})`}>
              <ConjugatedMolecule />
            </g>
            <polygon
              className="bsh-hex bsh-hex--deconjugated"
              points={HEX_POINTS}
              transform={`translate(${m.staticHexOut[0]},${m.staticHexOut[1]})`}
            />
            <circle className="bsh-tag" cx={m.staticTagOut[0]} cy={m.staticTagOut[1]} r={TAG_R} />
          </g>
        ))}
      </>
    );
  }

  return (
    <>
      {molecules.map((m) => (
        <g key={m.id}>
          <g opacity={0}>
            <ConjugatedMolecule />
            <PhaseMotion path={m.inPath} duration={m.duration} delay={m.delay} phase="in" />
          </g>
          <polygon className="bsh-hex bsh-hex--deconjugated" points={HEX_POINTS} opacity={0}>
            <PhaseMotion path={m.hexOutPath} duration={m.duration} delay={m.delay} phase="out" />
          </polygon>
          <circle className="bsh-tag" r={TAG_R} opacity={0}>
            <PhaseMotion path={m.tagOutPath} duration={m.duration} delay={m.delay} phase="out" />
          </circle>
        </g>
      ))}
    </>
  );
}

function Bacterium() {
  return (
    <g className="bsh-bacterium">
      <rect className="bsh-membrane-outer" x={BAC_X} y={BAC_Y} width={BAC_W} height={BAC_H} rx={BAC_H / 2} />
      <rect
        className="bsh-membrane-inner"
        x={BAC_X + 8}
        y={BAC_Y + 8}
        width={BAC_W - 16}
        height={BAC_H - 16}
        rx={(BAC_H - 16) / 2}
      />
      <rect className="bsh-enzyme" x={440} y={BAC_MID_Y - 24} width={120} height={48} rx={24} />
    </g>
  );
}

// Percent position of a viewBox point, for placing the HTML labels.
const pctX = (x: number) => `${(x / VB_W) * 100}%`;
const pctY = (y: number) => `${(y / VB_H) * 100}%`;

export function BshStreamAnimation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bsh-stream">
      <h3 className="bsh-stream-heading">Bile salt hydrolase breaks down conjugated bile acids</h3>
      <div className="bsh-stream-diagram" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          className="bsh-stream-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Animated diagram: Phocaeicola vulgatus uses the enzyme BSH to convert the conjugated bile acids GDCA and TUDCA into the deconjugated bile acids DCA and UDCA, splitting off glycine and taurine."
        >
          <defs>
            <marker id="bsh-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" className="bsh-arrow-head" />
            </marker>
          </defs>

          <line className="bsh-arrow" x1={330} y1={ARROW_Y} x2={680} y2={ARROW_Y} markerEnd="url(#bsh-arrowhead)" />

          <Molecules animate={!prefersReducedMotion} />
          <Bacterium />
        </svg>

        <span className="bsh-stream-caption bsh-stream-caption--species" style={{ left: "50%", top: pctY(40) }}>
          Phocaeicola vulgatus
        </span>
        <span className="bsh-stream-enzyme-label" style={{ left: "50%", top: pctY(BAC_MID_Y) }}>
          BSH
        </span>

        <span className="bsh-stream-badge bsh-stream-badge--conjugated" style={{ left: pctX(70), top: "36%" }}>
          GDCA
        </span>
        <span className="bsh-stream-badge bsh-stream-badge--conjugated" style={{ left: pctX(70), top: "54%" }}>
          TUDCA
        </span>
        <span className="bsh-stream-caption" style={{ left: pctX(180), top: pctY(275) }}>
          conjugated bile acids
        </span>

        <div className="bsh-stream-products" style={{ left: pctX(900), top: "45%" }}>
          <span className="bsh-stream-badge bsh-stream-badge--deconjugated">DCA</span>
          <span className="bsh-stream-plus">+</span>
          <span className="bsh-stream-badge bsh-stream-badge--tag">Glycine</span>
          <span className="bsh-stream-badge bsh-stream-badge--deconjugated">UDCA</span>
          <span className="bsh-stream-plus">+</span>
          <span className="bsh-stream-badge bsh-stream-badge--tag">Taurine</span>
        </div>
        <span className="bsh-stream-caption" style={{ left: pctX(820), top: pctY(275) }}>
          deconjugated bile acids
        </span>
      </div>
    </div>
  );
}
