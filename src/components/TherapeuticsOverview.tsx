// Generated with Claude Opus 5 (Anthropic), 2026-10-19
// Purpose: the experimental overview of the therapeutics pipeline, on the
// results page (results.mdx, Therapeutics > Introduction). The team's own
// figure, with its five numbered steps turned into buttons: 1-4 open that
// step's write-up in a panel under the figure (the team's text, from
// "Experimental overview of therapeutics.docx"), and 5 — the conjugation
// into P. vulgatus — sends the reader to the Toolkit pipeline's wheel
// instead, opened on its "Conjugation efficiency testing" wedge.
//
// The badge positions below were measured off the artwork itself (the
// centre of each blue circle, as a percentage of the image), so they stay
// on their circles at every size. Re-measure them if the figure is
// re-exported.
import { ReactNode, useEffect, useRef, useState } from "react";
import { TOOLKIT_WHEEL_ID, selectWheelItem } from "./wheelSelect";

const FIGURE_SRC =
  "https://static.igem.wiki/teams/6299/wiki/home-page/therapeutics-section-better.avif";
const FIGURE_WIDTH = 1057;
const FIGURE_HEIGHT = 510;

// The wedge on the Toolkit wheel that step 5 opens. Its <h4> is also what
// the reveal below looks for, so the Toolkit pipeline and its Introduction
// section open first — keep it in step with that wheel's SectionItem label
// in results.mdx.
const CONJUGATION_LABEL = "Conjugation efficiency testing";
const CONJUGATION_SLUG = "conjugation-efficiency-testing";

interface Step {
  n: number;
  /** Centre of the badge, as a percentage of the figure. */
  x: number;
  y: number;
  title: string;
  /** Step 5 has no panel: it sends the reader to the Toolkit wheel. */
  body?: ReactNode;
  goesToToolkit?: boolean;
}

