// Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
// Purpose: infinite-scrolling sponsor logo band. Wrap any number of
// <SponsorLogo> children in <SponsorCarousel> and it revolves through all of
// them automatically — copy the example in Footer.tsx and swap in real logos.
import { Children, ReactElement, ReactNode, isValidElement } from "react";

interface SponsorLogoProps {
  name: string;
  /** Logo image URL (upload via the iGEM uploads tool, then reference the
   * static.igem.wiki link here). Omit to show a text placeholder instead. */
  src?: string;
  href?: string;
}

// A labeled slot for use inside SponsorCarousel. Never rendered directly —
// the parent reads its props via extractSponsors instead.
export function SponsorLogo(_props: SponsorLogoProps) {
  return null;
}

interface Sponsor {
  name: string;
  src?: string;
  href?: string;
}

function extractSponsors(children: ReactNode): Sponsor[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<SponsorLogoProps> => isValidElement(child))
    .map((child) => ({
      name: child.props.name,
      src: child.props.src,
      href: child.props.href,
    }));
}

interface SponsorCarouselProps {
  children: ReactNode;
  /** Seconds for one full loop through the logos. */
  speed?: number;
}

function SponsorTile({ sponsor, hidden }: { sponsor: Sponsor; hidden?: boolean }) {
  const content = sponsor.src ? (
    <img src={sponsor.src} alt={sponsor.name} />
  ) : (
    <span className="sponsor-carousel-placeholder">{sponsor.name}</span>
  );

  if (hidden) {
    return (
      <div className="sponsor-carousel-item" aria-hidden="true">
        {content}
      </div>
    );
  }

  return sponsor.href ? (
    <a
      className="sponsor-carousel-item"
      href={sponsor.href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {content}
    </a>
  ) : (
    <div className="sponsor-carousel-item">{content}</div>
  );
}

export function SponsorCarousel({ children, speed = 25 }: SponsorCarouselProps) {
  const sponsors = extractSponsors(children);

  return (
    <div
      className="sponsor-carousel"
      style={{ "--sponsor-carousel-duration": `${speed}s` } as React.CSSProperties}
    >
      <div className="sponsor-carousel-track">
        {sponsors.map((sponsor, index) => (
          <SponsorTile key={`${sponsor.name}-${index}`} sponsor={sponsor} />
        ))}
        {sponsors.map((sponsor, index) => (
          <SponsorTile key={`${sponsor.name}-dup-${index}`} sponsor={sponsor} hidden />
        ))}
      </div>
    </div>
  );
}
