// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-16
// Purpose: EMPOWER's interactive roadmap (2026 to 2033) for the
// Entrepreneurship page (3.2 Roadmap). Ported from the team's standalone
// "EMPOWER_Roadmap_wiki_embed.html" widget, which isolated itself in a
// Shadow DOM and built its markup with innerHTML; here it is a regular React
// component with rm-prefixed classes (see "ROADMAP" in App.css) instead.
// A Gantt-style swimlane timeline with a detail card that follows the
// selection; on narrow containers it turns into a stacked list.
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Kind = "inhouse" | "partner" | "licensed" | "funding";
type Filter = "all" | Kind;

interface Row {
  name: string;
  icon: keyof typeof ICONS;
  group: "in" | "pa" | "li";
}

interface Item {
  id: string;
  row: number;
  kind: Kind;
  start: number;
  end?: number;
  milestone?: boolean;
  alignEnd?: boolean;
  label: string;
  title: string;
  when: string;
  what: ReactNode;
  who: ReactNode;
  why: ReactNode;
  wiki?: ReactNode;
}

const section = (id: string, text: string) => <a href={`#${id}`}>{text}</a>;
const TEAM = section("2-2-team-and-skills", "Our team.");
const IP = section("2-7-ip-and-commercialisation-strategy", "IP and commercialisation strategy.");
const FINANCE = section("3-4-financial-strategy", "Financial strategy.");
const TO_DISCUSS_MILICA = "Still to be discussed with Milica.";

