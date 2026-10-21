// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: the "Why the gap exists" reasons in the Legislators & Advocates
// section of the Human Practices page, as numbered cards one under the
// other (team request, after a "Point 1 / 2 / 3" infographic): a coloured
// tab on the left with the reason's name and number, then the icon and the
// write-up. One colour per card from the site palette — teal, plum, pink.
// On narrow screens the tab moves to the top of the card.
import { ReactNode } from "react";

type GapReasonIcon = "structure" | "pipeline" | "stigma";

interface GapReasonProps {
  title: string;
  icon: GapReasonIcon;
  children: ReactNode;
}

const ICONS: Record<GapReasonIcon, ReactNode> = {
  // A building with columns: how funders are organised.
  structure: (
    <>
      <path d="M4 10l8-5 8 5" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M3 20h18" />
    </>
  ),
  // Two arrows chasing each other: the self-reinforcing cycle.
  pipeline: (
    <>
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M17.7 2.6v4h-4M6.3 21.4v-4h4" />
    </>
  ),
  // A crossed-out eye: conditions that go unseen.
  stigma: (
    <>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
      <circle cx={12} cy={12} r={2.6} />
      <path d="M4 4l16 16" />
    </>
  ),
};

export function GapReason({ title, icon, children }: GapReasonProps) {
  return (
    <li className="gap-reason">
      <div className="gap-reason-head">
        <span className="gap-reason-title">{title}</span>
        <span className="gap-reason-number" aria-hidden="true" />
      </div>
      <div className="gap-reason-body">
        <svg className="gap-reason-icon" viewBox="0 0 24 24" aria-hidden="true">
          {ICONS[icon]}
        </svg>
        {children}
      </div>
    </li>
  );
}

export function GapReasons({ children }: { children: ReactNode }) {
  return <ol className="gap-reasons">{children}</ol>;
}
