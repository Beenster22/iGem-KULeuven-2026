// Generated with Claude Opus 5.5 (Anthropic), 2026-09-28
// Purpose: "hub and fan" selector — a central circle with bands fanning out to
// the right, one per <FanBranch>. Clicking a band shows that branch's content
// below. Used for the Entrepreneurship page's Risks and mitigation section.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

type FanIcon = "flask" | "scales" | "coins" | "chart" | "gear";

interface FanBranchProps {
  label: string;
  subtitle?: string;
  icon?: FanIcon;
  children?: ReactNode;
}

// A labeled slot for use inside FanSelector. Never rendered directly — the
// selector reads its props instead (same pattern as SectionItem).
export function FanBranch({ children }: FanBranchProps) {
  return <>{children}</>;
}

const WIDTH = 1000;
const TOP = 20;
const BAND_HEIGHT = 112;
const HUB = { x: 190, y: 0, r: 160 };
const BAND_LEFT = 470;
const BAND_RIGHT = 990;
// Bands alternate between the brand's soft pink and light background colors.
const BAND_FILLS = ["#F1C3D4", "#EAF4F5"];

function hubPoint(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: HUB.x + HUB.r * Math.cos(a), y: HUB.y + HUB.r * Math.sin(a) };
}

function Icon({ kind }: { kind: FanIcon }) {
  // Drawn in a 60×60 box centered on (0, 0).
  switch (kind) {
    case "flask":
      return (
        <>
          <path d="M -10 -26 H 10 M -7 -26 V -6 L -22 20 Q -24 26 -18 26 H 18 Q 24 26 22 20 L 7 -6 V -26" />
          <path d="M -15 8 H 15" />
        </>
      );
    case "scales":
      return (
        <>
          <path d="M 0 -26 V 24 M -16 24 H 16 M -24 -16 H 24" />
          <path d="M -24 -16 L -32 4 H -16 Z M 24 -16 L 16 4 H 32 Z" />
        </>
      );
    case "coins":
      return (
        <>
          <ellipse cx={0} cy={-16} rx={22} ry={8} />
          <path d="M -22 -16 V 16 Q 0 32 22 16 V -16 M -22 0 Q 0 16 22 0" />
        </>
      );
    case "chart":
      return <path d="M -26 -26 V 24 H 28 M -16 12 L -4 -2 L 6 6 L 24 -18 M 12 -18 H 24 V -6" />;
    case "gear":
      return (
        <>
          <circle cx={0} cy={0} r={9} />
          <path d="M 0 -26 V -18 M 0 18 V 26 M -26 0 H -18 M 18 0 H 26 M -18 -18 L -13 -13 M 13 13 L 18 18 M 18 -18 L 13 -13 M -13 13 L -18 18" />
          <circle cx={0} cy={0} r={18} />
        </>
      );
  }
}

interface FanSelectorProps {
  hub: string;
  children: ReactNode;
}

export function FanSelector({ hub, children }: FanSelectorProps) {
  const branches = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<FanBranchProps> => isValidElement(child))
        .map((child) => child.props),
    [children],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = branches[activeIndex];

  const count = branches.length;
  const height = TOP * 2 + count * BAND_HEIGHT;
  const hubY = height / 2;
  // Band edges meet the hub at evenly spread angles around its right side.
  const spread = Math.min(20, 100 / Math.max(count, 1));
  const edgeAngle = (k: number) => (k - count / 2) * spread;

  const bandPath = (index: number) => {
    const yTop = TOP + index * BAND_HEIGHT;
    const yBottom = yTop + BAND_HEIGHT;
    const a = hubPoint(edgeAngle(index));
    const b = hubPoint(edgeAngle(index + 1));
    return [
      `M ${a.x} ${a.y + hubY}`,
      `L ${BAND_LEFT} ${yTop} H ${BAND_RIGHT} V ${yBottom} H ${BAND_LEFT}`,
      `L ${b.x} ${b.y + hubY}`,
      `A ${HUB.r} ${HUB.r} 0 0 0 ${a.x} ${a.y + hubY}`,
      "Z",
    ].join(" ");
  };

  // Draw the active band last so its highlighted outline sits on top.
  const drawOrder = branches.map((_, index) => index).filter((index) => index !== activeIndex);
  drawOrder.push(activeIndex);

  return (
    <div className="fan-selector">
      <svg className="fan-selector-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="tablist" aria-label={hub}>
        {drawOrder.map((index) => {
          const branch = branches[index];
          const yMid = TOP + index * BAND_HEIGHT + BAND_HEIGHT / 2;
          const isActive = index === activeIndex;
          return (
            <g
              key={branch.label}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              aria-label={`${branch.label} ${branch.subtitle ?? ""}`.trim()}
              className={`fan-selector-band${isActive ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
            >
              <path d={bandPath(index)} fill={BAND_FILLS[index % BAND_FILLS.length]} />
              {branch.icon && (
                <g className="fan-selector-icon" transform={`translate(${BAND_LEFT + 70} ${yMid})`}>
                  <Icon kind={branch.icon} />
                </g>
              )}
              <text x={BAND_LEFT + 135} y={branch.subtitle ? yMid - 6 : yMid} dominantBaseline="middle">
                <tspan className="fan-selector-band-label">{branch.label}</tspan>
                {branch.subtitle && (
                  <tspan className="fan-selector-band-subtitle" x={BAND_LEFT + 135} dy={32}>
                    {branch.subtitle}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}
        <circle className="fan-selector-hub" cx={HUB.x} cy={hubY} r={HUB.r} />
        <foreignObject aria-hidden="true" x={HUB.x - HUB.r + 20} y={hubY - HUB.r} width={(HUB.r - 20) * 2} height={HUB.r * 2}>
          <div className="fan-selector-hub-label">{hub}</div>
        </foreignObject>
      </svg>

      {/* Narrow screens: the diagram's text gets too small, so it is swapped
          for this stacked list of buttons (see .fan-selector-tabs in App.css). */}
      <div className="fan-selector-tabs" role="tablist" aria-label={hub}>
        {branches.map((branch, index) => (
          <button
            key={branch.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`fan-selector-tab${index === activeIndex ? " active" : ""}`}
            style={{ backgroundColor: BAND_FILLS[index % BAND_FILLS.length] }}
            onClick={() => setActiveIndex(index)}
          >
            {branch.label} {branch.subtitle}
          </button>
        ))}
      </div>

      {active && (
        <div className="fan-selector-content" role="tabpanel" key={active.label}>
          <p className="fan-selector-content-title">
            {active.label} {active.subtitle}
          </p>
          {active.children}
        </div>
      )}
    </div>
  );
}