const ICONS = {
  flask: (
    <>
      <path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5-10V3" />
      <path d="M7.6 15h8.8" />
    </>
  ),
  document: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  petri: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9.5" cy="10" r="1.2" />
      <circle cx="14.5" cy="11.5" r="1.6" />
      <circle cx="11" cy="15" r="1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" />
      <path d="M9 12l2.2 2.2L15 10" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V11l6 4v-4l6 4V5h4v16z" />
      <path d="M7 18h2M12 18h2" />
    </>
  ),
  cross: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 7.5v9M7.5 12h9" />
    </>
  ),
  link: (
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const X0 = 2026;
const X1 = 2034;
const YEARS = Array.from({ length: X1 - X0 }, (_, i) => X0 + i);

const ROWS: Row[] = [
  { name: "Research and development", icon: "flask", group: "in" },
  { name: "IP and spin-out", icon: "document", group: "pa" },
  { name: "Preclinical studies", icon: "petri", group: "pa" },
  { name: "Regulatory", icon: "shield", group: "pa" },
  { name: "Manufacturing", icon: "factory", group: "pa" },
  { name: "Clinical trial", icon: "cross", group: "pa" },
  { name: "Licensing", icon: "link", group: "li" },
  { name: "Funding", icon: "coins", group: "li" },
];

const KINDS: Record<Kind, string> = {
  inhouse: "In-house",
  partner: "Partner needed, we lead",
  licensed: "Licensed out",
  funding: "Funding round",
};

const CHIPS: { filter: Filter; label: string }[] = [
  { filter: "all", label: "Everything" },
  { filter: "inhouse", label: "In-house" },
  { filter: "partner", label: "Partner needed, we lead" },
  { filter: "licensed", label: "Licensed out" },
  { filter: "funding", label: "Funding rounds" },
];

const ITEMS: Item[] = [
  {
    id: "rd",
    row: 0,
    kind: "inhouse",
    start: 2026.3,
    end: 2028.0,
    label: "Toolkit",
    title: "Toolkit and BSH silencing",
    when: "2026 to end of 2027",
    what: "? Discuss with wetlab what to put in here.",
    who: "Our KU Leuven iGEM team, in the lab of Professor Vitor Bernardes Pinheiro.",
    why: "Still to be discussed with wetlab.",
    wiki: <Link to="/results">Results page.</Link>,
  },
  {
    id: "jam",
    row: 0,
    milestone: true,
    kind: "inhouse",
    start: 2026.87,
    label: "Jamboree",
    title: "Jamboree",
    when: "12 to 17 November 2026",
    what: "We present the project and its business case to the iGEM judges.",
    who: TEAM,
    why: "What we publish decides what stays patentable, so we do not disclose the BSH sequences we work with.",
    wiki: IP,
  },
  {
    id: "opt",
    row: 0,
    kind: "partner",
    start: 2028.0,
    end: 2029.3,
    label: "Strain optimisation",
    title: "Strain optimisation",
    when: "2028 to 2029",
    what: TO_DISCUSS_MILICA,
    who: "Our spin-out, with a research partner.",
    why: TO_DISCUSS_MILICA,
    wiki: TO_DISCUSS_MILICA,
  },
  {
    id: "ip",
    row: 1,
    kind: "partner",
    start: 2027.0,
    end: 2028.0,
    label: "Patent, spin-out",
    title: "Patent filing and spin-out",
    when: "2027",
    what: "Still for discussion with Milica.",
    who: "Still in discussion with Milica.",
    why: "A licensee pays for what is protected at the time of the deal. Until filing, we do not publish the details that make the invention patentable.",
    wiki: IP,
  },
  {
    id: "preclin",
    row: 2,
    kind: "partner",
    start: 2027.0,
    end: 2031.3,
    label: "Preclinical studies",
    title: "Preclinical studies",
    when: "From 2027 until the start of Phase I",
    what: "A broad programme of preclinical studies that continues until the first-in-human trial starts. The exact studies are still to be defined.",
    who: "Our team and spin-out, with laboratory and research partners.",
    why: "This is the preclinical package that regulators expect before a first-in-human trial.",
  },
  {
    id: "ema",
    row: 3,
    kind: "partner",
    start: 2027.2,
    end: 2028.7,
    label: "EMA and FDA advice",
    title: "EMA and FDA Scientific Advice",
    when: "Requested in 2027",
    what: "We ask the EMA and the FDA which preclinical package is enough, whether a first trial directly in PMOS patients is acceptable, and how an engineered strain is classified. We also meet the Belgian medicines agency and the GMO biosafety authority.",
    who: "Our spin-out and the regulators (EMA and FDA).",
    why: "The regulatory pathway for live biotherapeutics is still new. Early advice avoids building the wrong dossier.",
    wiki: "Regulatory strategy.",
  },
  {
    id: "adv",
    row: 3,
    milestone: true,
    kind: "partner",
    start: 2028.75,
    label: "Advice received",
    title: "Scientific advice received",
    when: "Around the end of 2028",
    what: "The EMA and the FDA answer our questions on the preclinical package and the trial design.",
    who: "EMA and FDA.",
    why: "The answers fix what we have to deliver before the trial applications.",
    wiki: "Regulatory strategy.",
  },
  {
    id: "cta",
    row: 3,
    milestone: true,
    kind: "partner",
    start: 2030.95,
    label: "IND and trial application",
    title: "IND and trial application",
    when: "End of 2030",
    what: "We submit the Investigational New Drug (IND) application to the FDA and the Investigational Medicinal Product Dossier (IMPD) with the clinical trial application in the EU, together with the biosafety notification for a genetically modified strain.",
    who: "Our spin-out.",
    why: "No human is dosed before the applications are approved.",
    wiki: section("2-6-regulatory-strategy", "Regulatory strategy."),
  },
  {
    id: "gmp",
    row: 4,
    kind: "partner",
    start: 2030.0,
    end: 2031.0,
    label: "GMP batch",
    title: "GMP trial batch",
    when: "2030",
    what: "A GMP manufacturer produces the trial batch of the live anaerobic strain.",
    who: "A GMP manufacturer.",
    why: "Live anaerobic microorganisms need specialised facilities and strict quality control. Manufacturing is also a major source of risk.",
    wiki: (
      <>
        {section("2-5-value-chain-analysis", "Value chain analysis")} and{" "}
        {section("3-3-risks-and-mitigation", "Risks and mitigation")}.
      </>
    ),
  },
  {
    id: "fp",
    row: 5,
    milestone: true,
    kind: "partner",
    start: 2031.3,
    label: "First patient",
    title: "First patient dosed",
    when: "2031",
    what: "The first person receives EMPOWER.",
    who: "The clinical site.",
    why: "This is the first time the product meets a person, and the start of our human safety data.",
    wiki: "Value chain analysis.",
  },
  {
    id: "p1",
    row: 5,
    kind: "partner",
    start: 2031.38,
    end: 2033.0,
    label: "Phase I",
    title: "Phase I clinical trial",
    when: "2031 to end of 2032",
    what: "A first-in-human safety trial in PMOS patients, with sequential enrolment, dose escalation, an independent safety committee and defined stopping rules. We add exploratory bile acid and CRP blood readouts.",
    who: "Our spin-out as sponsor, a hospital clinical site (UZ Leuven Fertility Centre and UZ Brussel PCOS clinic are our preferred options), a trial CRO.",
    why: "The human safety data are the main asset for licensing talks.",
    wiki: section("2-5-value-chain-analysis", "Value chain analysis."),
  },
  {
    id: "lic",
    row: 6,
    kind: "licensed",
    start: 2032.0,
    end: 2033.9,
    label: "Licensing talks",
    title: "Licensing talks",
    when: "During Phase I until end of 2033",
    what: "We start talks with potential partners during Phase I, with the safety data as the main asset. A licensee then takes over Phase II/III, scale-up, marketing authorisation and distribution.",
    who: "Our spin-out, KU Leuven LRD and potential licensing partners.",
    why: "These steps cost far more than a spin-out can fund. The deal brings upfront, milestone and royalty payments.",
    wiki: "Commercialisation and Financial strategy.",
  },
  {
    id: "deal",
    row: 6,
    milestone: true,
    alignEnd: true,
    kind: "licensed",
    start: 2033.95,
    label: "Deal",
    title: "Licensing deal",
    when: "Target: end of 2033",
    what: "We sign a licence with a partner that carries EMPOWER to patients.",
    who: "Our spin-out and the licensee.",
    why: "The exact timing depends on scientific, regulatory and funding milestones.",
    wiki: "Financial strategy and Risks and mitigation.",
  },
  {
    id: "pre",
    row: 7,
    milestone: true,
    kind: "funding",
    start: 2027.7,
    label: "Pre-seed",
    title: "Pre-seed funding",
    when: "2027",
    what: "Early funding for the spin-out and the first preclinical work. We combine non-dilutive grants with early investors.",
    who: "Grant bodies and early-stage investors.",
    why: "It makes founding the spin-out and starting the first preclinical work possible, while keeping early dilution low by not relying on equity alone.",
    wiki: FINANCE,
  },
  {
    id: "seed",
    row: 7,
    milestone: true,
    kind: "funding",
    start: 2029.3,
    label: "Seed",
    title: "Seed round",
    when: "Closes in 2029",
    what: "Funding for preclinical development and for preparing manufacturing and the regulatory dossiers.",
    who: "Life-science investors and strategic partners.",
    why: "The preclinical package is the first big cost block.",
    wiki: FINANCE,
  },
  {
    id: "sa",
    row: 7,
    milestone: true,
    kind: "funding",
    start: 2031.1,
    label: "Series A",
    title: "Series A",
    when: "Indicative timing, around 2031",
    what: "Funding that carries EMPOWER into clinical development. The amounts are not estimated in our financial strategy.",
    who: "Life-science venture capital and strategic partners.",
    why: "Phase I and GMP manufacturing are among our largest costs.",
    wiki: FINANCE,
  },
];

const ORDER = [...ITEMS].sort((a, b) => a.start - b.start || a.row - b.row);

const pct = (x: number) => ((x - X0) / (X1 - X0)) * 100;
const kindColor = (kind: Kind) => ({ "--bc": `var(--rm-${kind})` }) as CSSProperties;

function DetailFields({ item }: { item: Item }) {
  return (
    <>
      <div>
        <h5>What happens</h5>
        <p>{item.what}</p>
      </div>
      <div>
        <h5>Who</h5>
        <p>{item.who}</p>
      </div>
      <div>
        <h5>Why it matters</h5>
        <p>{item.why}</p>
      </div>
      {item.wiki && (
        <div>
          <h5>More on the wiki</h5>
          <p>{item.wiki}</p>
        </div>
      )}
    </>
  );
}

export function Roadmap() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState("rd");

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear() + (now.getMonth() + now.getDate() / 31) / 12;
    return year >= X0 && year <= X1 ? year : null;
  }, []);

  const current = ITEMS.find((item) => item.id === selected);
  const index = current ? ORDER.indexOf(current) : -1;

  return (
    <div className="roadmap">
      <p className="rm-sub">
        From the Jamboree to a licensing deal.
        <br />
        <em>Select a step to see who carries it out, what happens, and why it matters.</em>
      </p>

      <div className="rm-chips" role="group" aria-label="Filter by who leads the step">
        {CHIPS.map((chip) => (
          <button
            key={chip.filter}
            type="button"
            className="rm-chip"
            style={chip.filter !== "all" ? ({ "--c": `var(--rm-${chip.filter})` } as CSSProperties) : undefined}
            aria-pressed={filter === chip.filter}
            onClick={() => setFilter(chip.filter)}
          >
            {chip.filter !== "all" && <i />}
            {chip.label}
          </button>
        ))}
      </div>

      <section className="rm-tl" aria-label="Roadmap timeline">
        <div className="rm-yrs">
          <div />
          <div className="rm-track">
            {YEARS.map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>

        <div className="rm-rows">
          {ROWS.map((row, rowIndex) => (
            <div key={row.name} className={`rm-row rm-g-${row.group}`}>
              <div className="rm-lab">
                <Icon name={row.icon} />
                <span>{row.name}</span>
              </div>
              <div className="rm-track">
                {ITEMS.filter((item) => item.row === rowIndex).map((item) => {
                  const dim = filter !== "all" && item.kind !== filter;
                  const sel = item.id === selected;
                  const common = {
                    type: "button" as const,
                    "aria-label": `${item.title}, ${item.when}`,
                    title: `${item.title} (${item.when})`,
                    onClick: () => setSelected(item.id),
                  };
                  if (item.milestone) {
                    return (
                      <button
                        key={item.id}
                        {...common}
                        className={`rm-ms rm-k-${item.kind}${item.alignEnd ? " rm-end" : ""}${dim ? " rm-dim" : ""}${sel ? " rm-sel" : ""}`}
                        style={{ left: `${pct(item.start)}%` }}
                      >
                        <span className="rm-dia" />
                        <span className="rm-t">{item.label}</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      {...common}
                      className={`rm-bar rm-k-${item.kind}${item.id === "rd" ? " rm-right" : ""}${dim ? " rm-dim" : ""}${sel ? " rm-sel" : ""}`}
                      style={{ left: `${pct(item.start)}%`, width: `${pct(item.end ?? item.start) - pct(item.start)}%` }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {today !== null && (
            <div className="rm-ov" aria-hidden="true">
              <div className="rm-today" style={{ left: `${pct(today)}%` }}>
                <b>Today</b>
              </div>
            </div>
          )}
        </div>

        <div className="rm-tl-foot">
          <span>
            <i className="rm-d" />
            Milestone
          </span>
          <span>
            <i className="rm-c" />
            Funding round
          </span>
          <span>Phase II/III and later steps are run by the licensee after 2033.</span>
        </div>
      </section>

      {current && (
        <section className="rm-detail" style={kindColor(current.kind)} aria-live="polite">
          <div className="rm-dhead">
            <h4>{current.title}</h4>
            <span className="rm-tag" style={kindColor(current.kind)}>
              {KINDS[current.kind]}
            </span>
            <span className="rm-when">{current.when}</span>
          </div>
          <div className="rm-dgrid">
            <DetailFields item={current} />
          </div>
          <div className="rm-nav">
            <button type="button" disabled={index === 0} onClick={() => setSelected(ORDER[index - 1].id)}>
              Previous step
            </button>
            <button
              type="button"
              disabled={index === ORDER.length - 1}
              onClick={() => setSelected(ORDER[index + 1].id)}
            >
              Next step
            </button>
            <span className="rm-pos">
              Step {index + 1} of {ORDER.length}
            </span>
          </div>
        </section>
      )}

      <div className="rm-list">
        {ORDER.filter((item) => filter === "all" || item.kind === filter).map((item) => {
          const open = selected === item.id;
          return (
            <div key={item.id} className="rm-li" style={kindColor(item.kind)}>
              <button
                type="button"
                className="rm-li-head"
                aria-expanded={open}
                onClick={() => setSelected(open ? "" : item.id)}
              >
                <span className="rm-tag" style={kindColor(item.kind)}>
                  {KINDS[item.kind]}
                </span>
                <b>{item.title}</b>
                <span>
                  {item.when} · {ROWS[item.row].name}
                </span>
              </button>
              {open && (
                <div className="rm-li-body">
                  <DetailFields item={item} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="rm-foot">
        Dates are targets and depend on funding, scientific results and regulatory feedback. Timing of the
        Series A is indicative. Details come from our{" "}
        {section("2-5-value-chain-analysis", "value chain")},{" "}
        {section("2-6-regulatory-strategy", "regulatory")},{" "}
        {section("2-7-ip-and-commercialisation-strategy", "IP")} and{" "}
        {section("3-4-financial-strategy", "financial strategy")} pages.
      </p>
    </div>
  );
}
