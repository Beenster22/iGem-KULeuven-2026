import { ReactNode, useMemo, useState } from "react";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";

interface TabSectionProps {
  label: string;
  children: ReactNode;
}

// A labeled slot for use inside TabbedSections. Never rendered directly —
// the parent reads its props via extractLabeledChildren instead.
export function TabSection({ children }: TabSectionProps) {
  return <>{children}</>;
}

interface TabbedSectionsProps {
  children: ReactNode;
}

export function TabbedSections({ children }: TabbedSectionsProps) {
  const tabs = useMemo(() => extractLabeledChildren(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tabs[activeIndex];

  return (
    <div className="tabbed-sections">
      <div className="tab-switcher" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`tab-switcher-btn${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {active && <div className="tab-switcher-content">{active.content}</div>}
    </div>
  );
}
