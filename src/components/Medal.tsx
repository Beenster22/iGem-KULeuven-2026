// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: a small medal in the metal's own colour — bronze, silver or gold —
// for the headings of the Awards page. A ribbon in the brand's purple and
// teal, and a round metallic medal with a star on it. It is decorative (the
// heading carries the words), and sized in em so it follows the heading.
import { useId } from "react";

type Tier = "bronze" | "silver" | "gold";

// [light, mid, dark] stops of the metal, and the rim and star shades.
const METAL: Record<Tier, { stops: [string, string, string]; rim: string; star: string }> = {
  bronze: { stops: ["#e9a86b", "#cd7f32", "#8a4f1d"], rim: "#7a4418", star: "#f6d3ae" },
  silver: { stops: ["#f4f6f8", "#c0c4c9", "#7f858c"], rim: "#6c727a", star: "#ffffff" },
  gold: { stops: ["#fff0a6", "#f2c230", "#b8860b"], rim: "#946b06", star: "#fff7cc" },
};

export function Medal({ tier }: { tier: Tier }) {
  const id = useId();
  const { stops, rim, star } = METAL[tier];

  return (
    <svg
      className="medal-icon"
      viewBox="0 0 64 84"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-metal`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.55" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </radialGradient>
      </defs>
      <path d="M14 0h14l8 30-10 6z" fill="#33283f" />
      <path d="M50 0H36l-8 30 10 6z" fill="#2fa4a9" />
      <circle cx="32" cy="55" r="26" fill={`url(#${id}-metal)`} stroke={rim} strokeWidth="2.5" />
      <circle cx="32" cy="55" r="19" fill="none" stroke={rim} strokeOpacity="0.45" strokeWidth="1.5" />
      <path
        d="M32 41l4.1 8.7 9.5 1.2-7 6.6 1.8 9.4-8.4-4.6-8.4 4.6 1.8-9.4-7-6.6 9.5-1.2z"
        fill={star}
        stroke={rim}
        strokeOpacity="0.6"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
