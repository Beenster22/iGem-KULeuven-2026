// Generated with Claude Opus 5.5 (Anthropic), 2026-10-04
// Purpose: the team's sponsors in one place, shown both in the footer
// carousel (Footer.tsx) and on the Sponsors page (SponsorGrid.tsx). To add a
// sponsor, upload its logo with the iGEM uploads tool and add an entry here
// with its tier. The list is ordered gold, silver, bronze, then the sponsors
// of the iGEM competition itself ("igem"); that is also the order of the
// footer carousel.
// Updated with Claude Opus 5.5 (Anthropic), 2026-10-06: sponsor tiers.
export type SponsorTier = "gold" | "silver" | "bronze" | "igem";

export interface Sponsor {
  name: string;
  /** Logo image URL on static.igem.wiki. Omit to show the name as a text
   * placeholder until the logo has been uploaded. */
  src?: string;
  /** The sponsor's own website. */
  href?: string;
  /** Sponsorship tier; sponsors without one are listed after the tiers. */
  tier?: SponsorTier;
  /** Enlarges the logo inside its footer tile (1 = fitted to the tile's
   * padded area). For logo files with a lot of empty space around the mark,
   * or with a shape that leaves them tiny in the wide, low tile. */
  footerZoom?: number;
  /** Same, for the larger card on the Sponsors page. */
  pageZoom?: number;
}

export const SPONSORS: Sponsor[] = [
  {
    name: "KU Leuven Group Biomedical Sciences",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/leuven-group-biomedical-sciences.avif",
    href: "https://gbiomed.kuleuven.be/english/b",
    tier: "gold",
  },
  {
    name: "KU Leuven Research & Development",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/leuven-r-d.avif",
    href: "https://lrd.kuleuven.be/",
    tier: "gold",
  },
  {
    name: "KU Leuven Group Science, Engineering & Technology",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/kuleuven-groepw-t-cymk-logo-eng.avif",
    href: "https://set.kuleuven.be/en",
    tier: "gold",
  },
  {
    name: "Eppendorf",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/eppendorf.avif",
    href: "https://www.eppendorf.com/be-en/",
    tier: "gold",
  },
  {
    name: "Reshape Biotech",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/reshape.avif",
    href: "https://reshapebiotech.com/",
    footerZoom: 1.45,
    pageZoom: 1.4,
    tier: "gold",
  },
  {
    name: "Merck Healthcare & Fertility",
    tier: "silver",
  },
  {
    name: "Merck Life Science",
    tier: "bronze",
  },
  {
    name: "Sarstedt",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/sarstedt.avif",
    href: "https://www.sarstedt.com/en/BE",
    footerZoom: 1.15,
    tier: "bronze",
  },
  {
    name: "Technovation Hub",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/technovation-hub.avif",
    href: "https://lrd.kuleuven.be/kuleuvenkick/technovation-hub",
    footerZoom: 1.2,
    tier: "bronze",
  },
  {
    name: "Promega",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/promega.avif",
    href: "https://be.promega.com/",
    footerZoom: 1.3,
    tier: "bronze",
  },
  {
    name: "Jena Bioscience",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/jena-bioscience.avif",
    href: "https://www.jenabioscience.com/",
    tier: "bronze",
  },
  {
    name: "Sopachem",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/sopachem.avif",
    href: "https://sopachem.com/",
    tier: "bronze",
  },
  {
    name: "SnapGene",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/snapgene.avif",
    href: "https://www.snapgene.com/",
    tier: "bronze",
  },
  {
    name: "New England Biolabs",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/neb.avif",
    href: "https://www.neb.com/en",
    footerZoom: 1.25,
    tier: "bronze",
  },
  {
    name: "Couleurs de Noir",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/couleurs-de-noir.avif",
    href: "https://couleursdenoir.com/fr",
    footerZoom: 1.3,
    pageZoom: 1.25,
    tier: "bronze",
  },
  {
    name: "Gimber",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/gimber.avif",
    href: "https://gimber.com/",
    footerZoom: 3.3,
    pageZoom: 2.1,
    tier: "bronze",
  },
  {
    name: "KU Leuven Kick",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/kul-kick.avif",
    href: "https://lrd.kuleuven.be/kuleuvenkick",
    footerZoom: 1.35,
    tier: "bronze",
  },
  {
    name: "IDT",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/idt.avif",
    href: "https://eu.idtdna.com/page",
    tier: "igem",
  },
  {
    name: "Anthropic",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/anthropic-logo.avif",
    href: "https://www.anthropic.com/",
    tier: "igem",
  },
  {
    name: "Twist Bioscience",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/twist-bioscience-official-logo.avif",
    href: "https://www.twistbioscience.com/",
    tier: "igem",
  },
];
