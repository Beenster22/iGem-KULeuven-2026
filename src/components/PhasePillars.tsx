// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21 (team request)
// Purpose: the pillars at the top of the Entrepreneurship page, one per
// business-plan phase (Foundation to Long term impact). Selecting a
// pillar opens a panel under it with the phase's one-line promise and its
// sub-sections; each of those, and the "Go to" button, jump to that part of the
// page. The page shows one phase at a time (PhasePager), so a jump first asks
// it to reveal the phase holding the heading ("reveal-section", the same event
// the section index sends) and then scrolls to the heading. Headings are found
// by their numbering ("Phase 2", "2.3 ") rather than by id, so renaming a
// title does not break a pillar.
import { useState } from "react";

interface Pillar {
  phase: number;
  name: string;
  tagline: string;
  sections: { number: string; title: string }[];
}

const PILLARS: Pillar[] = [
  {
    phase: 1,
    name: "Foundation",
    tagline: "Every good idea starts with a solid foundation.",
    sections: [
      { number: "1.1", title: "Problem and mission" },
      { number: "1.2", title: "Market and target group" },
      { number: "1.3", title: "Stakeholder and patient involvement" },
    ],
  },
  {
    phase: 2,
    name: "Development",
    tagline: "With that foundation, EMPOWER can develop and distinguish itself.",
    sections: [
      { number: "2.1", title: "Unique value proposition" },
      { number: "2.2", title: "Team and skills" },
      { number: "2.3", title: "Marketing and brand identity" },
      { number: "2.4", title: "Minimal viable product" },
      { number: "2.5", title: "Value chain analysis" },
      { number: "2.6", title: "Regulatory strategy" },
      { number: "2.7", title: "IP and commercialisation strategy" },
    ],
  },
  {
    phase: 3,
    name: "Sustainability",
    tagline: "A strong idea deserves a sustainable future.",
    sections: [
      { number: "3.1", title: "Business model canvas" },
      { number: "3.2", title: "Roadmap" },
      { number: "3.3", title: "Risks and mitigation" },
      { number: "3.4", title: "Financial strategy" },
    ],
  },
  {
    phase: 4,
    name: "Long term impact",
    tagline: "The impact of a healthcare innovation extends beyond clinical outcomes alone.",
    sections: [
      { number: "4.1", title: "Positive impacts" },
      { number: "4.2", title: "Negative impacts" },
    ],
  },
];

function jumpTo(level: "h2" | "h3", prefix: string) {
  const heading = Array.from(
    document.querySelectorAll<HTMLElement>(`section.content-section ${level}`),
  ).find((candidate) => candidate.textContent?.trim().startsWith(prefix));
  if (!heading) return;
  if (heading.id) {
    window.dispatchEvent(new CustomEvent("reveal-section", { detail: heading.id }));
    history.replaceState(null, "", `#${heading.id}`);
  }
  heading.scrollIntoView({ block: "start", behavior: "smooth" });
}

export function PhasePillars() {
  const [selected, setSelected] = useState<number | null>(null);
  const active = PILLARS.find((pillar) => pillar.phase === selected);

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
        Interactive: select a pillar to explore its phase
      </p>

      <div className="phase-pillars-row" role="group" aria-label="Phases of the business plan">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.phase}
            type="button"
            className={`phase-pillar phase-pillar--${pillar.phase}${selected === pillar.phase ? " active" : ""}`}
            aria-pressed={selected === pillar.phase}
            onClick={() => setSelected(selected === pillar.phase ? null : pillar.phase)}
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

      {active && (
        <div className="phase-pillars-panel" key={active.phase}>
          <p className="phase-pillars-tagline">{active.tagline}</p>
          <ul className="phase-pillars-sections">
            {active.sections.map((section) => (
              <li key={section.number}>
                <button type="button" onClick={() => jumpTo("h3", `${section.number} `)}>
                  <span className="phase-pillars-section-number">{section.number}</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-empower phase-pillars-go"
            onClick={() => jumpTo("h2", `Phase ${active.phase}`)}
          >
            Go to Phase {active.phase}: {active.name} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
