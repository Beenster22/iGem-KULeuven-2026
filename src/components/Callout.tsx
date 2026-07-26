// Generated with Claude Sonnet 5 (Anthropic), 2026-07-06
// Purpose: simple bordered callout box for highlighting MDX content.
import { ReactNode } from "react";

interface CalloutProps {
  title: string;
  children: ReactNode;
}

export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="bd-callout bd-callout-info">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
