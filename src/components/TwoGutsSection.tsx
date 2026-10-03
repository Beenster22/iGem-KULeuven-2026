// Generated with Claude Opus 5.5 (Anthropic), 2026-09-24
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-01: removed the
// scroll-pinned transition — both windows now show their final state
// straight away so the difference is obvious at a glance — and made the
// bacteria larger and livelier.
// Purpose: home-page "two guts" section, the step between "What is PMOS?"
// and the BSH diagram. Two circular windows into the gut, side by side: in
// the "With PMOS" window some bacterial groups are missing and a few
// dominant groups have taken their place, so diversity is visibly lower and
// the mix different. The composition bars underneath are computed from the
// cells actually drawn, so they always match the picture. This is an
// ILLUSTRATION, not data: the groups are generic shapes/colours, not real
// taxa. The cells drift and turn on a CSS loop (off under
// prefers-reduced-motion, see App.css).
import type { CSSProperties, ReactNode } from "react";

type Shape =
  | "rod"
  | "short-rod"
  | "coccus"
  | "diplo"
  | "chain"
  | "curved"
  | "spiral";

interface Group {
  id: string;
  shape: Shape;
  color: string;
}

const GROUPS: Group[] = [
  { id: "a", shape: "rod", color: "#8f7fc4" },
  { id: "b", shape: "coccus", color: "#4fae9a" },
  { id: "c", shape: "chain", color: "#e0a84a" },
  { id: "d", shape: "curved", color: "#d9779b" },
  { id: "e", shape: "short-rod", color: "#6f9bd6" },
  { id: "f", shape: "diplo", color: "#8cc27a" },
  { id: "g", shape: "spiral", color: "#e2825a" },
];

// In the PMOS window these groups are crowded out, and each lost cell is
// taken over by one of the dominant groups.
const LOST = new Set(["c", "f", "g"]);
const DOMINANT = ["d", "e"];

// Deliberately few slots, so each cell can be drawn large (CELL_SCALE) and
// still has room to drift.
const SLOTS = 28;
const CELL_SCALE = 1.5;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const VB = 300;
const CENTER = VB / 2;
const LENS_R = 138;

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface Slot {
  x: number;
  y: number;
  rotation: number;
  groupIndex: number;
  // The group shown in the PMOS window (differs from groupIndex only for
  // cells whose own group has been crowded out).
  pmosGroupIndex: number;
  // Per-cell drift so the cells don't all move in step (see two-guts-drift
  // in App.css).
  dx: number;
  dy: number;
  spin: number;
  duration: number;
  delay: number;
}

const SLOT_LAYOUT: Slot[] = Array.from({ length: SLOTS }, (_, i) => {
  const angle = i * GOLDEN_ANGLE + (seededValue(i + 3) - 0.5) * 0.4;
  const radius = Math.sqrt((i + 0.5) / SLOTS) * (LENS_R - 22);
  const groupIndex = i % GROUPS.length;
  const replacementId =
    DOMINANT[Math.floor(seededValue(i + 9) * DOMINANT.length)];
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
    rotation: Math.round(seededValue(i + 17) * 360),
    groupIndex,
    pmosGroupIndex: LOST.has(GROUPS[groupIndex].id)
      ? GROUPS.findIndex((g) => g.id === replacementId)
      : groupIndex,
    dx: Math.round((seededValue(i + 53) - 0.5) * 36),
    dy: Math.round((seededValue(i + 61) - 0.5) * 36),
    spin: Math.round((seededValue(i + 71) - 0.5) * 90),
    duration: 4 + seededValue(i + 83) * 4,
    delay: -seededValue(i + 41) * 8,
  };
});

