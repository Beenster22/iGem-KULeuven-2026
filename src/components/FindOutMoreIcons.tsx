// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-17
// Purpose: the flat illustrations on the home page's "Find out more about
// EMPOWER" cards (FindOutMore in Tgr5Story.tsx), drawn in the same flat,
// diagram-like style as the rest of the site and in the EMPOWER palette. Their
// colours come from CSS variables set per card (--ic-1 .. --ic-3, --ic-line;
// see .find-more-card in App.css), so one drawing works on both a dark and a
// light card.
import type { SVGProps } from "react";

const common = {
  viewBox: "0 0 120 120",
  "aria-hidden": true,
  focusable: false,
} as const;

export function LightbulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <g stroke="var(--ic-3)" strokeWidth="4" strokeLinecap="round">
        <path d="M60 6v8M22 22l6 6M98 22l-6 6M10 52h8M110 52h-8" />
      </g>
      <circle cx="60" cy="50" r="28" fill="var(--ic-1)" />
      <rect x="48" y="72" width="24" height="12" fill="var(--ic-1)" />
      <rect x="45" y="86" width="30" height="8" rx="4" fill="var(--ic-2)" />
      <rect x="51" y="96" width="18" height="7" rx="3.5" fill="var(--ic-2)" />
      <path
        d="M49 56l7-14 8 14 7-14"
        fill="none"
        stroke="var(--ic-line)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A magnifying glass over P. vulgatus (the capsule with its BSH pill).
export function MagnifierIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <line
        x1="76"
        y1="76"
        x2="106"
        y2="106"
        stroke="var(--ic-2)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle cx="52" cy="52" r="34" fill="var(--ic-3)" fillOpacity="0.35" />
      <circle cx="52" cy="52" r="34" fill="none" stroke="var(--ic-1)" strokeWidth="8" />
      <rect x="30" y="42" width="44" height="20" rx="10" fill="var(--ic-2)" />
      <rect x="39" y="47" width="26" height="10" rx="5" fill="var(--ic-line)" />
    </svg>
  );
}

export function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <g transform="rotate(-30 60 60)">
        <rect x="6" y="40" width="108" height="40" rx="7" fill="var(--ic-1)" />
        <g stroke="var(--ic-line)" strokeWidth="3" strokeLinecap="round">
          <path d="M20 40v16M36 40v10M52 40v16M68 40v10M84 40v16M100 40v10" />
        </g>
        <circle cx="26" cy="68" r="4" fill="var(--ic-2)" />
        <circle cx="94" cy="68" r="4" fill="var(--ic-3)" />
      </g>
    </svg>
  );
}

export function BubblesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <rect x="10" y="16" width="68" height="46" rx="15" fill="var(--ic-1)" />
      <path d="M24 60v20l20-20z" fill="var(--ic-1)" />
      <rect x="42" y="46" width="68" height="46" rx="15" fill="var(--ic-2)" />
      <path d="M96 90v18L78 90z" fill="var(--ic-2)" />
      <g fill="var(--ic-line)">
        <circle cx="62" cy="69" r="4.5" />
        <circle cx="76" cy="69" r="4.5" />
        <circle cx="90" cy="69" r="4.5" />
      </g>
    </svg>
  );
}

export function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M54 82h12l-6 28z" fill="var(--ic-3)" />
      <path d="M48 66L32 88l18-6z M72 66l16 22-18-6z" fill="var(--ic-2)" />
      <path d="M60 8c17 14 21 42 13 74H47C39 50 43 22 60 8z" fill="var(--ic-1)" />
      <circle cx="60" cy="46" r="9" fill="var(--ic-line)" />
      <circle cx="60" cy="46" r="5" fill="var(--ic-3)" />
    </svg>
  );
}
