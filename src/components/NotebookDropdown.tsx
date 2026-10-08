// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Purpose: one wet-lab notebook as a dropdown (same pill accordion as the
// protocols page) whose header shows the notebook's title. The notebook is
// written directly in the .mdx page as the dropdown's content. Large
// notebooks are split up with <NotebookSection>, each its own smaller
// dropdown inside the notebook. A button offers the notebook (or a single
// section) as a PDF once it has been uploaded.
import { ReactNode, useState } from "react";
import { ExpandableText } from "./Expandable-Text";

interface NotebookDropdownProps {
  title: ReactNode;
  // URL of the notebook's PDF on static.igem.wiki (uploads tool). Leave it
  // out until the PDF exists — the dropdown then says so instead of linking.
  pdfUrl?: string;
  children: ReactNode;
}

interface NotebookPdfProps {
  pdfUrl?: string;
  // Shown when there is no PDF yet; leave out to show nothing at all.
  placeholder?: string;
}

function NotebookPdf({ pdfUrl, placeholder }: NotebookPdfProps) {
  if (!pdfUrl && !placeholder) return null;

  return (
    <div className="notebook-dropdown-pdf">
      {pdfUrl ? (
        // `download` is only honoured for same-origin files; from
        // static.igem.wiki the browser opens the PDF in a new tab instead,
        // where it can be saved.
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="notebook-dropdown-download"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Download PDF
        </a>
      ) : (
        <span className="notebook-dropdown-pdf-placeholder">{placeholder}</span>
      )}
    </div>
  );
}

export function NotebookDropdown({ title, pdfUrl, children }: NotebookDropdownProps) {
  return (
    <ExpandableText title={title}>
      <NotebookPdf pdfUrl={pdfUrl} placeholder="PDF not yet uploaded." />
      {children}
    </ExpandableText>
  );
}

interface NotebookSectionProps {
  title: ReactNode;
  // Optional PDF of just this section, for notebooks uploaded in parts.
  pdfUrl?: string;
  children: ReactNode;
}

// One section of a NotebookDropdown, as its own smaller dropdown nested
// inside the notebook. The title is an h4 marked data-toc-sub, so the
// page-wide left index (SectionProgress) lists a notebook's sections under
// it for as long as that notebook is open.
export function NotebookSection({ title, pdfUrl, children }: NotebookSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notebook-section">
      <button
        type="button"
        className="notebook-section-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <h4 className="notebook-section-title" data-toc-sub>{title}</h4>
        <svg
          className="expandable-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="notebook-section-content">
          <NotebookPdf pdfUrl={pdfUrl} />
          {children}
        </div>
      )}
    </div>
  );
}