const STEPS: Step[] = [
  {
    n: 1,
    x: 3.56,
    y: 6.19,
    title: "BSH gene selection",
    body: (
      <>
        <h5>Goal</h5>
        <p>
          The therapeutic effect depends on which bile salts the replacement
          hydrolase prefers, so we first needed to know how our BSH genes
          related to one another and to enzymes with confirmed BSH activity.
          That is why we built a phylogenetic tree of the full selection,
          containing <em>Bacteroidota</em>, <em>Bacillota</em> and{" "}
          <em>Actinomycetota</em>. This we did to see if the similarity to a
          known BSH is enough to predict its activity.
        </p>
        <h5>Results</h5>
        <p>
          Our final phylogenetic tree splits the panel into two groups, one
          holding the characterized reference enzyme together with the{" "}
          <em>Actinomycetota</em> and <em>Bacillota</em> sequences, the other
          holding the <em>Bacteroidota</em> sequences. The five{" "}
          <em>Bacteroidota</em> candidates sit far from the characterized
          enzymes that only homology does not determine which reaction they
          catalyze, which is what motivated us to do the docking analysis.
        </p>
      </>
    ),
  },
  {
    n: 2,
    x: 9.75,
    y: 63.54,
    title: "Fitness cost analysis",
    body: (
      <>
        <h5>Goal</h5>
        <p>
          A construct that places a heavy burden on its host is outcompeted or
          lost as soon as selection is removed (San Millan &amp; MacLean,
          2017), which makes it a poor candidate to use in our therapeutics
          pipeline. That is why we wanted to know which of our fifteen BSH
          constructs are costly to carry. By expressing the genes in{" "}
          <em>E. coli</em> DH5α and comparing their colony-forming abilities
          against a sfGFP control, and as they are carried in the same pNBU2
          backbone, the relative burden of each insert could be determined,
          instead of an absolute fitness cost.
        </p>
        <h5>Experimental set-up</h5>
        <p>
          First the countable dilution range had to be determined which we did
          by plating a ten-fold dilution series from a culture at OD600 = 0.5
          for BSH6, and BSH9. Those two gene constructs were chosen as they
          were phylogenetically the most distant. This resulted in the fact
          that 10⁻⁵ was dense but not confluent, and 10⁻⁶ to 10⁻⁷ gave
          separated single colonies.
        </p>
        <p>
          For the assay itself, all 16 constructs (15 BSHs + 1 sfGFP) were
          spotted as drops of OD600 = 0.5-normalized cultures on Omnitray
          plates, and imaged with RESHAPE. From this, colonies were counted
          from the replicate plates, which can be found in FIT-03.
        </p>
        <h5>Results</h5>
        <p>
          Colony numbers differ strongly between constructs at the same
          dilution, although not all data between the two experimental runs
          show the same results. When comparing against sfGFP, BSH1 (0.30×),
          BSH3 (0.50×), and BSH10 (0.56×) show colony numbers below the
          control and have thus the highest metabolic burden. BSH4, BSH5,
          BSH6, and BSH7 are the least burdensome as they show the presence of
          many colonies. Important to note, is that the burden does not follow
          deconjugation efficiency as two genes (BSH1 and BSH3) are active
          hydrolases, so the catalytic burden is not the source of the cost.
          This is consistent with burden being gene-specific (Snoeck et al.,
          2024).
        </p>
      </>
    ),
  },
  {
    n: 3,
    x: 24.0,
    y: 72.05,
    title: "BSH assay",
    body: (
      <>
        <h5>Goal</h5>
        <p>
          We wanted to design the halo assay experiment as a standard plate
          method for detecting bile salt hydrolase (BSH) activity where a
          construct expressing an active BSH deconjugates the bile salt in the
          surrounding agar. As the freed bile acid becomes insoluble and
          precipitates, it produces a visible white halo around the colony. We
          aimed to observe different BSH-expressing <em>E. coli</em> DH5α
          constructs and the diameters of halos they create to assess their
          relative affinities.
        </p>
        <p>
          Additionally, for a more precise and quantitative analysis, the goal
          was to quantify bile salt deconjugation by the BSH constructs
          directly, by LC-MS on liquid cultures, rather than inferring it from
          halos.
        </p>
        <h5>Experimental set-up</h5>
        <p>
          For as the final experiment for halo assay we tested 15 BSH
          constructs (BSH1-BSH15) and an sfGFP control on LB + CaCl₂
          containing GUDCA or TUDCA at 0.5%, 1.0% and 1.5% (w/v), with control
          groups of bacteria and medium with the help of RESHAPE imaging.
          Prior to this, we ran three pilot experiments to compare plate
          pouring methods, determine a suitable working solvent, optimize the
          protocol for GUDCA and TUDCA, and establish appropriate bile salt
          and bacterial concentrations.
        </p>
        <p>
          For the LC-MS experiment, the final experiment includes testing{" "}
          <em>E. coli</em> strains with the 16 different genes (15 BSHs and 1
          sfGFP control) which were grown in our minimal media with GUDCA and
          TUDCA at 0.1% (w/v) separately. After the incubation, samples were
          then centrifuged and proteins were precipitated from the supernatant.
          Finally, the samples were submitted for LC-MS analysis. Prior to this
          we ran 2 pilot experiments to explore the working concentrations for
          bile salts and to establish an LC-MS method. The final experiment was
          done priorly with 0.5% working concentration for TUDCA and GUDCA
          combined, which did not yield clear results.
        </p>
        <h5>Results</h5>
        <p>
          On the halo assay experiment all fifteen strains grew in every GUDCA
          and TUDCA plate, however, no halo formation around the colonies were
          seen, as they showed the same visual result as the sfGFP control.
        </p>
        <p>
          In the final and main LC-MS data, we have seen that the constructs
          separated cleanly and differently on the two substrates. On GUDCA,
          five constructs stood out: BSH1 (≈100%), BSH3 (≈99%), BSH15 (≈98%),
          BSH5 (≈97%) and BSH6 (≈96%), BSH14 (≈15%) and BSH7 (≈11%). On TUDCA
          only BSH1 (≈82%), BSH3 (≈68%), BSH15 (≈42%) and BSH11 (≈21%) convert
          appreciably.
        </p>
      </>
    ),
  },
  {
    n: 4,
    x: 50.05,
    y: 15.03,
    title: "CRISPR construct design",
    body: (
      <>
        <h5>Goal</h5>
        <p>
          In our therapeutics pipeline we want to replace a native bile salt
          hydrolase (BSH) of a patient’s own <em>P. vulgatus</em> isolate with
          a BSH homolog of different substrate preference. This means that the
          bile salts with the strongest TGR5 affinity are kept. This is why we
          designed a CRISPR-Cas9 system which can cut the native{" "}
          <em>bsh</em> gene, and supplies the replacement gene as a repair
          template. Our CRISPR approach let us choose the integration site and
          does not leave a backbone after curing.
        </p>
        <h5>Results</h5>
        <p>
          Our design is an at component-level construct, that (keep in mind)
          has not yet been built or tested in-lab. Successful integration of
          our gene of interest would be confirmed by PCR with primers outside
          the homologous arms. Cas9 expression can be checked by qRT-PCR as an
          early control. Bile salt assays would then be used to compare the
          wildtype and the edited strains. Some parts are still to be
          determined by upcoming data like for example the choice of BSH
          variant which follows from the BSH assay with a more broad range of
          bile salts. Also the efficiency of the gRNA spacers need to be
          tested which is done best by testing multiple spacer sequences.
        </p>
        <p>
          Beside the fact that this is all theoretical, future research would
          determine the efficiency of our system.
        </p>
      </>
    ),
  },
  {
    n: 5,
    x: 77.21,
    y: 58.36,
    title: "Conjugation into P. vulgatus",
    goesToToolkit: true,
  },
];

