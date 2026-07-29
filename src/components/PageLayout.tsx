// Generated with Claude Sonnet 5 (Anthropic), 2026-07-06 (extended 2026-07-13)
// Purpose: lay out a block of page content alongside optional inspiration
// links. Pages may use this more than once for different content blocks —
// the page-wide DNA section index lives one level up, in PageShell.
import { ReactNode } from "react";
import { Inspirations, InspirationLink } from "./Inspirations";

interface PageLayoutProps {
  links?: InspirationLink[];
  children: ReactNode;
}

export function PageLayout({ links, children }: PageLayoutProps) {
  return (
    <div className="row mt-4">
      <div className={links ? "col-lg-8" : "col"}>{children}</div>
      {links && <Inspirations inspirationLinkList={links} />}
    </div>
  );
}
