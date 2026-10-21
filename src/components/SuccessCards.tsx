// Generated with Claude Opus 5 (Anthropic), 2026-10-16
// Restored with Claude Sonnet 5.5 (Anthropic), 2026-10-19, in place of the
// per-pipeline section timeline (team feedback: the timeline duplicated the
// page index rail on the left; these headline cards don't).
//
// Redesigned with Claude Sonnet 5.5 (Anthropic), 2026-10-21 (team's compact
// "Main key takeaways" design): one lavender box with a Toolkit / Therapeutics
// pill switch and, under it, a numbered chip per success.
//
// Stripped back down to just the pill switch with Claude Opus 5.5
// (Anthropic), 2026-10-21 (team feedback: the "Main key takeaways" heading
// and the numbered chips under it were redundant with the page itself).
// What's left is the Toolkit / Therapeutics switch, driven by the pipelines
// ResultsPipelines gives it through PipelineContext.
import { useContext } from "react";
import { PipelineContext } from "./pipelineContext";

export function SuccessCards() {
  const pipelines = useContext(PipelineContext);
  if (!pipelines || pipelines.labels.length < 2) return null;
  const { labels: groups, index: active, choose: setActive } = pipelines;

  return (
    <nav className="success-cards" aria-label="Choose a results pipeline">
      <div
        className="success-cards-tabs"
        role="tablist"
        data-active={active}
        style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
      >
        <span
          className="success-cards-pill"
          aria-hidden="true"
          style={{
            width: `calc(${100 / groups.length}% - ${8 / groups.length}px)`,
            transform: `translateX(${active * 100}%)`,
          }}
        />
        {groups.map((group, index) => (
          <button
            key={group}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
          >
            {group}
          </button>
        ))}
      </div>
    </nav>
  );
}
