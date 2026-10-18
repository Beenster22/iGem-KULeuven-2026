// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
// Purpose: the EMPOWER value chain figure (Entrepreneurship page, 2.5) as live
// page content, redrawn from the team's updated figure: phases, the schematic
// product life cycle with the hand-over after Phase I, the six stages, what
// happens in each (dot = who leads) and the LBP-specific points (Rouanet et
// al., 2020). The wording is the figure's own. Under ~860px it scrolls
// sideways rather than squeezing the columns.
import type { ReactNode } from "react";

type Lead = "empower" | "partners" | "licensee";

const STAGES: {
  title: string;
  details: { lead: Lead; text: ReactNode }[];
  lbp: ReactNode;
}[] = [
  {
    title: "Drug discovery",
    details: [
      { lead: "empower", text: "Disease research: gut microbiome and bile-acid signalling in PMOS" },
      { lead: "empower", text: "Strain selection: screen for BSH-active strains" },
      { lead: "empower", text: <>Genetic toolkit for <em>P. vulgatus</em></> },
      { lead: "empower", text: "Patent application" },
    ],
    lbp: "Strain identified and characterised; genome screened for resistance and virulence genes.",
  },
  {
    title: "Clinical trials",
    details: [
      { lead: "partners", text: "Preclinical: gut simulators, human cells, mice" },
      { lead: "partners", text: "Phase I: safety in PMOS patients" },
      { lead: "licensee", text: "Phase II/III: efficacy" },
    ],
    lbp: "Safety is strain-specific (resistance, virulence, translocation). Gut simulators complement animal models. Trial in patients, not healthy volunteers.",
  },
  {
    title: "Regulatory",
    details: [
      { lead: "empower", text: "Regulatory advice (FDA, EMA)" },
      { lead: "partners", text: "Trial approval (IND/CTA), incl. GMO biosafety" },
      { lead: "licensee", text: "Registration: marketing authorisation (US, EU)" },
    ],
    lbp: "No fully harmonised pathway: FDA guidance in the US, a Ph. Eur. monograph in the EU. Early regulatory advice is recommended. GMO biosafety review.",
  },
  {
    title: "Manufacturing",
    details: [
      { lead: "partners", text: "GMP trial batch" },
      { lead: "licensee", text: "Large-scale GMP production (CDMO)" },
    ],
    lbp: "The process itself is a risk source (media, contaminants). Criteria for identity, purity and potency.",
  },
  {
    title: "Commercialization",
    details: [
      { lead: "empower", text: "Out-licensing to an established company" },
      { lead: "licensee", text: "Sales and marketing" },
      { lead: "licensee", text: "Reimbursement and distribution" },
    ],
    lbp: "Licensee-led. No LBP-specific point.",
  },
  {
    title: "Monitoring",
    details: [
      { lead: "licensee", text: "Post-marketing surveillance" },
      { lead: "licensee", text: "Side-effect monitoring" },
    ],
    lbp: "Strain traceability supports post-market analysis. Patient samples can be biobanked for long-term follow-up.",
  },
];

const LEGEND: { lead: Lead; label: string }[] = [
  { lead: "empower", label: "EMPOWER" },
  { lead: "partners", label: "EMPOWER with partners" },
  { lead: "licensee", label: "Licensee" },
];

