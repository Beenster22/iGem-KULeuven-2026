// Generated with Claude Sonnet 5 (Anthropic), 2026-10-18
// Purpose: one flat illustration per mega-menu entry (see Navbar.tsx), drawn
// in the same style and palette as the home page's "Find out more about
// EMPOWER" cards (FindOutMoreIcons.tsx / Tgr5Story.tsx): flat shapes using
// --ic-1 / --ic-2 / --ic-3 / --ic-line, set per tile (see .mega-menu-link in
// App.css) so the same drawing works on a dark or a light tile. Pages that
// already have an icon on the home page (Description, Results, Integrated
// Human Practices) reuse that exact icon instead of a near-duplicate.
import type { SVGProps } from "react";

const common = {
  viewBox: "0 0 120 120",
  "aria-hidden": true,
  focusable: false,
} as const;

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <g stroke="var(--ic-line)" strokeWidth="10" strokeLinecap="round">
        <path d="M60 10v14M60 96v14M110 60H96M24 60H10M93 27l-10 10M37 83l-10 10M93 93l-10-10M37 37 27 27" />
      </g>
      <circle cx="60" cy="60" r="30" fill="var(--ic-1)" />
      <circle cx="60" cy="60" r="13" fill="var(--ic-line)" />
      <circle cx="60" cy="60" r="7" fill="var(--ic-3)" />
    </svg>
  );
}

export function PuzzleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path
        d="M38 14h30a6 6 0 0 1 6 6v13a10 10 0 0 1 17 6 10 10 0 0 1-17 6v13a6 6 0 0 1-6 6H58a10 10 0 0 0 0-17 10 10 0 0 0 0 17H38a6 6 0 0 1-6-6V68a10 10 0 0 1-17-6 10 10 0 0 1 17-6V26a6 6 0 0 1 6-6Z"
        fill="var(--ic-1)"
      />
      <circle cx="60" cy="52" r="7" fill="var(--ic-3)" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M60 10 98 24v30c0 26-17 42-38 46C39 96 22 80 22 54V24Z" fill="var(--ic-1)" />
      <path d="M60 10 98 24v30c0 26-17 42-38 46Z" fill="var(--ic-2)" fillOpacity="0.5" />
      <path
        d="M42 58l13 13 24-26"
        fill="none"
        stroke="var(--ic-line)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlaskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M48 12h24" stroke="var(--ic-line)" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M51 14v26L26 86a10 10 0 0 0 9 15h50a10 10 0 0 0 9-15L69 40V14Z"
        fill="var(--ic-1)"
      />
      <path d="M33 72h54l7 14a10 10 0 0 1-9 15H35a10 10 0 0 1-9-15Z" fill="var(--ic-2)" />
      <circle cx="56" cy="62" r="4.5" fill="var(--ic-3)" />
      <circle cx="68" cy="70" r="3.5" fill="var(--ic-3)" />
    </svg>
  );
}

export function ClipboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <rect x="26" y="16" width="68" height="92" rx="10" fill="var(--ic-1)" />
      <rect x="44" y="8" width="32" height="16" rx="6" fill="var(--ic-2)" />
      <g stroke="var(--ic-line)" strokeWidth="6" strokeLinecap="round">
        <path d="M39 50h26M39 64h26M39 78h18" />
      </g>
      <path
        d="M66 60l9 9 16-18"
        fill="none"
        stroke="var(--ic-3)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BlocksIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <rect x="14" y="40" width="34" height="34" rx="7" fill="var(--ic-1)" />
      <rect x="72" y="40" width="34" height="34" rx="7" fill="var(--ic-2)" />
      <rect x="43" y="68" width="34" height="34" rx="7" fill="var(--ic-3)" />
      <rect x="43" y="12" width="34" height="34" rx="7" fill="none" stroke="var(--ic-line)" strokeWidth="5" />
    </svg>
  );
}

export function NotebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M22 18a8 8 0 0 1 8-8h22v92H30a8 8 0 0 1-8-8Z" fill="var(--ic-1)" />
      <path d="M52 10h38a8 8 0 0 1 8 8v74a8 8 0 0 1-8 8H52Z" fill="var(--ic-2)" />
      <g stroke="var(--ic-line)" strokeWidth="6" strokeLinecap="round">
        <path d="M64 34h24M64 48h24M64 62h16" />
      </g>
      <circle cx="30" cy="34" r="3.5" fill="var(--ic-3)" />
      <circle cx="30" cy="48" r="3.5" fill="var(--ic-3)" />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <rect x="14" y="26" width="92" height="80" rx="12" fill="var(--ic-1)" />
      <rect x="14" y="26" width="92" height="24" rx="12" fill="var(--ic-2)" />
      <g stroke="var(--ic-line)" strokeWidth="8" strokeLinecap="round">
        <path d="M38 14v20M82 14v20" />
      </g>
      <g fill="var(--ic-3)">
        <circle cx="38" cy="74" r="5" />
        <circle cx="60" cy="74" r="5" />
        <circle cx="82" cy="74" r="5" />
        <circle cx="38" cy="90" r="5" />
        <circle cx="60" cy="90" r="5" />
      </g>
    </svg>
  );
}

export function PeopleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <circle cx="40" cy="38" r="17" fill="var(--ic-1)" />
      <circle cx="80" cy="42" r="14" fill="var(--ic-2)" />
      <path d="M12 102c2-22 13-34 28-34s26 12 28 34Z" fill="var(--ic-1)" />
      <path d="M68 102c2-18 10-28 24-28s22 10 24 28Z" fill="var(--ic-2)" fillOpacity="0.85" />
      <circle cx="40" cy="38" r="6" fill="var(--ic-3)" />
    </svg>
  );
}

export function RibbonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M38 64 24 108l22-10 14 14 14-14 22 10-14-44" fill="var(--ic-2)" />
      <circle cx="60" cy="48" r="30" fill="var(--ic-1)" />
      <circle cx="60" cy="48" r="16" fill="none" stroke="var(--ic-line)" strokeWidth="6" />
      <circle cx="60" cy="48" r="5" fill="var(--ic-3)" />
    </svg>
  );
}

export function HandshakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path
        d="M60 100c22-10 36-10 46-30 6-12-4-24-16-18-6 3-12 9-18 15"
        fill="var(--ic-1)"
      />
      <path
        d="M60 100c-22-10-36-10-46-30-6-12 4-24 16-18 6 3 12 9 18 15"
        fill="var(--ic-2)"
      />
      <circle cx="60" cy="58" r="9" fill="var(--ic-3)" />
    </svg>
  );
}