function CellShape({ shape, color }: { shape: Shape; color: string }) {
  const stroke = "rgba(0, 0, 0, 0.28)";
  switch (shape) {
    case "rod":
      return (
        <rect
          x={-17}
          y={-7}
          width={34}
          height={14}
          rx={7}
          fill={color}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case "short-rod":
      return (
        <rect
          x={-10}
          y={-7}
          width={20}
          height={14}
          rx={7}
          fill={color}
          stroke={stroke}
          strokeWidth={1.5}
        />
      );
    case "coccus":
      return <circle r={8} fill={color} stroke={stroke} strokeWidth={1.5} />;
    case "diplo":
      return (
        <>
          <circle
            cx={-6}
            r={6}
            fill={color}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <circle cx={6} r={6} fill={color} stroke={stroke} strokeWidth={1.5} />
        </>
      );
    case "chain":
      return (
        <>
          {[-11, 0, 11].map((cx) => (
            <circle
              key={cx}
              cx={cx}
              r={5}
              fill={color}
              stroke={stroke}
              strokeWidth={1.5}
            />
          ))}
        </>
      );
    case "curved":
      return (
        <path
          d="M-14 5 Q0 -13 14 5"
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
        />
      );
    case "spiral":
      return (
        <path
          d="M-16 0 q4 -8 8 0 t8 0 t8 0 t8 0"
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
  }
}

function GutWindow({ label, pmos }: { label: string; pmos: boolean }) {
  const clipId = `two-guts-clip-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <figure className="two-guts-window">
      <figcaption className="two-guts-window-label">{label}</figcaption>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="two-guts-lens"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={CENTER} cy={CENTER} r={LENS_R} />
          </clipPath>
        </defs>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={LENS_R}
          className="two-guts-lens-bg"
        />
        <g clipPath={`url(#${clipId})`}>
          {SLOT_LAYOUT.map((slot, i) => {
            const group = GROUPS[pmos ? slot.pmosGroupIndex : slot.groupIndex];
            return (
              <g
                key={i}
                transform={`translate(${slot.x} ${slot.y}) rotate(${slot.rotation})`}
              >
                <g
                  className="two-guts-cell"
                  style={
                    {
                      "--dx": `${slot.dx}px`,
                      "--dy": `${slot.dy}px`,
                      "--spin": `${slot.spin}deg`,
                      animationDuration: `${slot.duration}s`,
                      animationDelay: `${slot.delay}s`,
                    } as CSSProperties
                  }
                >
                  <g transform={`scale(${CELL_SCALE})`}>
                    <CellShape shape={group.shape} color={group.color} />
                  </g>
                </g>
              </g>
            );
          })}
        </g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={LENS_R}
          className="two-guts-lens-rim"
        />
      </svg>
      <CompositionBar pmos={pmos} />
    </figure>
  );
}

// Share of each group among the cells drawn, so the bar always mirrors the
// window above it.
function CompositionBar({ pmos }: { pmos: boolean }) {
  const weights = GROUPS.map(() => 0);
  for (const slot of SLOT_LAYOUT) {
    weights[pmos ? slot.pmosGroupIndex : slot.groupIndex] += 1;
  }
  return (
    <div className="two-guts-bar" aria-hidden="true">
      {GROUPS.map((group, i) => (
        <span
          key={group.id}
          className="two-guts-bar-segment"
          style={{ flexGrow: weights[i], backgroundColor: group.color }}
        />
      ))}
    </div>
  );
}

interface TwoGutsSectionProps {
  heading: string;
  // Intro/explanation text with its [^n] citations, written in home.mdx so
  // the science and citations stay in the team's content files.
  children?: ReactNode;
}

export function TwoGutsSection({ heading, children }: TwoGutsSectionProps) {
  return (
    <div className="two-guts">
      <h3 className="two-guts-heading">{heading}</h3>
      <div className="two-guts-intro">{children}</div>

      <div
        className="two-guts-row"
        role="img"
        aria-label="Illustration: two windows into the gut microbiome. Without PMOS, many different kinds of bacteria are evenly mixed. With PMOS, several kinds disappear and a few take over, so the community is less diverse and differently composed."
      >
        <GutWindow label="Without PMOS" pmos={false} />
        <GutWindow label="With PMOS" pmos />
      </div>

      <p className="two-guts-note">
        Illustration only: each shape and colour stands for a different group of
        gut bacteria; not measured data.
      </p>
    </div>
  );
}
