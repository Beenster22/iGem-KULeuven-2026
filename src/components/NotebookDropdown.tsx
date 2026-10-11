// Generated with Claude Opus 5.5 (Anthropic), 2026-10-07
// Edited with Claude Opus 5 (Anthropic), 2026-10-09: each notebook now carries
// a research-line colour (see "tone" below) and its entry count, so the page
// reads as a shelf of distinct notebooks rather than a stack of identical bars.
// Purpose: one wet-lab notebook as a dropdown (same pill accordion as the
// protocols page) whose header shows the notebook's title. The notebook is
// written directly in the .mdx page as the dropdown's content. Large
// notebooks are split up with <NotebookSection>, each its own smaller
// dropdown inside the notebook. A button offers the notebook (or a single
// section) as a PDF once it has been uploaded.
import { Children, ReactNode, isValidElement, useState } from "react";
import { ExpandableText } from "./Expandable-Text";

interface NotebookDropdownProps {
  title: ReactNode;
  // URL of the notebook's PDF on static.igem.wiki (uploads tool). Leave it
  // out until the PDF exists — the dropdown then says so instead of linking.
  pdfUrl?: string;
  // Research-line code shown as a badge on the tab, e.g. "STR". Left out it
  // is read from a title of the form "Notebook: STR - ...", so the notebooks
  // in notebook.mdx need no extra props; pass it only for a title that does
  // not follow that pattern.
  code?: string;
  // Which colour the tab's gradient uses. Defaults to the lowercased code,
  // which is what App.css defines a palette entry for (str, mic, cnj, prm,
  // bsh, bsa, fit, sup, gen); anything else falls back to the site accent.
  tone?: string;
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

// "Notebook: STR - Strain and medium selection" -> "STR". Returns undefined
// for the overview dropdown and anything else that is not a research line, so
// those simply get no badge.
function codeFromTitle(title: ReactNode) {
  if (typeof title !== "string") return undefined;
  return /^Notebook:\s*([A-Z]{3})\b/.exec(title)?.[1];
}

// How many <NotebookSection> children this notebook holds, shown on the tab so
// the size of each notebook is visible before opening it. Counted from the
// children rather than passed as a prop, so it cannot fall out of date.
function countSections(children: ReactNode) {
  return Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === NotebookSection,
  ).length;
}

export function NotebookDropdown({
  title,
  pdfUrl,
  code,
  tone,
  children,
}: NotebookDropdownProps) {
  const badge = code ?? codeFromTitle(title);
  const sections = countSections(children);

  return (
    // The tone travels as a data attribute on a wrapper instead of a prop on
    // ExpandableText, which protocols.mdx shares and should keep its plain
    // accent tab.
    <div className="notebook-dropdown" data-tone={tone ?? badge?.toLowerCase()}>
      <ExpandableText
        title={title}
        meta={
          <span className="notebook-dropdown-meta">
            {sections > 0 && (
              <span className="notebook-dropdown-count">
                {sections} {sections === 1 ? "entry" : "entries"}
              </span>
            )}
            {badge && <span className="notebook-dropdown-code">{badge}</span>}
          </span>
        }
      >
        <NotebookPdf pdfUrl={pdfUrl} placeholder="PDF not yet uploaded." />
        {children}
      </ExpandableText>
    </div>
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
