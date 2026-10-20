// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20 (team request)
// Purpose: the special-prize star the wiki uses in the navbar and page headers,
// as a link to the page behind the prize — put after a heading on the Awards
// page. The star itself is drawn in CSS (.prize-star-link::before) so the
// heading's text, and with it the section index and its #link, stay unchanged.
import { Link } from "react-router-dom";

export function PrizeStar({ to, label }: { to: string; label: string }) {
  return <Link className="prize-star-link" to={to} aria-label={`Special prize: ${label}`} title={`Special prize: ${label}`} />;
}
