// Purpose: home-page section pairing the interactive body diagram with a
// short info panel for whichever organ is currently selected. Click handling
// uses event delegation on the root <svg> (rather than editing every path in
// the generated BodyDiagram markup) and the "selected" highlight is applied
// imperatively via a ref, since BodyDiagram's paths aren't individually
// wired to React state.
import { useEffect, useRef, useState } from "react";
import { BodyDiagram } from "./BodyDiagram";

interface OrganInfo {
  label: string;
  blurb: string;
}

// TODO: short blurbs below are a first-pass draft based on general PMOS
// (formerly PCOS) medical literature — verify wording/sources before this
// goes on the published wiki.
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
const DEFAULT_ORGAN = "uterus";

export function BodySymptomsSection() {
  const [selected, setSelected] = useState(DEFAULT_ORGAN);
  const figureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = figureRef.current;
    if (!root) return;
    ORGAN_IDS.forEach((id) => {
      root.querySelector(`#${id}`)?.classList.toggle("body-organ-selected", id === selected);
    });
  }, [selected]);

  const ORGAN_SELECTOR = ORGAN_IDS.map((id) => `#${id}`).join(", ");

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    // Some organs (brain, uterus) are groups whose child detail paths carry
    // their own auto-generated IDs from the Inkscape export — closest() must
    // target the known organ IDs specifically, not just the nearest [id],
    // otherwise a click on a texture squiggle resolves to that squiggle's id
    // instead of bubbling up to the organ group.
    const target = (event.target as Element).closest(ORGAN_SELECTOR);
    if (target) setSelected(target.id);
  };

  const info = ORGAN_INFO[selected];

  return (
    <div className="body-symptoms-layout">
      <div className="body-symptoms-figure" ref={figureRef}>
        <BodyDiagram onClick={handleClick} style={{ width: "260px", height: "auto" }} />
      </div>
      <div className="body-symptoms-info">
        <h3 className="body-symptoms-info-heading">{info.label}</h3>
        <p className="body-symptoms-info-blurb">{info.blurb}</p>
      </div>
    </div>
  );
}
