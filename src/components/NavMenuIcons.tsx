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

// The iGEM Design-Build-Test-Learn cycle: four chunky arrow-shaped wedges
// chasing each other clockwise around a ring, "DBTL" lettered in the open
// centre (no per-arrow labels — too small to read at icon size). Each wedge
// is one closed path: an outer arc, a pointed tip poking past the ring, an
// inner arc back. Deliberately cycles only --ic-1/2/3 (never --ic-line) —
// ic-line is meant to match whichever background the icon sits on (used
// elsewhere as a "cutout" detail inside a filled shape), so a freestanding
// shape drawn in it would vanish on that same background, which is exactly
// what happened on the (always dark) page header before this fix. The
// centre text uses currentColor so it inherits whatever text colour the
// surrounding tile already sets (white on a dark tile/header, plum on a
// light one) rather than needing its own.
export function DbtlCycleIcon(props: SVGProps<SVGSVGElement>) {
  const wedges = [
    { d: "M63.8 16.2A44 44 0 0 1 103.8 56.2L113.5 67.5L83.9 57.9A24 24 0 0 0 62.1 36.1Z", color: "var(--ic-1)" },
    { d: "M103.8 63.8A44 44 0 0 1 63.8 103.8L52.5 113.5L62.1 83.9A24 24 0 0 0 83.9 62.1Z", color: "var(--ic-2)" },
    { d: "M56.2 103.8A44 44 0 0 1 16.2 63.8L6.5 52.5L36.1 62.1A24 24 0 0 0 57.9 83.9Z", color: "var(--ic-3)" },
    { d: "M16.2 56.2A44 44 0 0 1 56.2 16.2L67.5 6.5L57.9 36.1A24 24 0 0 0 36.1 57.9Z", color: "var(--ic-1)" },
  ];
  return (
    <svg {...common} {...props}>
      {wedges.map((wedge, i) => (
        <path key={i} d={wedge.d} fill={wedge.color} />
      ))}
      <text
        x="60"
        y="67"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill="currentColor"
      >
        DBTL
      </text>
    </svg>
  );
}

// A single jigsaw piece: a tab sticking out on the top and right edges,
// a matching notch cut into the bottom and left — the classic puzzle-piece
// silhouette, rather than the previous free-form blob.
export function PuzzleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path
        d="M24 24
           L46 24
           A14 14 0 0 1 74 24
           L96 24
           L96 46
           A14 14 0 0 1 96 74
           L96 96
           L74 96
           A14 14 0 0 0 46 96
           L24 96
           L24 74
           A14 14 0 0 0 24 46
           Z"
        fill="var(--ic-1)"
      />
      <circle cx="60" cy="60" r="7" fill="var(--ic-3)" />
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
      <path d="M48 12h24" stroke="var(--ic-2)" strokeWidth="8" strokeLinecap="round" />
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
      <rect x="43" y="12" width="34" height="34" rx="7" fill="none" stroke="var(--ic-2)" strokeWidth="5" />
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
      <g stroke="var(--ic-2)" strokeWidth="8" strokeLinecap="round">
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

// A megaphone with sound waves — Science Communication & Outreach.
export function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path d="M20 48h18l40-24v72L38 72H20a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6Z" fill="var(--ic-1)" />
      <path d="M30 72h16l6 26a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-5Z" fill="var(--ic-2)" />
      <rect x="74" y="20" width="12" height="80" rx="6" fill="var(--ic-2)" />
      <g fill="none" stroke="var(--ic-3)" strokeWidth="6" strokeLinecap="round">
        <path d="M96 48c5 7 5 17 0 24" />
        <path d="M104 38c10 13 10 31 0 44" />
      </g>
    </svg>
  );
}

// A screen with a code bracket and a blinking cursor — Dry Lab's
// computational work.
export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <rect x="10" y="20" width="100" height="70" rx="10" fill="var(--ic-1)" />
      <rect x="10" y="20" width="100" height="16" rx="8" fill="var(--ic-2)" />
      <g fill="var(--ic-3)">
        <circle cx="22" cy="28" r="3" />
        <circle cx="32" cy="28" r="3" />
      </g>
      <path
        d="M42 54l-10 10 10 10M78 54l10 10-10 10M65 50l-10 28"
        fill="none"
        stroke="var(--ic-line)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="46" y="100" width="28" height="8" rx="4" fill="var(--ic-2)" />
    </svg>
  );
}

export function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...common} {...props}>
      <path
        d="M34 18h52v26c0 16-12 28-26 28s-26-12-26-28Z"
        fill="var(--ic-1)"
      />
      <path
        d="M34 24H18v6c0 12 8 20 18 22v-9c-5-3-8-9-8-16Z"
        fill="var(--ic-2)"
      />
      <path
        d="M86 24h16v6c0 12-8 20-18 22v-9c5-3 8-9 8-16Z"
        fill="var(--ic-2)"
      />
      <rect x="54" y="68" width="12" height="16" fill="var(--ic-1)" />
      <path d="M40 100c2-10 10-16 20-16s18 6 20 16Z" fill="var(--ic-1)" />
      <circle cx="60" cy="32" r="8" fill="var(--ic-3)" />
    </svg>
  );
}
