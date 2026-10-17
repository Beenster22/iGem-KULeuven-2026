// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Edited with Claude Opus 5 (Anthropic), 2026-10-17: added the "important"
// kind, which the notebooks mark findings with.
// Purpose: the shaded "Note:" and "Critical:" boxes that the protocol
// documents attach to individual steps. The wiki upload instructions ask
// that these keep a distinct style, so that a critical step stays visible
// when the page is skimmed rather than reading as ordinary body text.
import { ReactNode } from "react";

interface ProtocolNoteProps {
  /** "critical" is the stronger of the two, for steps that ruin a run.
   * "important" is the notebook's version: a finding worth pulling out of
   * the running text, asked for on the notebook documents themselves. */
  kind?: "note" | "critical" | "important";
  /** Bench notes are dated entries: "Note (October 2026): ...". */
  date?: string;
  children: ReactNode;
}

export function ProtocolNote({
  kind = "note",
  date,
  children,
}: ProtocolNoteProps) {
  const label =
    kind === "critical" ? "Critical" : kind === "important" ? "Important" : "Note";
  // The label is a sibling of the children rather than their wrapper: the
  // children come from MDX and are already a <p>, so wrapping them in another
  // one nests <p> inside <p>. That is invalid HTML — the browser silently
  // closes the outer paragraph, which drops the note's styling off the text.
  // CSS makes the first child paragraph inline so it still reads as one
  // sentence beginning with the bold label.
  return (
    <div className={`protocol-note protocol-note--${kind}`}>
      <strong className="protocol-note-label">
        {label}
        {date ? ` (${date})` : ""}:
      </strong>{" "}
      {children}
    </div>
  );
}