// The schematic life cycle, drawn in a 1675 x 300 box that spans the six stage
// columns. Points are the labelled stages of the curve.
function LifeCycle() {
  return (
    <svg className="vcf-cycle" viewBox="0 0 1675 300" role="img" aria-label="Schematic product life cycle: discovery today, hand-over after Phase I, then launch, growth, maturity and decline">
      <rect className="vcf-cycle-bg" width="1675" height="300" />

      <g className="vcf-cycle-axis">
        <line x1="5" y1="20" x2="722" y2="20" />
        <line x1="840" y1="20" x2="960" y2="20" />
        <line x1="968" y1="20" x2="1165" y2="20" />
        <line x1="1252" y1="20" x2="1448" y2="20" />
        <line x1="1457" y1="20" x2="1510" y2="20" />
        <line x1="1596" y1="20" x2="1670" y2="20" />
      </g>
      <g className="vcf-cycle-era">
        <text x="482" y="28">Early</text>
        <text x="1208" y="28">Middle</text>
        <text x="1565" y="28">Late</text>
      </g>

      <line className="vcf-cycle-base" x1="12" y1="180" x2="1660" y2="180" />
      <line className="vcf-cycle-handover" x1="497" y1="40" x2="497" y2="290" />
      <rect className="vcf-cycle-pill" x="506" y="52" width="214" height="32" rx="7" />
      <text className="vcf-cycle-pill-text" x="613" y="74">Hand-over after Phase I</text>
      <line className="vcf-cycle-loss" x1="1493" y1="28" x2="1493" y2="290" />

      <path
        className="vcf-cycle-curve"
        d="M138 167 C250 190 380 232 501 232 C700 232 900 225 1000 205 C1080 190 1090 160 1143 131 C1220 100 1280 85 1339 77 C1380 72 1420 68 1452 68 C1500 68 1530 90 1562 109 C1600 125 1630 132 1663 136"
      />
      <line className="vcf-cycle-pointer" x1="140" y1="170" x2="175" y2="243" />

      <circle className="vcf-cycle-today" cx="138" cy="167" r="13" />
      <circle className="vcf-cycle-dot" cx="501" cy="232" r="5.5" />
      <circle className="vcf-cycle-dot" cx="1143" cy="131" r="5.5" />
      <circle className="vcf-cycle-dot" cx="1339" cy="77" r="5.5" />
      <circle className="vcf-cycle-dot" cx="1452" cy="68" r="5.5" />
      <circle className="vcf-cycle-dot" cx="1562" cy="109" r="5.5" />

      <g className="vcf-cycle-labels">
        <text x="138" y="146" textAnchor="middle">Discovery</text>
        <text x="581" y="264" textAnchor="middle">Preclinical / clinical</text>
        <text x="1112" y="110" textAnchor="middle">Launch</text>
        <text x="1309" y="56" textAnchor="middle">Growth</text>
        <text x="1454" y="44" textAnchor="middle">Maturity</text>
        <text x="1599" y="90" textAnchor="middle">Decline</text>
        <text x="1501" y="250">Loss of market</text>
        <text x="1501" y="274">exclusivity</text>
      </g>
      <text className="vcf-cycle-today-label" x="159" y="266">EMPOWER today</text>
    </svg>
  );
}

export function ValueChainFigure() {
  return (
    <div className="vcf-scroll">
      <div className="vcf">
        <div className="vcf-side vcf-side--plain" style={{ gridRow: 1 }}>
          Phase
        </div>
        <div className="vcf-phase vcf-phase--rd">Drug discovery and R&amp;D</div>
        <div className="vcf-phase vcf-phase--cm">Commercialization and monitoring</div>

        <div className="vcf-side vcf-side--plain" style={{ gridRow: 2 }}>
          Product life cycle <span>(schematic)</span>
        </div>
        <div className="vcf-cycle-wrap">
          <LifeCycle />
        </div>

        <div className="vcf-side vcf-side--plain" style={{ gridRow: 3 }}>
          Stage
        </div>
        {STAGES.map((stage, i) => (
          <div
            key={stage.title}
            className="vcf-chevron"
            style={{ gridRow: 3, gridColumn: i + 2 }}
          >
            <span>{i + 1}</span> {stage.title}
          </div>
        ))}

        <div className="vcf-side vcf-side--dark" style={{ gridRow: 4 }}>
          <strong>Details</strong>
          <span>Dot = who leads</span>
        </div>
        {STAGES.map((stage, i) => (
          <ul
            key={stage.title}
            className="vcf-card vcf-card--list"
            style={{ gridRow: 4, gridColumn: i + 2 }}
          >
            {stage.details.map((detail, j) => (
              <li key={j}>
                <i className={`vcf-dot vcf-dot--${detail.lead}`} aria-hidden="true" />
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        ))}

        <div className="vcf-side vcf-side--dark" style={{ gridRow: 5 }}>
          <strong>LBP-specific points</strong>
          <span>Rouanet et al. (2020)</span>
        </div>
        {STAGES.map((stage, i) => (
          <p
            key={stage.title}
            className="vcf-card vcf-card--text"
            style={{ gridRow: 5, gridColumn: i + 2 }}
          >
            {stage.lbp}
          </p>
        ))}
      </div>

      <div className="vcf-legend">
        {LEGEND.map((item) => (
          <span key={item.lead}>
            <i className={`vcf-dot vcf-dot--${item.lead}`} aria-hidden="true" /> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
