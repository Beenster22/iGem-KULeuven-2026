import { ReactNode, SVGProps } from "react";
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
}

export function Header({ title, lead, icon: Icon, aside }: HeaderProps) {
  return (
    <header className="page-header-box">
      <div className={`container${aside ? " page-header-box-row" : ""}`}>
        <div className="page-header-box-text">
          <div className="page-header-box-title-row">
            {Icon && (
              <span className="page-header-icon" aria-hidden="true">
                <Icon />
              </span>
            )}
            <h1 className="display-4 mb-2">{title}</h1>
          </div>
          {/* Pages whose lead has not been written yet get the title alone
              rather than an empty paragraph. */}
          {lead && <p className="lead mb-0">{renderItalics(lead)}</p>}
        </div>
        {aside && <div className="page-header-box-aside">{aside}</div>}
      </div>
    </header>
  );
}
