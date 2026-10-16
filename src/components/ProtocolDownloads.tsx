// Generated with Claude Opus 5 (Anthropic), 2026-10-12
// Purpose: the download row at the top of each protocol — the protocol as a
// PDF, and the shared calculator workbook. Everything the wiki serves has to
// come from iGEM infrastructure, so each file needs a URL on either
// static.igem.wiki or this wiki itself before it can be offered.
//
// A missing URL renders as a visible "not yet uploaded" placeholder rather
// than a dead link or a silently dropped button, so that an un-uploaded
// file is obvious on the page instead of looking finished.
//
// Edited with Claude Opus 5 (Anthropic), 2026-10-12: the calculator workbook
// has no download for now. The iGEM uploads tool rejects .xlsx (422,
// mime-type not allowed), and iGEM's guidance routes "documents and other
// static assets" through that tool, so where the workbook may be hosted is
// an open question with iGEM. Until it is settled the download is simply
// absent: the interactive tables on the page already do its arithmetic, and
// each one still names its workbook tab in text (see ProtocolCalculator), so
// nothing is lost but the file itself.
//
// To restore it, set WORKBOOK_URL and all the buttons come back — the
// protocols still declare which tab they use via the workbookTab prop.

/**
 * Empty while the workbook has nowhere compliant to live. Set this to its URL
 * — on static.igem.wiki once a permitted format is uploaded, or elsewhere on
 * iGEM infrastructure — to re-enable the download on every protocol that
 * declares a `workbookTab`.
 */
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

      {/* No placeholder when the workbook has no URL: unlike the PDFs, it is
          not pending upload but deliberately not offered, and the tab name is
          already given under each table it belongs to. */}
      {workbookTab && WORKBOOK_URL && (
        <a className="protocol-download" href={WORKBOOK_URL} download>
          <span aria-hidden="true">↓</span> Calculators (Excel, tab “
          {workbookTab}”)
        </a>
      )}
    </div>
  );
}
