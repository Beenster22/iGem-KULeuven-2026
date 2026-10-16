// Generated with Claude Opus 5.5 (Anthropic), 2026-09-28
// Purpose: three-stop "journey" arc (start → summit → end) for the
// Entrepreneurship page's Problem and Mission section. Each stop is a
// clickable milestone whose content is shown below the arc; the part of the
// road already "travelled" up to the selected milestone is highlighted.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

type MilestoneIcon = "flag" | "gate" | "pill";

interface MilestoneProps {
  label: string;
  subtitle?: string;
  icon: MilestoneIcon;
  children?: ReactNode;
}

// A labeled slot for use inside MilestoneArc. Never rendered directly — the
// arc reads its props instead (same pattern as SectionItem).
export function Milestone({ children }: MilestoneProps) {
  return <>{children}</>;
}

// Road geometry: a symmetric quadratic curve, so t = 0.5 is both the apex
// and exactly half of the path length. Endpoints sit at 1/6 and 5/6 of the
// width so they line up with the centers of the 3-column label grid below.
const WIDTH = 1000;
const HEIGHT = 290;
const START = { x: WIDTH / 6, y: 260 };
const END = { x: (WIDTH * 5) / 6, y: 260 };
const CONTROL = { x: WIDTH / 2, y: 80 };
const ROAD = `M ${START.x} ${START.y} Q ${CONTROL.x} ${CONTROL.y} ${END.x} ${END.y}`;

function pointAt(t: number) {
  const u = 1 - t;
  return {
    x: u * u * START.x + 2 * u * t * CONTROL.x + t * t * END.x,
    y: u * u * START.y + 2 * u * t * CONTROL.y + t * t * END.y,
  };
}

function Icon({ kind }: { kind: MilestoneIcon }) {
  // Drawn relative to (0, 0) = the milestone's point on the road.
  switch (kind) {
    case "flag":
      return (
        <>
          <path className="milestone-arc-icon-fill-pink" d="M 0 -112 L 62 -92 L 0 -72 Z" />
          <line className="milestone-arc-icon-stroke" x1={0} y1={-4} x2={0} y2={-116} />
        </>
      );
    case "gate":
      return (
        <>
          <line className="milestone-arc-icon-stroke" x1={-38} y1={-8} x2={-38} y2={-116} />
          <line className="milestone-arc-icon-stroke" x1={38} y1={-8} x2={38} y2={-116} />
          <line className="milestone-arc-icon-stroke" x1={-34} y1={-92} x2={34} y2={-92} />
          <line className="milestone-arc-icon-stroke" x1={-34} y1={-70} x2={34} y2={-70} />
          <rect className="milestone-arc-icon-bar" x={-54} y={-126} width={108} height={16} rx={6} />
        </>
      );
    case "pill":
      return (
        <g transform="translate(0 -62) rotate(-35)">
          <rect className="milestone-arc-icon-fill-teal" x={-54} y={-22} width={108} height={44} rx={22} />
          <path className="milestone-arc-icon-fill-teal-strong" d="M 0 -22 H -32 A 22 22 0 0 0 -32 22 H 0 Z" />
          <rect className="milestone-arc-icon-stroke" x={-54} y={-22} width={108} height={44} rx={22} fill="none" />
          <line className="milestone-arc-icon-stroke" x1={0} y1={-22} x2={0} y2={22} />
        </g>
      );
  }
}

interface MilestoneArcProps {
  children: ReactNode;
}

// Expects exactly three <Milestone> children (start, summit, end).
export function MilestoneArc({ children }: MilestoneArcProps) {
  const milestones = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<MilestoneProps> => isValidElement(child))
        .map((child) => child.props),
    [children],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = milestones[activeIndex];
  const stops = milestones.map((_, index) => index / Math.max(milestones.length - 1, 1));
  const travelled = stops[activeIndex] ?? 0;

  return (
    <div className="milestone-arc">
      <svg className="milestone-arc-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
        <path className="milestone-arc-road" d={ROAD} />
        <path
          className="milestone-arc-road-travelled"
          d={ROAD}
          pathLength={100}
          strokeDasharray="100 100"
          strokeDashoffset={100 - travelled * 100}
        />
        <path className="milestone-arc-road-dashes" d={ROAD} />
        {milestones.map((milestone, index) => {
          const { x, y } = pointAt(stops[index]);
          const isActive = index === activeIndex;
          return (
            <g
              key={milestone.label}
              className={`milestone-arc-stop${isActive ? " active" : ""}`}
              transform={`translate(${x} ${y})`}
              onClick={() => setActiveIndex(index)}
            >
              <rect className="milestone-arc-hit" x={-80} y={-140} width={160} height={160} />
              <g className="milestone-arc-icon">
                <Icon kind={milestone.icon} />
              </g>
              <circle className="milestone-arc-dot" r={isActive ? 14 : 9} />
            </g>
          );
        })}
      </svg>

      <div className="milestone-arc-labels" role="tablist" aria-label="Milestones">
        {milestones.map((milestone, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={milestone.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`milestone-arc-label${isActive ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="milestone-arc-label-title">{milestone.label}</span>
              {milestone.subtitle && <span className="milestone-arc-label-subtitle">{milestone.subtitle}</span>}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="milestone-arc-content" role="tabpanel" key={active.label}>
          <p className="milestone-arc-content-title">{active.label}</p>
          {active.children}
        </div>
      )}
    </div>
  );
}
