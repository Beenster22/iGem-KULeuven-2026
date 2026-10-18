// Generated with Claude Opus 5 (Anthropic), 2026-10-19
// Purpose: the "what we learned / how we integrated it" summary that closes a
// stakeholder group on the Human Practices page. Deliberately not a <table>:
// it is two columns of prose separated by a hairline, with a marker column on
// the right saying whether that point was actively or passively implemented
// (same active/passive/none vocabulary as <FeedbackOutcome> in the feedback
// cycle above it). Runs of rows that share a marker draw one continuous bar,
// so a group of passive points reads as a single bracket spanning them.
import { Children, ReactElement, ReactNode, isValidElement, useMemo } from "react";

export type ImpactKind = "active" | "passive" | "none";

const IMPACT_LABEL: Record<ImpactKind, string> = {
  active: "Active implementation",
  passive: "Passive implementation",
  none: "Not relevant",
};

interface IntegrationPointProps {
  /** Left column. Leave it off to continue the point in the row above — the
   *  row then shares that point's heading instead of repeating it. */
  learned?: string;
  /** Right column: what we did with it. */
  integrated: string;
  /** Marker on the right. Leave it off when the point was never classified. */
  impact?: ImpactKind;
}

// A labeled slot for use inside <IntegrationSummary>. Never rendered
// directly — the parent reads its props, same pattern as <Interviewee>.
export function IntegrationPoint(_props: IntegrationPointProps) {
  return null;
}

interface IntegrationSummaryProps {
  /** Heading above the summary; pass an empty string to leave it off. */
  title?: string;
  children: ReactNode;
}

export function IntegrationSummary({
  title = "What we learned and how we integrated it",
  children,
}: IntegrationSummaryProps) {
  const points = useMemo(
    () =>
      Children.toArray(children)
        .filter(
          (child): child is ReactElement<IntegrationPointProps> =>
            isValidElement(child) && child.type === IntegrationPoint,
        )
        .map((child) => child.props),
    [children],
  );

  if (points.length === 0) return null;

  return (
    <div className="integration-summary">
      {title && <h4 className="integration-summary-title">{title}</h4>}

      <div className="integration-summary-grid">
        <div className="integration-summary-headrow">
          <span className="integration-summary-head">What we learned</span>
          <span className="integration-summary-head">How we integrated it</span>
          <span className="integration-summary-head" />
        </div>

        {points.map((point, index) => {
          // A row with no `learned` text carries on from the row above, so it
          // keeps that point's heading and loses the divider between them.
          const continuation = !point.learned;
          const sameAsPrevious =
            index > 0 && points[index - 1].impact === point.impact;
          const sameAsNext =
            index < points.length - 1 && points[index + 1].impact === point.impact;

          const barClass = [
            "integration-summary-bar",
            point.impact ? `integration-summary-bar--${point.impact}` : "",
            sameAsPrevious ? "is-continued" : "",
            sameAsNext ? "is-continuing" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={index}
              className={`integration-summary-row${continuation ? " is-continuation" : ""}`}
            >
              <p className="integration-summary-learned">{point.learned}</p>
              <p className="integration-summary-integrated">{point.integrated}</p>
              <div className="integration-summary-impact">
                {point.impact && (
                  <>
                    <span className={barClass} aria-hidden="true" />
                    {/* Only the first row of a run is labelled, so a run of
                        rows reads as one bracket with one caption. */}
                    <span
                      className={`integration-summary-impact-label${sameAsPrevious ? " is-hidden" : ""}`}
                    >
                      {IMPACT_LABEL[point.impact]}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
