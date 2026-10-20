// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21 (team request)
// Purpose: the pillars at the top of the Entrepreneurship page, one per
// business-plan phase (Foundation to Long term impact). Clicking a pillar goes
// straight to that phase. The page shows one phase at a time (PhasePager), so
// the jump first asks it to reveal the phase holding the heading
// ("reveal-section", the same event the section index sends) and then scrolls
// to the heading. The heading is found by its numbering ("Phase 2") rather than
// by id, so renaming a title does not break a pillar.

const PILLARS = [
  { phase: 1, name: "Foundation" },
  { phase: 2, name: "Development" },
  { phase: 3, name: "Sustainability" },
  { phase: 4, name: "Long term impact" },
];

function goToPhase(phase: number) {
  const heading = Array.from(
    document.querySelectorAll<HTMLElement>("section.content-section h2"),
  ).find((candidate) => candidate.textContent?.trim().startsWith(`Phase ${phase}`));
  if (!heading) return;
  if (heading.id) {
    window.dispatchEvent(new CustomEvent("reveal-section", { detail: heading.id }));
    history.replaceState(null, "", `#${heading.id}`);
  }
  heading.scrollIntoView({ block: "start", behavior: "smooth" });
}

export function PhasePillars() {
  return (
    <div className="phase-pillars">
      <p className="phase-pillars-hint">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 11V5a1.5 1.5 0 013 0v5m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v5a6 6 0 01-6 6h-1.5a6 6 0 01-4.7-2.3L4 15.5a1.5 1.5 0 012.3-1.9L9 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Interactive: click a pillar to go to its phase
      </p>

      <div className="phase-pillars-row" role="group" aria-label="Phases of the business plan">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.phase}
            type="button"
            className={`phase-pillar phase-pillar--${pillar.phase}`}
            onClick={() => goToPhase(pillar.phase)}
          >
            <span className="phase-pillar-cap" aria-hidden="true" />
            <span className="phase-pillar-shaft">
              <span className="phase-pillar-number">Phase {pillar.phase}</span>
              <span className="phase-pillar-name">{pillar.name}</span>
            </span>
            <span className="phase-pillar-base" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