export function TherapeuticsOverview() {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const justOpened = useRef(false);

  // Brings a freshly opened panel into view, but leaves the page alone when
  // one is merely swapped for another or folded away.
  useEffect(() => {
    if (!justOpened.current) return;
    justOpened.current = false;
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [openStep]);

  const open = (step: Step) => {
    if (step.goesToToolkit) {
      // The Toolkit wheel's own <h4> for this wedge is a heading only the
      // Toolkit pipeline has, so this opens that pipeline and its
      // Introduction section (see ResultsPipelines' `reveal`).
      window.dispatchEvent(
        new CustomEvent("reveal-section", { detail: CONJUGATION_SLUG }),
      );
      // The wheel mounts with that switch, so it may not be on the page yet;
      // the request waits for it either way (see wheelSelect.ts).
      selectWheelItem({ wheel: TOOLKIT_WHEEL_ID, label: CONJUGATION_LABEL });
      // Scroll to it once it is there.
      let tries = 0;
      const scrollToWheel = () => {
        const wheel = document.querySelector(`[data-wheel="${TOOLKIT_WHEEL_ID}"]`);
        if (wheel) {
          wheel.scrollIntoView({ block: "center", behavior: "smooth" });
        } else if (tries++ < 10) {
          requestAnimationFrame(scrollToWheel);
        }
      };
      requestAnimationFrame(scrollToWheel);
      return;
    }
    justOpened.current = openStep !== step.n;
    setOpenStep((current) => (current === step.n ? null : step.n));
  };

  const active = STEPS.find((step) => step.n === openStep);

  return (
    <div className="therapeutics-overview">
      <div className="therapeutics-overview-figure">
        <img
          src={FIGURE_SRC}
          alt="Experimental overview of the therapeutics pipeline, in five numbered steps."
          width={FIGURE_WIDTH}
          height={FIGURE_HEIGHT}
        />
        {STEPS.map((step) => (
          <button
            key={step.n}
            type="button"
            className={`therapeutics-overview-badge${
              openStep === step.n ? " is-open" : ""
            }${step.goesToToolkit ? " therapeutics-overview-badge--link" : ""}`}
            style={{ left: `${step.x}%`, top: `${step.y}%` }}
            aria-expanded={step.goesToToolkit ? undefined : openStep === step.n}
            onClick={() => open(step)}
          >
            <span aria-hidden="true">{step.n}</span>
            <span className="visually-hidden">
              {step.goesToToolkit
                ? `${step.title} — see the Toolkit pipeline`
                : step.title}
            </span>
          </button>
        ))}
      </div>

      {active?.body && (
        <div className="therapeutics-overview-panel" ref={panelRef}>
          <h4 data-toc-ignore="true">
            <span className="therapeutics-overview-panel-number" aria-hidden="true">
              {active.n}
            </span>
            {active.title}
          </h4>
          {active.body}
        </div>
      )}
    </div>
  );
}
