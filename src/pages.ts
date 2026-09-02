import {
  AlternativePlatform,
  Attributions,
  Biocontainment,
  BusinessPlan,
  CashFlow,
  Contribution,
  Crispr,
  Description,
  Engineering,
  Events,
  Experiments,
  Home,
  HumanPractices,
  IpAndRegulatoryStrategy,
  ManufacturingPlan,
  MarketAndTargetGroup,
  Members,
  Notebook,
  ProblemAndMission,
  ProofOfConcept,
  PromotersAndRbs,
  Protocols,
  Results,
  SafetyAndSecurity,
  Sponsors,
  Stakeholders,
  UniqueValueProposition,
} from "./contents";

interface Base {
  name: string | undefined;
}

class Folder implements Base {
  name: string | undefined;
  folder: Page[] | undefined;
}

class Page implements Base {
  name: string | undefined;
  title: string | undefined;
  path: string | undefined;
  component: React.FC | undefined;
  lead: string | undefined;
}

const Pages: (Page | Folder)[] = [
  {
    name: "Home",
    title: "Home",
    path: "/",
    component: Home,
    lead: "CYSTBUSTERSSS LET'S GET THESE BITCHES",
  },
  {
    name: "Project",
    folder: [
      {
        name: "Description",
        title: "Project Description",
        path: "/description",
        component: Description,
        lead: "Describe how and why you chose your iGEM project.",
      },
      {
        name: "Engineering Success",
        title: "Engineering Success",
        path: "/engineering",
        component: Engineering,
        lead: "Demonstrate engineering success in a technical aspect of your project by going through at least one iteration of the engineering design cycle.",
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution",
        component: Contribution,
        lead: "Make a useful contribution for future iGEM teams and document it on this page.",
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/safety-and-security",
        component: SafetyAndSecurity,
        lead: "Detail the safety and security considerations of your project, adressing potential risks and outlining the measures taken to mitigate them.",
      },
    ],
  },
  {
    name: "Dry Lab",
    folder: [
      {
        name: "CRISPR",
        title: "CRISPR",
        path: "/crispr",
        component: Crispr,
        lead: "Placeholder page — replace with your CRISPR content.",
      },
      {
        name: "Biocontainment",
        title: "Biocontainment",
        path: "/biocontainment",
        component: Biocontainment,
        lead: "Placeholder page — replace with your biocontainment content.",
      },
      {
        name: "Promoters and RBSs",
        title: "Promoters and RBSs",
        path: "/promoters-and-rbs",
        component: PromotersAndRbs,
        lead: "Placeholder page — replace with your promoters and RBSs content.",
      },
    ],
  },
  {
    name: "Wet Lab",
    folder: [
      {
        name: "Experiments (DBTL)",
        title: "Experiments (DBTL)",
        path: "/experiments",
        component: Experiments,
        lead: "Describe the research, experiments, and protocols you used in your project. It is designed to provide sufficient information for other teams to replicate our work.",
      },
      {
        name: "Protocols",
        title: "Protocols",
        path: "/protocols",
        component: Protocols,
        lead: "Detailed, step-by-step protocols used throughout the project so other teams can replicate our work.",
      },
      {
        name: "Notebook",
        title: "Notebook",
        path: "/notebook",
        component: Notebook,
        lead: "This serves as a chronological record of your team's progress throughout the season. It documents your daily activities, experiments, discussions, and decisions.",
      },
      {
        name: "Results",
        title: "Results",
        path: "/results",
        component: Results,
        lead: "Present the results of your project, along with a detailed analysis and discussion of their significance. Also outline future plans and reflections on the impact of your project.",
      },
      {
        name: "Alternative Platform",
        title: "Alternative Platform",
        path: "/alternative-platform",
        component: AlternativePlatform,
        lead: "This award is designed to celebrate exemplary work done in alternative platforms, and covers anything that is not E. coli, S. cerevisiae, and B. subtilis.",
      },
      {
        name: "Proof of Concept",
        title: "Proof of Concept",
        path: "/proof-of-concept",
        component: ProofOfConcept,
        lead: "Placeholder page — replace with your proof of concept content.",
      },
    ],
  },
  {
    name: "iHP",
    folder: [
      {
        name: "Integrated HP",
        title: "Integrated Human Practices",
        path: "/human-practices",
        component: HumanPractices,
        lead: "We ask every team to think deeply and creatively about whether their project is responsible and good for the world. Consider how the world affects your work and how your work affects the world.",
      },
      {
        name: "Events",
        title: "Events",
        path: "/events",
        component: Events,
        lead: "A timeline of the talks, workshops, meetups, and outreach activities our team took part in throughout the season.",
      },
    ],
  },
  {
    name: "Entrepreneurship",
    folder: [
      {
        name: "Problem and Mission",
        title: "Problem and Mission",
        path: "/problem-and-mission",
        component: ProblemAndMission,
        lead: "Placeholder page — replace with your problem and mission content.",
      },
      {
        name: "Market and Target Group",
        title: "Market and Target Group",
        path: "/market-and-target-group",
        component: MarketAndTargetGroup,
        lead: "Placeholder page — replace with your market and target group content.",
      },
      {
        name: "Stakeholders",
        title: "Stakeholders",
        path: "/stakeholders",
        component: Stakeholders,
        lead: "Placeholder page — replace with your stakeholders content.",
      },
      {
        name: "Unique Value Proposition",
        title: "Unique Value Proposition",
        path: "/unique-value-proposition",
        component: UniqueValueProposition,
        lead: "Placeholder page — replace with your unique value proposition content.",
      },
      {
        name: "Proof of Concept and Manufacturing Plan",
        title: "Proof of Concept and Manufacturing Plan",
        path: "/manufacturing-plan",
        component: ManufacturingPlan,
        lead: "Placeholder page — replace with your proof of concept and manufacturing plan content.",
      },
      {
        name: "Business Plan",
        title: "Business Plan",
        path: "/business-plan",
        component: BusinessPlan,
        lead: "Placeholder page — replace with your business plan content.",
      },
      {
        name: "Cash Flow",
        title: "Cash Flow",
        path: "/cash-flow",
        component: CashFlow,
        lead: "Placeholder page — replace with your cash flow content.",
      },
      {
        name: "IP & Regulatory Strategy",
        title: "IP & Regulatory Strategy",
        path: "/ip-and-regulatory-strategy",
        component: IpAndRegulatoryStrategy,
        lead: "Placeholder page — replace with your IP and regulatory strategy content.",
      },
    ],
  },
  {
    name: "Team",
    folder: [
      {
        name: "Attribution",
        title: "Attributions",
        path: "/attributions",
        component: Attributions,
        lead: "Placeholder page — replace with your attributions content.",
      },
      {
        name: "Team",
        title: "Meet Our Team",
        path: "/team",
        component: Members,
        lead: "This page is dedicated to introducing the individuals who made our iGEM project possible. Here, you'll find information about our team members, instructors, and advisors.",
      },
      {
        name: "Sponsors",
        title: "Sponsors",
        path: "/sponsors",
        component: Sponsors,
        lead: "Placeholder page — replace with your sponsors content.",
      },
    ],
  },
];

export default Pages;
