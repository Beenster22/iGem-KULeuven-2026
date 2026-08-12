// Purpose: home-page section showing engineered P. vulgatis taking over the
// microbiome and inflammation easing as a result. One slider drives two
// synchronized visuals: a circular "magnifying glass" view into the
// microbiome (bacteria scattered inside, each converting from the generic
// OtherBacteriumIcon to PVulgatisIcon — see BacteriumIcons.tsx — as
// abundance rises) and the BodyDiagram SVG reused from BodySymptomsSection,
// whose organ ids (brain, uterus, pancreas, heart, hair) get a red
// "inflammation" glow that fades via the --inflammation CSS custom property
// (see App.css). Deliberately sits in a "home-section--contrast" band rather
// than the lighter "home-section--body" band — BodyDiagram's own fill
// (#d3bde8) and the engineered colour (--color-accent, #c9bde8) both sit too
// close to --color-body-bg to read against it in light mode (and
// home-section--contrast has its own dark-mode override for the same
// reason — see the note above .home-section--contrast in App.css).
import { useState } from "react";
import { BodyDiagram } from "./BodyDiagram";
import { OtherBacteriumIcon, PVulgatisIcon } from "./BacteriumIcons";

const BACTERIUM_COUNT = 34;

// Deterministic pseudo-random [0,1) per bacterium so the scatter inside the
// lens reads as organic instead of a rigid grid, without real randomness
// (which would reshuffle the layout on every re-render).
function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

interface MicrobiomeLensProps {
  abundance: number; // 0-100
}

// A circular "magnifying glass" view into the microbiome: bacteria scattered
// inside a clipped circle, each rendered as either the generic
// OtherBacteriumIcon or, once abundance passes that bacterium's own
// threshold, PVulgatisIcon (same outline, with the artwork's internal
// segment dots) — the same per-cell threshold-wave approach as the previous
// pill grid, now with real bacterium shapes instead of plain pills.
function MicrobiomeLens({ abundance }: MicrobiomeLensProps) {
  return (
    <div className="microbiome-lens-wrap">
      <div className="microbiome-lens-handle" aria-hidden="true" />
      <div className="microbiome-lens" aria-hidden="true">
        {Array.from({ length: BACTERIUM_COUNT }, (_, i) => {
          const threshold = ((i + 0.5) / BACTERIUM_COUNT) * 100;
          const engineered = abundance >= threshold;
          const angle = seededValue(i * 2 + 1) * Math.PI * 2;
          const radius = 10 + seededValue(i * 2 + 2) * 36; // % from lens center, stays mostly inside the circle
          const left = 50 + Math.cos(angle) * radius;
          const top = 50 + Math.sin(angle) * radius;
          const rotation = Math.round(seededValue(i * 3 + 1) * 360);
          const scale = 0.7 + seededValue(i * 5 + 1) * 0.55;
          const Icon = engineered ? PVulgatisIcon : OtherBacteriumIcon;
          return (
            <Icon
              key={i}
              className={`microbiome-bacterium${engineered ? " microbiome-bacterium--engineered" : ""}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// TODO: wording below is a first-pass illustrative description of the
// mechanism — verify against your actual project data/results before this
// goes on the published wiki.
function levelBlurb(abundance: number) {
  if (abundance < 34) {
    return "Few engineered P. vulgatis are established yet — inflammation markers stay elevated across the body.";
  }
  if (abundance < 67) {
    return "As engineered P. vulgatis takes over the microbiome, inflammation begins to ease.";
  }
  return "With engineered P. vulgatis dominant in the microbiome, inflammation markers have receded across the body.";
}

export function InflammationSliderSection() {
  const [abundance, setAbundance] = useState(50);
  const inflammation = 1 - abundance / 100;

  return (
    <div>
      <h3 className="inflammation-section-heading">Engineered P. vulgatis abundance in the microbiome</h3>
      <div className="inflammation-slider-section">
        <div className="inflammation-slider-track-col">
          <span className="inflammation-slider-tick">High</span>
          <input
            className="inflammation-slider-input inflammation-slider-input--vertical"
            type="range"
            min={0}
            max={100}
            value={abundance}
            onChange={(event) => setAbundance(Number(event.target.value))}
            aria-label="Engineered P. vulgatis abundance in the microbiome"
          />
          <span className="inflammation-slider-tick">Low</span>
        </div>

        <div className="inflammation-slider-panel">
          <h4 className="inflammation-slider-panel-heading">Looking into the microbiome</h4>
          <MicrobiomeLens abundance={abundance} />
        </div>

        <div className="inflammation-slider-panel">
          <h4 className="inflammation-slider-panel-heading">Inflammation across the body</h4>
          <div
            className="inflammation-slider-figure"
            style={{ "--inflammation": inflammation } as React.CSSProperties}
          >
            <BodyDiagram style={{ width: "220px", height: "auto" }} />
          </div>
        </div>
      </div>
      <p className="inflammation-slider-blurb">{levelBlurb(abundance)}</p>
    </div>
  );
}
