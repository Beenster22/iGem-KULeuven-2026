// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: a figure with numbered pins over the part of the image each step
// talks about — the CRISPR integration strategy's five steps, previously a
// row of cards below the figure (see StepFlow in ResultsKit.tsx), now pins
// on the figure itself (team feedback: wanted the step picked by pointing at
// the figure, with only that step's text showing instead of all five at
// once). Default step is always the first; Previous/Next step through in
// order and the current pin and heading both make the selection obvious.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

interface FlowStepProps {
  /** Short step name, shown above its text once selected. */
  title: string;
  /** Pin position: x as a percentage across the figure, parked in the gutter
   * above or below the image so it never covers the artwork. */
  marker: { x: number; side: "above" | "below" };
  children?: ReactNode;
}

// A labeled slot for use inside ImageFlowSelector. Never rendered directly —
// the selector reads its props instead (same pattern as SectionItem).
export function FlowStep({ children }: FlowStepProps) {
  return <>{children}</>;
}

interface ImageFlowSelectorProps {
  image: string;
  alt: string;
  children: ReactNode;
}

export function ImageFlowSelector({ image, alt, children }: ImageFlowSelectorProps) {
  const steps = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<FlowStepProps> => isValidElement(child))
        .map((child) => child.props),
    [children],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex];
  const count = steps.length;

  return (
    <div className="image-flow-selector">
      <div className="image-flow-selector-figure">
        <img src={image} alt={alt} className="image-flow-selector-image" />
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            className={`image-flow-selector-marker ${step.marker.side}${index === activeIndex ? " active" : ""}`}
            style={{ left: `${step.marker.x}%` }}
            aria-label={`Step ${index + 1} of ${count}: ${step.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="image-flow-selector-panel">
        <button
          type="button"
          className="image-flow-selector-arrow"
          onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous step"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="image-flow-selector-content">
          <p className="image-flow-selector-title">
            <span className="image-flow-selector-step-count">
              Step {activeIndex + 1} of {count}
            </span>
            {active?.title}
          </p>
          {active && (
            <div className="image-flow-selector-body" key={activeIndex}>
              {active.children}
            </div>
          )}
        </div>
        <button
          type="button"
          className="image-flow-selector-arrow"
          onClick={() => setActiveIndex((index) => Math.min(count - 1, index + 1))}
          disabled={activeIndex === count - 1}
          aria-label="Next step"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
