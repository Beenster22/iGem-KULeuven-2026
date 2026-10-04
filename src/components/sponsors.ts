// Generated with Claude Opus 5.5 (Anthropic), 2026-10-04
// Purpose: the team's sponsors in one place, shown both in the footer
// carousel (Footer.tsx) and on the Sponsors page (SponsorGrid.tsx). To add a
// sponsor, upload its logo with the iGEM uploads tool and add an entry here,
// keeping the list alphabetical.
export interface Sponsor {
  name: string;
  /** Logo image URL on static.igem.wiki. */
  src: string;
  /** The sponsor's own website. */
  href: string;
  /** Enlarges the logo inside its footer tile (1 = fitted to the tile's
   * padded area). For logo files with a lot of empty space around the mark,
   * or with a shape that leaves them tiny in the wide, low tile. */
  footerZoom?: number;
  /** Same, for the larger card on the Sponsors page. */
  pageZoom?: number;
}

export const SPONSORS: Sponsor[] = [
  {
    name: "Couleurs de Noir",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/couleurs-de-noir.avif",
    href: "https://couleursdenoir.com/fr",
    footerZoom: 1.3,
    pageZoom: 1.25,
  },
  {
    name: "Eppendorf",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/eppendorf.avif",
    href: "https://www.eppendorf.com/be-en/",
  },
  {
    name: "Gimber",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/gimber.avif",
    href: "https://gimber.com/",
    footerZoom: 3.3,
    pageZoom: 2.1,
  },
  {
    name: "IDT",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/idt.avif",
    href: "https://eu.idtdna.com/page",
  },
  {
    name: "Jena Bioscience",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/jena-bioscience.avif",
    href: "https://www.jenabioscience.com/",
  },
  {
    name: "KU Leuven Kick",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/kul-kick.avif",
    href: "https://lrd.kuleuven.be/kuleuvenkick",
    footerZoom: 1.35,
  },
  {
    name: "KU Leuven Group Biomedical Sciences",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/leuven-group-biomedical-sciences.avif",
    href: "https://gbiomed.kuleuven.be/english/b",
  },
  {
    name: "KU Leuven Group Science, Engineering & Technology",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/kuleuven-groepw-t-cymk-logo-eng.avif",
    href: "https://set.kuleuven.be/en",
  },
  {
    name: "KU Leuven Research & Development",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/leuven-r-d.avif",
    href: "https://lrd.kuleuven.be/",
  },
  {
    name: "New England Biolabs",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/neb.avif",
    href: "https://www.neb.com/en",
    footerZoom: 1.25,
  },
  {
    name: "Promega",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/promega.avif",
    href: "https://be.promega.com/",
    footerZoom: 1.3,
  },
  {
    name: "Reshape Biotech",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/reshape.avif",
    href: "https://reshapebiotech.com/",
    footerZoom: 1.45,
    pageZoom: 1.4,
  },
  {
    name: "Sarstedt",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/sarstedt.avif",
    href: "https://www.sarstedt.com/en/BE",
    footerZoom: 1.15,
  },
  {
    name: "SnapGene",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/snapgene.avif",
    href: "https://www.snapgene.com/",
  },
  {
    name: "Sopachem",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/sopachem.avif",
    href: "https://sopachem.com/",
  },
  {
    name: "Technovation Hub",
    src: "https://static.igem.wiki/teams/6299/wiki/sponsors/technovation-hub.avif",
    href: "https://lrd.kuleuven.be/kuleuvenkick/technovation-hub",
    footerZoom: 1.2,
  },
];
