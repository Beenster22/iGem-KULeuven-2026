import { ReactNode } from "react";
import { renderItalics } from "../utils/renderItalics";

interface HeaderProps {
  title: string;
  lead: string;
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: an optional right-hand decoration for the header box, next to
  // the title and lead — used by the results page for Elle's greeting, so
  // she sits in the header itself rather than taking up a row of the page
  // body. Left out, the header is title + lead alone, as on every other page.
  aside?: ReactNode;
}

export function Header({ title, lead, aside }: HeaderProps) {
  return (
    <header className="page-header-box">
      <div className={`container${aside ? " page-header-box-row" : ""}`}>
        <div className="page-header-box-text">
          <h1 className="display-4 mb-2">{title}</h1>
          {/* Pages whose lead has not been written yet get the title alone
              rather than an empty paragraph. */}
          {lead && <p className="lead mb-0">{renderItalics(lead)}</p>}
        </div>
        {aside && <div className="page-header-box-aside">{aside}</div>}
      </div>
    </header>
  );
}
