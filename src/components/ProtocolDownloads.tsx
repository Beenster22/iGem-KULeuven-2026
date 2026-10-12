// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the download row at the top of each protocol — the protocol as a
// PDF, and the shared calculator workbook. Both files live on
// static.igem.wiki (iGEM requires every asset the wiki loads to be served
// from iGEM infrastructure), so each one needs an uploaded URL before it
// can be offered.
//
// A missing URL renders as a visible "not yet uploaded" placeholder rather
// than a dead link or a silently dropped button, so that an un-uploaded
// file is obvious on the page instead of looking finished.

/** Uploaded once and linked from every protocol that has interactive tables. */
export const WORKBOOK_URL = "";

interface ProtocolDownloadsProps {
  /** static.igem.wiki URL of this protocol's PDF. */
  pdf?: string;
  /** Set when this protocol has interactive tables in the workbook. */
  workbookTab?: string;
}

export function ProtocolDownloads({ pdf, workbookTab }: ProtocolDownloadsProps) {
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

      {workbookTab &&
        (WORKBOOK_URL ? (
          <a className="protocol-download" href={WORKBOOK_URL} download>
            <span aria-hidden="true">↓</span> Calculators (Excel, tab “
            {workbookTab}”)
          </a>
        ) : (
          <span className="protocol-download protocol-download--missing">
            Calculator workbook — not yet uploaded (tab “{workbookTab}”)
          </span>
        ))}
    </div>
  );
}
