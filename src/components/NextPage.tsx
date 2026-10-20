// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: a "read next" button at the end of every page (rendered by App.tsx
// under the page body) so the whole wiki can be read front to back by
// following it. The order is the order of pages.ts / the navbar; the last
// page loops back to Home.
import { Link } from "react-router-dom";
import { getPathMapping } from "../utils";

const HOME_PATH = "/";

export function NextPage({ currentPath }: { currentPath: string }) {
  const paths = Object.keys(getPathMapping());
  const index = paths.indexOf(currentPath);
  if (index === -1) return null;

  const isLast = index === paths.length - 1;
  const nextPath = isLast ? HOME_PATH : paths[index + 1];
  const next = getPathMapping()[nextPath];

  return (
    <nav className="next-page" aria-label="Next page">
      <Link to={nextPath} className="btn-empower next-page-link">
        <span className="next-page-text">
          <span className="next-page-kicker">
            {isLast ? "Back to the start" : "Read next"}
          </span>
          <span className="next-page-title">{next.title}</span>
          {next.lead && <span className="next-page-lead">{next.lead}</span>}
        </span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </nav>
  );
}
