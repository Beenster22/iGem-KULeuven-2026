// Generated with Claude Opus 5.5 (Anthropic), 2026-10-03
// Purpose: nested TAM / SAM / SOM rings for the Entrepreneurship page's
// "Market and target group" section. Clicking a ring lights it up, fades the
// others into the background, and shows that ring's estimate below.
import { Children, KeyboardEvent, ReactElement, ReactNode, isValidElement, useEffect, useMemo, useState } from "react";

interface MarketRingProps {
  label: string;
  name: string;
  value: string;
  children?: ReactNode;
}

// A labeled slot for use inside MarketRings. Never rendered directly — the
// rings read its props instead (same pattern as Milestone).
export function MarketRing({ children }: MarketRingProps) {
  return <>{children}</>;
}

// Ring geometry, outermost first. The circles share a vertical axis and sit
// low inside each other so every ring keeps a free band at the top for its
// label. The inner two name sizes are picked to fit the ring's chord there.
const SIZE = 760;
const RINGS = [
  { cx: 380, cy: 380, r: 360, titleY: 122, nameY: 156, titleSize: 46, nameSize: 21 },
  { cx: 380, cy: 460, r: 245, titleY: 322, nameY: 354, titleSize: 44, nameSize: 19 },
  { cx: 380, cy: 550, r: 130, titleY: 552, nameY: 580, titleSize: 40, nameSize: 14 },
];

interface MarketRingsProps {
  children: ReactNode;
}

// Expects exactly three <MarketRing> children, ordered TAM, SAM, SOM.
export function MarketRings({ children }: MarketRingsProps) {
  const rings = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<MarketRingProps> => isValidElement(child))
        .map((child) => child.props)
        .slice(0, RINGS.length),
    [children],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? undefined : rings[activeIndex];

  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
  // Purpose: each ring's <g> carries its label as an id (#tam, #sam, #som),
  // so an in-page link like [SOM](#som) scrolls to it natively; this also
  // selects that ring so its estimate is already open on arrival.
  useEffect(() => {
    const selectFromHash = () => {
      const index = rings.findIndex((ring) => `#${ring.label.toLowerCase()}` === window.location.hash);
      if (index !== -1) setActiveIndex(index);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [rings]);

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className={`market-rings${active ? " has-active" : ""}`}>
      <svg className="market-rings-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Market size rings">
        {rings.map((ring, index) => {
          const shape = RINGS[index];
          const isActive = index === activeIndex;
          return (
            <g
              key={ring.label}
              id={ring.label.toLowerCase()}
              className={`market-ring market-ring-${index}${isActive ? " active" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${ring.name} (${ring.label})`}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <circle className="market-ring-circle" cx={shape.cx} cy={shape.cy} r={shape.r} />
              <text className="market-ring-title" x={shape.cx} y={shape.titleY} fontSize={shape.titleSize}>
                {ring.label}
              </text>
              <text className="market-ring-name" x={shape.cx} y={shape.nameY} fontSize={shape.nameSize}>
                {ring.name}
              </text>
            </g>
          );
        })}
      </svg>

      {active ? (
        <div
          className={`market-rings-content market-rings-content-${activeIndex}`}
          key={active.label}
          aria-live="polite"
        >
          <p className="market-rings-content-name">
            {active.name} ({active.label})
          </p>
          <p className="market-rings-content-value">{active.value}</p>
          {active.children}
        </div>
      ) : (
        <p className="market-rings-hint">Click a ring to read more</p>
      )}
    </div>
  );
}
