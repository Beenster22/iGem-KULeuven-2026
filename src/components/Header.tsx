import { ReactNode, SVGProps } from "react";
import { folderSlug } from "../utils";
import { renderItalics } from "../utils/renderItalics";

interface HeaderProps {
  title: string;
  lead: string;
  // Optional: the page's icon from pages.ts (same drawing as its navbar
  // mega-menu tile, see NavMenuIcons.tsx / FindOutMoreIcons.tsx), shown
  // beside the title. Pages that don't set one (Home, 404) get the title
  // alone.
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: an optional right-hand decoration for the header box, next to
  // the title and lead — used by the results page for Elle's greeting, so
  // she sits in the header itself rather than taking up a row of the page
  // body. Left out, the header is title + lead alone, as on every other page.
  aside?: ReactNode;
  // Optional: marks this page as a special prize's dedicated page (see
  // pages.ts `specialPrize`) — shows the same "Special prize" badge as the
  // home page's FindOutMore cards, next to the title.
  specialPrize?: boolean;
  // Optional: the top-level nav folder this page belongs to (pages.ts /
  // getPathMapping's `folder`, e.g. "Project", "Lab"). Exposed as
  // data-folder so App.css can tint this page's header band and icon chip —
  // and Navbar.tsx the matching nav item — a little differently per folder,
  // so a reader can tell which section of the wiki they're in without
  // reading the breadcrumb. A page outside any folder (Home, Entrepreneurship,
  // Awards) gets no tint.
  folder?: string;
}

export function Header({
  title,
  lead,
  icon: Icon,
  aside,
  specialPrize,
  folder,
}: HeaderProps) {
  return (
    <header className="page-header-box" data-folder={folderSlug(folder)}>
      <div className={`container${aside ? " page-header-box-row" : ""}`}>
        <div className="page-header-box-text">
          <div className="page-header-box-icon-row">
            {Icon && (
              <span className="page-header-icon" aria-hidden="true">
                <Icon />
              </span>
            )}
            <div>
              <div className="page-header-box-title-row">
                <h1 className="display-4 mb-2">{title}</h1>
                {specialPrize && (
                  <span className="page-header-prize-badge">
                    <span aria-hidden="true">★</span> Special prize{" "}
                    <span aria-hidden="true">★</span>
                  </span>
                )}
              </div>
              {/* Pages whose lead has not been written yet get the title
                  alone rather than an empty paragraph. */}
              {lead && <p className="lead mb-0">{renderItalics(lead)}</p>}
            </div>
          </div>
        </div>
        {aside && <div className="page-header-box-aside">{aside}</div>}
      </div>
    </header>
  );
}
