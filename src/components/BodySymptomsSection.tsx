// Purpose: home-page section with a fixed layout (text left, figure right)
// from first paint — only the body diagram itself animates, sliding in from
// off-screen once scrolled into view, matching the reveal-on-scroll
// convention PmosOverview already uses elsewhere on this page. The info
// panel stays in place throughout and shows the overview paragraph until the
// visitor clicks a specific organ. Click handling on the diagram uses event
// delegation on the root <svg> (rather than editing every path in the
// generated BodyDiagram markup) and the "selected" highlight is applied
// imperatively via a ref, since BodyDiagram's paths aren't individually
// wired to React state.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BodyDiagram } from "./BodyDiagram";

interface OrganInfo {
  label: string;
  blurb: string;
}

// TODO: the overview paragraph and organ blurbs below are a first-pass draft
// based on general PMOS (formerly PCOS) medical literature — verify
// wording/sources before this goes on the published wiki.
const OVERVIEW_TEXT =
  "PMOS (formerly PCOS) is one of the most common hormonal conditions affecting people with ovaries — but its effects reach far beyond the reproductive system. Disrupted hormone signaling and insulin resistance can touch the brain, heart, pancreas, and skin too.";

const ORGAN_INFO: Record<string, OrganInfo> = {
  brain: {
    label: "Brain",
    blurb:
      "The hypothalamus and pituitary send irregular hormone signals (LH/FSH), disrupting ovulation at the source.",
  },
  uterus: {
    label: "Uterus & Ovaries",
    blurb:
      "Irregular ovulation means the uterine lining isn't shed regularly, which can raise long-term endometrial risk.",
  },
  pancreas: {
    label: "Pancreas",
    blurb:
      "Insulin resistance pushes the pancreas to produce more insulin, which in turn drives higher androgen levels.",
  },
  heart: {
    label: "Heart",
    blurb:
      "Insulin resistance and higher androgens over time raise the risk of high blood pressure and cardiovascular disease.",
  },
  hair: {
    label: "Hair",
    blurb:
      "Excess androgens can thicken facial/body hair growth while thinning hair at the scalp — two effects, one hormonal cause.",
  },
};

const ORGAN_IDS = Object.keys(ORGAN_INFO);
const ORGAN_SELECTOR = ORGAN_IDS.map((id) => `#${id}`).join(", ");

// How long the overview stays on screen before auto-advancing into the
// interactive layout, once the section has scrolled into view.
const OVERVIEW_DURATION_MS = 1800;

export function BodySymptomsSection() {
  // Whether the body diagram has been mounted (and its slide-in animation
  // triggered) yet — the layout around it never changes, only this.
  const [figureVisible, setFigureVisible] = useState(false);
  // No organ pre-selected — the overview text stays in the info panel until
  // the visitor actually picks one.
  const [selected, setSelected] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Waits for the section to actually be on screen (same threshold
  // PmosOverview uses for its count-up) before starting the timer that
  // reveals the figure.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (prefersReducedMotion) {
          setFigureVisible(true);
          return;
        }
        timer = setTimeout(() => setFigureVisible(true), OVERVIEW_DURATION_MS);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const root = figureRef.current;
    if (!root) return;
    ORGAN_IDS.forEach((id) => {
      root.querySelector(`#${id}`)?.classList.toggle("body-organ-selected", id === selected);
    });
    // Re-run once the figure mounts (populating figureRef) too.
  }, [selected, figureVisible]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    // Some organs (brain, uterus) are groups whose child detail paths carry
    // their own auto-generated IDs from the Inkscape export — closest() must
    // target the known organ IDs specifically, not just the nearest [id],
    // otherwise a click on a texture squiggle resolves to that squiggle's id
    // instead of bubbling up to the organ group.
    const target = (event.target as Element).closest(ORGAN_SELECTOR);
    if (target) setSelected(target.id);
  };

  const info = selected ? ORGAN_INFO[selected] : null;

  return (
    <div className="body-symptoms-layout" ref={sectionRef}>
      <div className="body-symptoms-info">
        <h3 className="body-symptoms-info-heading">{info ? info.label : "What is PMOS?"}</h3>
        <p className="body-symptoms-info-blurb">{info ? info.blurb : OVERVIEW_TEXT}</p>
      </div>
      {/* Mounted only once the reveal timer fires — its slide-in animation
          plays on mount, so it must not exist in the DOM yet beforehand. The
          layout itself (this component's own JSX/CSS) doesn't change when it
          appears — only the diagram animates. */}
      {figureVisible && (
        <div className="body-symptoms-figure" ref={figureRef}>
          <BodyDiagram onClick={handleClick} style={{ width: "260px", height: "auto" }} />
        </div>
      )}
    </div>
  );
}
