// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: Human Practices "Stakeholder framework" + "Stakeholder mapping".
// <StakeholderGroups> lays out one teal squircle card per stakeholder
// category (<StakeholderGroup icon="..." title="...">text</StakeholderGroup>),
// each with a small line icon. <StakeholderMatrix> is the influence–interest
// matrix with a slider that morphs every category from the team's initial
// assessment to the final one; dashed arrows trace each category's path, and
// faint "ghost" bubbles mark where each one started. Positions are read off
// the team's two matrix drafts (initial vs. outcome) as % of the plot area,
// where x = interest and y = influence (0 = low, 100 = high).
import { ReactNode, useId, useState } from "react";

/* ---------- Icons ---------- */

type IconName = "healthcare" | "science" | "industry" | "patients" | "legislation";

const ICON_PATHS: Record<IconName, ReactNode> = {
  // Stethoscope
  healthcare: (
    <>
      <path d="M6 3v6a5 5 0 0 0 10 0V3" />
      <path d="M4 3h4M14 3h4" />
      <path d="M11 14v2a5 5 0 0 0 10 0v-2" />
      <circle cx="21" cy="11.5" r="2.5" />
    </>
  ),
  // Flask
  science: (
    <>
      <path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M7 15h10" />
      <circle cx="10" cy="18" r="0.8" />
      <circle cx="14" cy="17.5" r="0.8" />
    </>
  ),
  // Briefcase with a rising line
  industry: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M7 16l3-3 2.5 2L17 11" />
    </>
  ),
  // Two people / community
  patients: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5" />
    </>
  ),
  // Scales of justice
  legislation: (
    <>
      <path d="M12 3v18M7 21h10M5 6h14" />
      <path d="M5 6l-3 7a3 3 0 0 0 6 0L5 6zM19 6l-3 7a3 3 0 0 0 6 0l-3-7z" />
    </>
  ),
};

function StakeholderIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ---------- Stakeholder squircles ---------- */

interface StakeholderGroupProps {
  title: string;
  icon: IconName;
  children: ReactNode;
}

export function StakeholderGroup({ title, icon, children }: StakeholderGroupProps) {
  return (
    <article className="stakeholder-squircle">
      <header className="stakeholder-squircle-header">
        <div className="stakeholder-squircle-icon">
          <StakeholderIcon name={icon} />
        </div>
        <h3 className="stakeholder-squircle-title">{title}</h3>
      </header>
      <div className="stakeholder-squircle-body">{children}</div>
    </article>
  );
}

export function StakeholderGroups({ children }: { children: ReactNode }) {
  return <div className="stakeholder-squircles">{children}</div>;
}

/* ---------- Influence–interest matrix ---------- */

interface Point {
  x: number; // interest, 0-100
  y: number; // influence, 0-100
}

interface MatrixCategory {
  id: string;
  initialLabel: string;
  /** Only set when the category was renamed between the two assessments. */
  finalLabel?: string;
  initial: Point;
  final: Point;
}

