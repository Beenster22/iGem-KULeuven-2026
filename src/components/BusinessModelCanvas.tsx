// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-16
// Purpose: EMPOWER's business model canvas as live page content rather than
// a picture. Every block lightens/darkens and lifts on hover or keyboard
// focus, and hovering a legend entry lights up all blocks of that colour
// group. Used on the Entrepreneurship page (3.1 Business model canvas).
import { useState } from "react";

type Group = "product" | "partners" | "customers";

interface Block {
  id: string;
  title: string;
  group: Group;
  area: string;
  lead?: string;
  items: { text: string; bold?: boolean }[];
}

const BLOCKS: Block[] = [
  {
    id: "partners",
    title: "Key Partners",
    group: "partners",
    area: "partners",
    items: [
      { text: "KU Leuven LRD: patent, spin-out, licence route" },
      { text: "Academic CROs (preclinical studies)" },
      { text: "GMP manufacturer" },
      { text: "Clinical trial CRO" },
      { text: "University hospital for Phase I" },
      { text: "Investors and funders" },
      { text: "Potential licensing partners", bold: true },
    ],
  },
  {
    id: "activities",
    title: "Key Activities",
    group: "product",
    area: "activities",
    items: [
      { text: "Strain engineering and genetic toolkit" },
      { text: "Preclinical safety and mechanism studies" },
      { text: "Leading the Phase I trial" },
      { text: "Regulatory advice and IP filing" },
      { text: "Licensing negotiations" },
    ],
  },
  {
    id: "resources",
    title: "Key Resources",
    group: "product",
    area: "resources",
    items: [
      { text: "Microbiome therapeutic platform: engineered strain and genetic toolkit" },
      { text: "Future IP portfolio" },
      { text: "Multidisciplinary team and network of expert advisors" },
    ],
  },
  {
    id: "value",
    title: "Value Propositions",
    group: "product",
    area: "value",
    items: [
      { text: "Addresses multiple dimensions of PMOS through a single upstream mechanism" },
      { text: "Highly differentiated therapeutic opportunity in an underserved women's health market" },
      { text: "Novel microbiome-based platform with expansion opportunities beyond PMOS" },
    ],
  },
  {
    id: "relationships",
    title: "Customer Relationships",
    group: "customers",
    area: "relationships",
    items: [
      { text: "Licensees: partnering discussions, then a licence with development milestones" },
      {
        text: "Key opinion leaders and patient stakeholders engaged through co-creation and validation activities",
      },
    ],
  },
  {
    id: "channels",
    title: "Channels",
    group: "customers",
    area: "channels",
    items: [
      { text: "Direct partnering discussions" },
      { text: "Conferences and partnering events" },
      { text: "KU Leuven LRD network" },
      { text: "Scientific publications and clinical data" },
    ],
  },
  {
    id: "segments",
    title: "Customer Segments",
    group: "customers",
    area: "segments",
    items: [
      { text: "Pharmaceutical companies active in women's health" },
      { text: "Biotech companies seeking women's health assets" },
      { text: "End beneficiaries: women with PMOS", bold: true },
    ],
  },
  {
    id: "costs",
    title: "Cost Structure",
    group: "partners",
    area: "costs",
    items: [
      { text: "Preclinical development and GMP manufacturing" },
      { text: "Phase I clinical trial" },
      { text: "Regulatory activities and IP protection" },
      { text: "Later-stage costs are carried by the licensee" },
    ],
  },
  {
    id: "revenue",
    title: "Revenue Streams",
    group: "customers",
    area: "revenue",
    items: [
      { text: "Upfront licensing payment" },
      { text: "Development milestone payments" },
      { text: "Regulatory milestone payments" },
      { text: "Sales royalties" },
      { text: "First revenue expected upon licensing after successful Phase I completion", bold: true },
    ],
  },
];

const LEGEND: { group: Group; label: string }[] = [
  { group: "product", label: "Product and development" },
  { group: "partners", label: "Partners and costs" },
  { group: "customers", label: "Customers and revenue" },
];

const ADVANTAGES = [
  "Novel indication-mechanism combination",
  "First-mover advantage in PMOS microbiome therapeutics",
  "Synthetic biology platform with expansion potential",
];

export function BusinessModelCanvas() {
  const [highlight, setHighlight] = useState<Group | null>(null);

  return (
    <div className="bmc">
      <p className="bmc-subtitle">
        Out-licensing model: we develop EMPOWER through Phase I, then license it to a partner
      </p>

      <div className="bmc-grid">
        {BLOCKS.map((block) => (
          <section
            key={block.id}
            className={`bmc-block bmc-${block.group}${highlight === block.group ? " bmc-lit" : ""}`}
            style={{ gridArea: block.area }}
            tabIndex={0}
          >
            <h4 className="bmc-title">{block.title}</h4>
            {block.lead && <p className="bmc-lead">{block.lead}</p>}
            <ul>
              {block.items.map((item) => (
                <li key={item.text} className={item.bold ? "bmc-bold" : undefined}>
                  {item.text}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="bmc-block bmc-advantage" style={{ gridArea: "advantage" }} tabIndex={0}>
          <h4 className="bmc-title">Competitive advantage</h4>
          <ul>
            {ADVANTAGES.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      </div>

      <p className="bmc-note">
        Development until licensing is financed by grants and equity funding, not by revenue (see{" "}
        <a href="#3-4-financial-strategy">Financial strategy</a>).
      </p>

      <div className="bmc-legend">
        {LEGEND.map(({ group, label }) => (
          <span
            key={group}
            className="bmc-legend-item"
            tabIndex={0}
            onMouseEnter={() => setHighlight(group)}
            onMouseLeave={() => setHighlight(null)}
            onFocus={() => setHighlight(group)}
            onBlur={() => setHighlight(null)}
          >
            <span className={`bmc-swatch bmc-${group}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
