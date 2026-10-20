// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21 (team request)
// Purpose: iGEM's Attributions Form embed (teams.igem.org) with a "Jump to"
// bar of our own that stays pinned under the navbar, so it is always in the
// same place and can always be clicked. The embed has its own "Jump to" bar,
// but it sits at the top of the embedded page and scrolls out of sight with
// it, and the embed's content cannot be restyled from here (it is another
// origin). The embed therefore opens already scrolled to its first section,
// past its own bar, and ours takes its place. Each button points the embed at
// the section's #id, which the embedded page scrolls to — the ids are the ones
// the form's own sections carry, so they change only if iGEM changes the form.
import { useRef } from "react";

const FORM_URL = "https://teams.igem.org/wiki/6299/attributions";

const SECTIONS: { label: string; id: string }[] = [
  { label: "Team Member Contributions", id: "team-member-contributions" },
  { label: "Former Team Members", id: "former-team-member-contributions" },
  { label: "AI Tool Use", id: "ai-tool-use" },
  { label: "iGEM & Partner Offers", id: "igem-partner-offers" },
  { label: "External Contributions", id: "external-contributions" },
  { label: "Timeline", id: "timeline" },
];

export function AttributionsEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const jumpTo = (id: string) => {
    const frameWindow = frameRef.current?.contentWindow;
    // Setting a cross-origin frame's location is allowed; only reading it is not.
    if (frameWindow) frameWindow.location.href = `${FORM_URL}#${id}`;
  };

  return (
    <div className="attributions-embed">
      <div className="attributions-jump-bar" role="navigation" aria-label="Jump to a section of the attributions form">
        <span className="attributions-jump-label">Jump to</span>
        {SECTIONS.map((section) => (
          <button key={section.id} type="button" className="attributions-jump-button" onClick={() => jumpTo(section.id)}>
            {section.label}
          </button>
        ))}
      </div>
      <iframe
        ref={frameRef}
        title="iGEM KU Leuven 2026 Attributions"
        src={`${FORM_URL}#${SECTIONS[0].id}`}
        className="attributions-frame"
      />
    </div>
  );
}
