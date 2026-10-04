// Generated with Claude Opus 5.5 (Anthropic), 2026-10-04
// Purpose: the Sponsors page's logo wall — one card per sponsor from
// sponsors.ts, each linking to the sponsor's own website. Used in
// sponsors.mdx as <SponsorGrid />.
import { SPONSORS } from "./sponsors";

export function SponsorGrid() {
  return (
    <ul className="sponsor-grid">
      {SPONSORS.map((sponsor) => (
        <li key={sponsor.name}>
          <a
            className="sponsor-grid-card"
            href={sponsor.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="sponsor-grid-logo">
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
            </span>
            <span className="sponsor-grid-name">{sponsor.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
