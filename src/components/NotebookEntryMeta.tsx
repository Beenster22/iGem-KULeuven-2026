// Generated with Claude Opus 5 (Anthropic), 2026-10-08
// Purpose: the header block every notebook entry opens with (dates, people,
// status, and the entries it follows from / leads to), drawn as Elle — the
// mascot from the page index — holding up a speech bubble, instead of the
// plain bullet list the write-ups were converted from.
//
// The bubble is a <dl>, so the labels stay tied to their values for screen
// readers and the mascot itself is decorative (empty alt). Fields with no
// value, written "/" in the source notebooks, are rendered as an em dash
// rather than dropped, so "no predecessor" still reads as a deliberate answer.
import { ReactNode } from "react";

// Same artwork as the page index (SectionProgress.tsx).
const MASCOT_BASE = "https://static.igem.wiki/teams/6299/wiki/mascot";

interface NotebookEntryMetaProps {
  dates: string;
  people: string;
  status: string;
  buildsOn?: string;
  followedBy?: string;
  // Anything extra the entry carries; shown as further rows in the bubble.
  children?: ReactNode;
}

// Elle looks pleased with an entry that finished, and merely cheerful about
// one that was repeated, abandoned or is still open.
function moodFor(status: string) {
  const settled = /^done\b/i.test(status.trim()) && !/fail/i.test(status);
  return settled ? "excited" : "smile";
}

function Row({ label, value }: { label: string; value?: string }) {
  if (value === undefined) return null;
  const empty = value.trim() === "" || value.trim() === "/";
  return (
    <div className="notebook-meta-row">
      <dt>{label}</dt>
      <dd>{empty ? "—" : value}</dd>
    </div>
  );
}

export function NotebookEntryMeta({
  dates,
  people,
  status,
  buildsOn,
  followedBy,
  children,
}: NotebookEntryMetaProps) {
  return (
    <div className="notebook-meta">
      <img
        className="notebook-meta-mascot"
        src={`${MASCOT_BASE}/uterus-${moodFor(status)}.avif`}
        alt=""
        loading="lazy"
      />
      <dl className="notebook-meta-bubble">
        <Row label="Dates" value={dates} />
        <Row label="People" value={people} />
        <Row label="Status" value={status} />
        <Row label="Builds on" value={buildsOn} />
        <Row label="Followed by" value={followedBy} />
        {children}
      </dl>
    </div>
  );
}
