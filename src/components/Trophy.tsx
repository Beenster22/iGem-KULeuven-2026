// Generated with Claude Sonnet 5 (Anthropic), 2026-10-20 (team request)
// Purpose: a small badge for events where the team won an award — the trophy
// sways and drifts a little, with sparkles twinkling around it, echoing the
// navbar's glitter effect (see the nav-glitter-* rules in App.css).
// `overlay` pins it to the top-right corner of a photo; without it, it sits
// inline next to a heading (e.g. the event detail title).
export function Trophy({ overlay }: { overlay?: boolean }) {
  return (
    <span
      className={`trophy-badge${overlay ? " trophy-badge-overlay" : ""}`}
      aria-hidden="true"
      title="Award won"
    >
      <span className="trophy-icon">🏆</span>
      <span className="trophy-spark trophy-spark--1">✦</span>
      <span className="trophy-spark trophy-spark--2">✧</span>
      <span className="trophy-spark trophy-spark--3">✦</span>
    </span>
  );
}
