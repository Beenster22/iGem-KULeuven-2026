// Generated with Claude Opus 5 (Anthropic), 2026-10-17
// Purpose: the building blocks the results page is laid out with, from the
// team's sketch of that page:
//
//   <ResultSection>  one result's worth of content, boxed off from the next
//                    the same way entrepreneurship.mdx's "## Phase N"
//                    sections are — a tinted, rounded card. That page gets
//                    its boxes for free from rehypeSections, which only
//                    groups "## " headings that sit directly inside
//                    <PageLayout>; the results page's "### " result headings
//                    live inside the Toolkit/Therapeutics tabs instead, so
//                    they are boxed by hand with this wrapper, reusing the
//                    same .content-section CSS class so the two pages match.
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

export function ResultSection({ children }: { children: ReactNode }) {
  return <section className="content-section">{children}</section>;
}

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

// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: a short sequential process (e.g. the CRISPR construct's
// integration strategy) as a row of numbered cards joined by arrows, instead
// of a plain bullet list — <StepFlow><Step title="...">...</Step>...
// </StepFlow>. Numbers come from CSS (counter on .step-flow-item), so steps
// can be reordered without renumbering by hand.
export function StepFlow({ children }: { children: ReactNode }) {
  return (
    <div className="step-flow" role="list">
      {children}
    </div>
  );
}

interface StepProps {
  /** The step's short name, e.g. "Conjugative transfer". */
  title: string;
  children?: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="step-flow-item" role="listitem">
      <div className="step-flow-card">
        <span className="step-flow-number" aria-hidden="true" />
        <span className="step-flow-title">{title}</span>
        {children && <div className="step-flow-body">{children}</div>}
      </div>
    </div>
  );
}
