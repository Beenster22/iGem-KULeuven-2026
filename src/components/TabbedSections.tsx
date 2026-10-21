// Generated with Claude Sonnet 5 (Anthropic), 2026-07-14
// Purpose: tab switcher for browsing labeled content sections.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-21: optional
// `listInIndex` keeps every tab on the page (the closed ones hidden), so
// the headings inside them show in the page's left-hand index too; a click
// there opens the tab that holds the heading (the same "reveal-section"
// handshake PhasePager uses, see SectionProgress.tsx).
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { extractLabeledChildren } from "../utils/extractLabeledChildren";
import { useHashPanel } from "./useHashPanel";

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
  /** Keep every tab on the page, so their headings are listed in the
   * left-hand index and a click there opens the right tab. */
  listInIndex?: boolean;
}

export function TabbedSections({ children, listInIndex }: TabbedSectionsProps) {
  const tabs = useMemo(() => extractLabeledChildren(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  // A link from elsewhere may name a heading inside a tab that is not open.
  useHashPanel(tabs, setActiveIndex);
  const active = tabs[activeIndex];
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!listInIndex) return;
    const onReveal = (event: Event) => {
      const target = document.getElementById((event as CustomEvent<string>).detail);
      const index = panelRefs.current.findIndex((panel) => panel?.contains(target));
      if (index < 0) return;
      // Shown straight away, not on the next render: the index scrolls to
      // the heading as soon as this returns, and a hidden one has no place
      // on the page to scroll to.
      panelRefs.current.forEach((panel, i) => {
        if (panel) panel.hidden = i !== index;
      });
      setActiveIndex(index);
    };
    window.addEventListener("reveal-section", onReveal);
    return () => window.removeEventListener("reveal-section", onReveal);
  }, [listInIndex]);

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
      {listInIndex
        ? tabs.map((tab, index) => (
            <div
              key={tab.label}
              ref={(panel) => {
                panelRefs.current[index] = panel;
              }}
              className="tab-switcher-content"
              hidden={index !== activeIndex}
            >
              {tab.content}
            </div>
          ))
        : active && <div className="tab-switcher-content">{active.content}</div>}
    </div>
  );
}
