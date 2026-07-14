import { ReactNode, useMemo, useState } from "react";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";

interface WheelSelectorProps {
  children: ReactNode;
}

const SIZE = 240;
const CENTER = SIZE / 2;
const OUTER_RADIUS = SIZE / 2 - 4;
const INNER_RADIUS = OUTER_RADIUS * 0.35;

function polarToCartesian(radius: number, angle: number) {
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

function wedgePath(startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(OUTER_RADIUS, startAngle);
  const outerEnd = polarToCartesian(OUTER_RADIUS, endAngle);
  const innerEnd = polarToCartesian(INNER_RADIUS, endAngle);
  const innerStart = polarToCartesian(INNER_RADIUS, startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

// A pie/donut wheel of labeled, clickable wedges. Selecting a wedge
// highlights it and shows its content below the wheel.
export function WheelSelector({ children }: WheelSelectorProps) {
  const items = useMemo(() => extractLabeledChildren(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];
  const anglePerItem = (2 * Math.PI) / items.length;

  return (
    <div className="wheel-selector">
      <svg
        className="wheel-selector-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="tablist"
        aria-label="Wheel sections"
      >
        {items.map((item, index) => {
          const startAngle = index * anglePerItem - Math.PI / 2;
          const endAngle = startAngle + anglePerItem;
          const midAngle = (startAngle + endAngle) / 2;
          const labelPos = polarToCartesian((OUTER_RADIUS + INNER_RADIUS) / 2, midAngle);
          const isActive = index === activeIndex;

          return (
            <g
              key={item.label}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              className={`wheel-selector-wedge${isActive ? " active" : ""}`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
            >
              <path d={wedgePath(startAngle, endAngle)} />
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle" fontSize={20}>
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
      {active && <div className="wheel-selector-content">{active.content}</div>}
    </div>
  );
}
