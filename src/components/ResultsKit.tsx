// Generated with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: the three building blocks the results page is laid out with, from
// the team's sketch of that page:
//
//   <KeyTakeaways>   the row of "key take aways" cards under a result's
//                    title: a number, a short label, and room for one line
//                    of explanation.
//   <FigureSlot>     a visible, obviously-unfinished placeholder for a
//                    figure or table that has not been added yet. It is
//                    meant to be deleted as each figure lands.
//
// Headings stay as ordinary MDX headings rather than props of a component, so
// the page index (SectionProgress) and the success cards at the top of the
// page keep finding them by their slug.
import type { ReactNode } from "react";

export function KeyTakeaways({ children }: { children: ReactNode }) {
  return (
    <div className="key-takeaways" role="list">
      {children}
    </div>
  );
}

interface TakeawayProps {
  /** The headline number, e.g. "6", "5/15", "1,292×". */
  value: string;
  /** The short all-caps line under the number. */
  label: string;
  /** Optional sentence of explanation under the label. */
  children?: ReactNode;
}

export function Takeaway({ value, label, children }: TakeawayProps) {
  return (
    <div className="key-takeaway" role="listitem">
      <span className="key-takeaway-value">{value}</span>
      <span className="key-takeaway-label">{label}</span>
      {children && <div className="key-takeaway-body">{children}</div>}
    </div>
  );
}

interface FigureSlotProps {
  /** What goes here, e.g. "Figure 1" or "Table 2". */
  label: string;
  /** One line describing what the figure should show. */
  children?: ReactNode;
}

export function FigureSlot({ label, children }: FigureSlotProps) {
  return (
    <div className="figure-slot">
      <span className="figure-slot-label">{label}</span>
      {children && <span className="figure-slot-hint">{children}</span>}
    </div>
  );
}
