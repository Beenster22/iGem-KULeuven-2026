// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the collapsible "Calculations" section at the end of each protocol.
// The team's upload instructions ask that it be collapsible but never
// dropped, since it is what makes the numbers in the tables reproducible.
//
// It is deliberately NOT an ExpandableText: that component renders its title
// as an <h3> so the page-wide index (SectionProgress) can pick protocols up,
// which would put 22 identical "Calculations" rows in the index of this page.
// A <details> element collapses natively and contributes no heading.
import { ReactNode } from "react";

export function ProtocolCalculations({ children }: { children: ReactNode }) {
  return (
    <details className="protocol-calculations">
      <summary className="protocol-calculations-summary">Calculations</summary>
      <div className="protocol-calculations-body">{children}</div>
    </details>
  );
}
