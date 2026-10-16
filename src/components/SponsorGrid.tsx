// Generated with Claude Opus 5.5 (Anthropic), 2026-10-04
// Purpose: the Sponsors page's logo wall — one card per sponsor from
// sponsors.ts, each linking to the sponsor's own website. Used in
// sponsors.mdx as <SponsorGrid />.
// Updated with Claude Opus 5.5 (Anthropic), 2026-10-06: sponsors are grouped
// by tier (gold first, then silver, bronze, iGEM's own sponsors, and any
// sponsors without a tier), with larger cards for the higher tiers.
import { SPONSORS, Sponsor, SponsorTier } from "./sponsors";

const TIERS: { tier: SponsorTier | undefined; label: string }[] = [
  { tier: "gold", label: "Gold" },
  { tier: "silver", label: "Silver" },
  { tier: "bronze", label: "Bronze" },
  { tier: "igem", label: "iGEM Sponsors" },
  { tier: undefined, label: "Other sponsors" },
];

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <>
      <span className="sponsor-grid-logo">
        {sponsor.src ? (
          <img
            src={sponsor.src}
            alt=""
            loading="lazy"
            style={
              sponsor.pageZoom
                ? { transform: `scale(${sponsor.pageZoom})` }
                : undefined
            }
          />
        ) : (
          <span className="sponsor-grid-placeholder" aria-hidden="true">
            {sponsor.name}
          </span>
        )}
      </span>
      <span className="sponsor-grid-name">{sponsor.name}</span>
    </>
  );

  return sponsor.href ? (
    <a
      className="sponsor-grid-card"
      href={sponsor.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {content}
    </a>
  ) : (
    <div className="sponsor-grid-card">{content}</div>
  );
}

export function SponsorGrid() {
  return (
    <>
      {TIERS.map(({ tier, label }) => {
        const sponsors = SPONSORS.filter((sponsor) => sponsor.tier === tier);
        if (sponsors.length === 0) return null;
        const modifier = tier ?? "other";

        return (
          <section
            key={modifier}
            className={`sponsor-tier sponsor-tier-${modifier}`}
          >
            <h3 className="sponsor-tier-heading">{label}</h3>
            <ul className="sponsor-grid">
              {sponsors.map((sponsor) => (
                <li key={sponsor.name}>
                  <SponsorCard sponsor={sponsor} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