const CATEGORIES: MatrixCategory[] = [
  { id: "advocates", initialLabel: "Advocates & Legislators", initial: { x: 37, y: 86 }, final: { x: 37, y: 86 } },
  { id: "patients", initialLabel: "Patients", initial: { x: 92, y: 91 }, final: { x: 89, y: 37 } },
  { id: "science", initialLabel: "Scientific & Technical Experts", initial: { x: 71, y: 78 }, final: { x: 63, y: 91 } },
  { id: "industry", initialLabel: "Biotech & Industry", initial: { x: 90, y: 57 }, final: { x: 41, y: 65 } },
  { id: "healthcare", initialLabel: "Healthcare Professionals", initial: { x: 59, y: 52 }, final: { x: 47, y: 32 } },
  {
    id: "ethics",
    initialLabel: "Safety & Bioethical Regulations",
    finalLabel: "Ethical",
    initial: { x: 25, y: 47 },
    final: { x: 13, y: 72 },
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// The plot is drawn in an SVG viewBox of 1000 x 640 units (the plot box keeps
// the same aspect ratio in CSS, so arrowheads never stretch); bubbles are
// HTML overlaid on top with % positions so their text wraps naturally.
const VB_W = 1000;
const VB_H = 640;
const toVbX = (x: number) => (x / 100) * VB_W;
const toVbY = (y: number) => VB_H - (y / 100) * VB_H;

// Shorten an arrow at both ends so it starts outside the ghost bubble and its
// head stops just short of the moving one instead of disappearing under it.
function trimmedSegment(from: Point, to: Point, trimStart: number, trimEnd: number) {
  const x1 = toVbX(from.x);
  const y1 = toVbY(from.y);
  const x2 = toVbX(to.x);
  const y2 = toVbY(to.y);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len <= trimStart + trimEnd) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  return {
    x1: x1 + ux * trimStart,
    y1: y1 + uy * trimStart,
    x2: x2 - ux * trimEnd,
    y2: y2 - uy * trimEnd,
  };
}

export function StakeholderMatrix() {
  const [progress, setProgress] = useState(0); // 0 = initial, 100 = final
  const t = progress / 100;
  const markerId = `stakeholder-arrow-${useId().replace(/:/g, "")}`;

  return (
    <figure className="stakeholder-matrix">
      <figcaption className="stakeholder-matrix-heading">Influence – Interest Matrix</figcaption>

      <div className="stakeholder-matrix-phase" aria-hidden="true">
        <span className={t < 0.5 ? "is-active" : undefined}>Initial assessment</span>
        <span className={t >= 0.5 ? "is-active" : undefined}>Final assessment</span>
      </div>

      <div className="stakeholder-matrix-frame">
        <span className="stakeholder-matrix-axis-label stakeholder-matrix-axis-label--y">Influence</span>

        <div className="stakeholder-matrix-plot">
          <svg
            className="stakeholder-matrix-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id={markerId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <path d="M0 0L10 5L0 10z" className="stakeholder-matrix-arrowhead" />
              </marker>
            </defs>

            {/* Quadrant guides */}
            <line x1={VB_W / 2} y1={0} x2={VB_W / 2} y2={VB_H} className="stakeholder-matrix-guide" />
            <line x1={0} y1={VB_H / 2} x2={VB_W} y2={VB_H / 2} className="stakeholder-matrix-guide" />

            {/* Development arrows: from where each group started to where it is now */}
            {CATEGORIES.map((category) => {
              const current = {
                x: lerp(category.initial.x, category.final.x, t),
                y: lerp(category.initial.y, category.final.y, t),
              };
              const seg = trimmedSegment(category.initial, current, 30, 70);
              if (!seg) return null;
              return (
                <line
                  key={category.id}
                  {...seg}
                  className="stakeholder-matrix-arrow"
                  markerEnd={`url(#${markerId})`}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Ghost bubbles at the initial positions, fading in once things move */}
          {CATEGORIES.map((category) => {
            const moves =
              category.initial.x !== category.final.x || category.initial.y !== category.final.y;
            if (!moves) return null;
            return (
              <span
                key={`${category.id}-ghost`}
                className="stakeholder-matrix-ghost"
                style={{
                  left: `${category.initial.x}%`,
                  bottom: `${category.initial.y}%`,
                  opacity: Math.min(1, t * 3) * 0.55,
                }}
                aria-hidden="true"
              >
                {category.initialLabel}
              </span>
            );
          })}

          {CATEGORIES.map((category) => {
            const label = category.finalLabel && t >= 0.5 ? category.finalLabel : category.initialLabel;
            return (
              <span
                key={category.id}
                className="stakeholder-matrix-bubble"
                style={{
                  left: `${lerp(category.initial.x, category.final.x, t)}%`,
                  bottom: `${lerp(category.initial.y, category.final.y, t)}%`,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        <span className="stakeholder-matrix-axis-label stakeholder-matrix-axis-label--x">Interest</span>
      </div>

      <div className="stakeholder-matrix-slider">
        <span>Initial</span>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          aria-label="Compare initial and final stakeholder assessment"
          aria-valuetext={progress < 50 ? "Initial assessment" : "Final assessment"}
          style={{ "--stakeholder-progress": `${progress}%` } as React.CSSProperties}
        />
        <span>Final</span>
      </div>
    </figure>
  );
}
