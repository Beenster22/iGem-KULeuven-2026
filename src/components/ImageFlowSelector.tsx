// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: a figure with numbered pins over the part of the image each step
// talks about — the CRISPR integration strategy's five steps, previously a
// row of cards below the figure (see StepFlow in ResultsKit.tsx), now pins
// on the figure itself (team feedback: wanted the step picked by pointing at
// the figure, with only that step's text showing instead of all five at
// once). Default step is always the first; Previous/Next step through in
// order and the current pin and heading both make the selection obvious.
//
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-20: a figure can now carry
// its own numbered circles (the CRISPR figure from the team's BioRender
// export). Give a step marker an `x` and `y` and `crop` the artwork's white
// margin away, and the pin becomes a clickable ring sitting exactly on the
// circle baked into the image, so the numbers on the figure and the steps
// below it are the same ones. Positions are % of the full image.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

interface FlowStepProps {
  /** Short step name, shown above its text once selected. */
  title: string;
  /** Pin position: x as a percentage across the figure, parked in the gutter
   * above or below the image so it never covers the artwork. */
  marker: { x: number; side: "above" | "below" } | { x: number; y: number };
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
  /** Region of the image to show, in % of the full image; markers with an
   * `x`/`y` are placed relative to the full image, not to this region. */
  crop?: { x: number; y: number; w: number; h: number };
  /** Width / height of the full image; needed with `crop`. */
  imageRatio?: number;
  children: ReactNode;
}

export function ImageFlowSelector({ image, alt, crop, imageRatio = 16 / 9, children }: ImageFlowSelectorProps) {
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
      <div className={`image-flow-selector-figure${crop ? " on-image" : ""}`}>
        <div
          className={crop ? "image-flow-selector-crop" : undefined}
          style={crop ? { aspectRatio: `${(crop.w / crop.h) * imageRatio}` } : undefined}
        >
          <img
            src={image}
            alt={alt}
            className="image-flow-selector-image"
            style={
              crop
                ? {
                    position: "absolute",
                    width: `${(100 / crop.w) * 100}%`,
                    height: `${(100 / crop.h) * 100}%`,
                    left: `${(-crop.x / crop.w) * 100}%`,
                    top: `${(-crop.y / crop.h) * 100}%`,
                    maxWidth: "none",
                  }
                : undefined
            }
          />
          {steps.map((step, index) => {
            const m = step.marker;
            const onImage = "y" in m;
            const left = crop && onImage ? ((m.x - crop.x) / crop.w) * 100 : m.x;
            const top = crop && onImage ? ((m.y - crop.y) / crop.h) * 100 : undefined;
            return (
              <button
                key={step.title}
                type="button"
                className={`image-flow-selector-marker ${onImage ? "ring" : m.side}${index === activeIndex ? " active" : ""}`}
                style={{ left: `${left}%`, top: top === undefined ? undefined : `${top}%` }}
                aria-label={`Step ${index + 1} of ${count}: ${step.title}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
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
