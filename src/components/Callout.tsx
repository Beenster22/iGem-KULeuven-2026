// Generated with Claude Sonnet 5 (Anthropic), 2026-07-06
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20: added `kind` and `raised`.
// Purpose: simple bordered callout box for highlighting MDX content.
import { ReactNode } from "react";

interface CalloutProps {
  title: string;
  /** Colours the left border: info (default), warning or danger. */
  kind?: "info" | "warning" | "danger";
  /** Lifts the callout off the page (tinted, stronger shadow) for a caveat
   * the reader must not skim past. */
  raised?: boolean;
  children: ReactNode;
}

export function Callout({
  title,
  kind = "info",
  raised,
  children,
}: CalloutProps) {
  return (
    <div
      className={`bd-callout bd-callout-${kind}${raised ? " bd-callout-raised" : ""}`}
    >
      <h4>{title}</h4>
      {children}
    </div>
  );
}
