import { ReactNode, useMemo, useState } from "react";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";

interface SegmentedSelectorProps {
  children: ReactNode;
}

// A rectangular bar split evenly into labeled, clickable segments. Selecting
// a segment highlights it and shows its content below the bar.
export function SegmentedSelector({ children }: SegmentedSelectorProps) {
  const items = useMemo(() => extractLabeledChildren(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className="segmented-selector">
      <div className="segmented-selector-bar" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`segmented-selector-segment${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {active && <div className="segmented-selector-content">{active.content}</div>}
    </div>
  );
}
