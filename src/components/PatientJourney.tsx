// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: the "What did we learn?" part of the Patients section on the Human
// Practices page, drawn from the team's sketch as a journey path: initial
// symptoms → diagnostic journey → doctors → treatments, with expenses
// branching off the last step. Clicking a step flips its card over and opens
// that step's write-up in the panel under the path; clicking it again flips
// it back. One step is open at a time.
//
// Usage (MDX): <PatientJourney> with five <JourneyStep title icon> children,
// in path order. Like <Interviewee>, a step is never rendered itself — the
// parent reads its props.
import { Children, ReactElement, ReactNode, isValidElement, useId, useState } from "react";

type JourneyIcon = "symptoms" | "diagnosis" | "doctor" | "treatment" | "expenses";

interface JourneyStepProps {
  title: string;
  icon: JourneyIcon;
  children: ReactNode;
}

export function JourneyStep(_props: JourneyStepProps) {
  return null;
}

const ICONS: Record<JourneyIcon, ReactNode> = {
  // A calendar page with a drop: the period changes most women noticed first.
  symptoms: (
    <>
      <rect x={3.5} y={5} width={17} height={15} rx={2.5} />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M12 12.2c1.4 1.7 2.1 2.9 2.1 3.7a2.1 2.1 0 0 1-4.2 0c0-.8.7-2 2.1-3.7z" />
    </>
  ),
  // A magnifying glass.
  diagnosis: (
    <>
      <circle cx={10.5} cy={10.5} r={6} />
      <path d="M15 15l5.5 5.5" />
    </>
  ),
  // A stethoscope.
  doctor: (
    <>
      <path d="M6 3.5v5a4.5 4.5 0 0 0 9 0v-5" />
      <path d="M10.5 13v2.5a4.5 4.5 0 0 0 9 0v-2" />
      <circle cx={19.5} cy={11.5} r={2} />
    </>
  ),
  // A capsule.
  treatment: (
    <>
      <rect x={2.8} y={8.5} width={18.4} height={7} rx={3.5} transform="rotate(-40 12 12)" />
      <path d="M9.6 9.3l4.8 5.4" />
    </>
  ),
  // A coin with a euro sign.
  expenses: (
    <>
      <circle cx={12} cy={12} r={8.5} />
      <path d="M15 8.6a4 4 0 1 0 0 6.8M7.5 11h5.5M7.5 13.2h5" />
    </>
  ),
};

export function PatientJourney({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children)
    .filter((child): child is ReactElement<JourneyStepProps> => isValidElement(child) && child.type === JourneyStep)
    .map((child) => child.props);
  const [open, setOpen] = useState<number | null>(null);
  const panelId = `patient-journey-${useId().replace(/:/g, "")}`;
  const active = open !== null ? steps[open] : null;

  return (
    <div className="patient-journey">
      <ol className="patient-journey-path">
        {steps.map((step, i) => {
          const isOpen = open === i;
          return (
            <li key={step.title} className={`patient-journey-step patient-journey-step--${i + 1}${isOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="patient-journey-card"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="patient-journey-face patient-journey-face--front">
                  <svg className="patient-journey-icon" viewBox="0 0 24 24" aria-hidden="true">
                    {ICONS[step.icon]}
                  </svg>
                  <span className="patient-journey-title">{step.title}</span>
                </span>
                <span className="patient-journey-face patient-journey-face--back" aria-hidden="true">
                  <span className="patient-journey-title">{step.title}</span>
                  <span className="patient-journey-hint">Read below ↓</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div id={panelId} className={`patient-journey-panel${active ? " is-open" : ""}`} aria-live="polite">
        {active ? (
          <div key={open} className="patient-journey-panel-body">
            <p className="patient-journey-panel-title">{active.title}</p>
            {active.children}
          </div>
        ) : (
          <p className="patient-journey-prompt">Click a step of the journey to read what the women told us.</p>
        )}
      </div>
    </div>
  );
}
