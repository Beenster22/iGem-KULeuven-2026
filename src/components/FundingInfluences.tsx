// Generated with Claude Opus 5.5 (Anthropic), 2026-10-21
// Purpose: Figure 3 of the Legislators & Advocates section on the Human
// Practices page — what pushes funding for PMOS up and what holds it back,
// redrawn in the site's style from the team's Canva diagram: teal arrows
// pointing in from the left, red arrows pointing in from the right, and the
// funding column in the middle. Stacks vertically on narrow screens.

const POSITIVE = ["Research", "Advocacy, education & awareness", "Legislation"];
const NEGATIVE = ["Stigma & misogyny", "Pipeline issues", "Targeted funding & structure"];

export function FundingInfluences() {
  return (
    <div className="funding-influences">
      <div className="funding-influences-side funding-influences-side--positive">
        <p className="funding-influences-heading">Positive influences</p>
        <ul>
          {POSITIVE.map((item) => (
            <li key={item} className="funding-influences-arrow">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="funding-influences-core">
        <span>Funding for PMOS</span>
      </div>

      <div className="funding-influences-side funding-influences-side--negative">
        <p className="funding-influences-heading">Negative influences</p>
        <ul>
          {NEGATIVE.map((item) => (
            <li key={item} className="funding-influences-arrow">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
