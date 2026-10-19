// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-19
// Purpose: a large, impossible-to-miss call to action for downloading the
// team's software (today: the codon optimization tool on the Dry Lab page).
// The ZIP link uses GitLab's archive endpoint restricted to the tool's folder,
// so everything is served from gitlab.igem.org, as iGEM requires.
interface SoftwareDownloadProps {
  name: string;
  /** Folder of the tool inside the wiki repository, e.g. "software/codon-optimization-tool". */
  path: string;
  description?: string;
}

const REPO = "https://gitlab.igem.org/2026/kuleuven";

export function SoftwareDownload({ name, path, description }: SoftwareDownloadProps) {
  const folder = path.split("/").pop();
  return (
    <aside className="software-download" aria-label={`Download ${name}`}>
      <div className="software-download-text">
        <span className="software-download-kicker">Free &amp; open source · MIT License</span>
        <strong className="software-download-title">Download the {name}</strong>
        {description && <span className="software-download-desc">{description}</span>}
      </div>
      <div className="software-download-actions">
        <a
          className="software-download-btn software-download-btn--primary"
          href={`${REPO}/-/archive/main/${folder}-main.zip?path=${path}`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download (.zip)
        </a>
        <a className="software-download-btn" href={`${REPO}/-/tree/main/${path}`}>
          View on GitLab
        </a>
      </div>
    </aside>
  );
}
