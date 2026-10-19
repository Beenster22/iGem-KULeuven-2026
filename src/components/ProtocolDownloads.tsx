// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the download row at the top of each protocol — the protocol as a
// PDF. Everything the wiki serves has to
// come from iGEM infrastructure, so each file needs a URL on either
// static.igem.wiki or this wiki itself before it can be offered.
//
// A missing URL renders as a visible "not yet uploaded" placeholder rather
// than a dead link or a silently dropped button, so that an un-uploaded
// file is obvious on the page instead of looking finished.

interface ProtocolDownloadsProps {
  /** static.igem.wiki URL of this protocol's PDF. */
  pdf?: string;
}

export function ProtocolDownloads({ pdf }: ProtocolDownloadsProps) {
  return (
    <div className="protocol-downloads">
      {pdf ? (
        <a className="protocol-download" href={pdf} download>
          <span aria-hidden="true">↓</span> Protocol (PDF)
        </a>
      ) : (
        <span className="protocol-download protocol-download--missing">
          Protocol PDF — not yet uploaded
        </span>
      )}
    </div>
  );
}
