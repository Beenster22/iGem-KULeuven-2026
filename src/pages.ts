import {
  Attributions,
  Awards,
  Contribution,
  Description,
  DryLab,
  Engineering,
  Entrepreneurship,
  Events,
  ExperimentalOverview,
  Home,
  HumanPractices,
  Members,
  Notebook,
  Parts,
  Protocols,
  Results,
  SafetyAndSecurity,
  Sponsors,
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
  // Optional: pages whose lead has not been written yet show the title alone
  // (see Header.tsx) instead of iGEM's own judging prompt.
  lead?: string;
}

const Pages: (Page | Folder)[] = [
  {
    name: "Home",
    title: "Home",
    path: "/",
    component: Home,
  },
  {
    name: "Project",
    folder: [
      {
        name: "Description",
        title: "Project Description",
        path: "/description",
        component: Description,
        lead: "What PMOS is, how it is diagnosed, and why we went looking for its roots in the gut.",
      },
      {
        name: "Engineering Success",
        title: "Engineering Success",
        path: "/engineering",
        component: Engineering,
        lead: "The design-build-test-learn cycles behind EMPOWER, and what each round changed about our design.",
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution",
        component: Contribution,
        lead: "What we are leaving behind for the teams that come after us, and how to build on it.",
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/safety-and-security",
        component: SafetyAndSecurity,
        lead: "The risks we identified in the lab, the containment measures and training behind every protocol, and how we thought about safety beyond the bench.",
      },
    ],
  },
  {
    name: "Dry Lab",
    title: "Dry Lab",
    path: "/dry-lab",
    component: DryLab,
    lead: "A toolkit for engineering Bacteroides species, and the computational screening that narrowed our bile salt hydrolase candidates.",
  },
  {
    name: "Wet Lab",
    folder: [
      {
        name: "Experimental Overview",
        title: "Experimental Overview",
        path: "/experimental-overview",
        component: ExperimentalOverview,
        lead: "How our wet lab work fits together, from strain and antibiotic selection through conjugation and promoter screening, across the Toolkit and Therapeutics lines.",
      },
      {
        name: "Protocols",
        title: "Protocols",
        path: "/protocols",
        component: Protocols,
        lead: "Detailed, step-by-step protocols used throughout the project so other teams can replicate our work.",
      },
      {
        name: "Parts",
        title: "Parts",
        path: "/parts",
        component: Parts,
        lead: "The DNA parts built and used in this project, each linked to the notebook entry where it was made or characterised.",
      },
      {
        name: "Notebook",
        title: "Notebook",
        path: "/notebook",
        component: Notebook,
        lead: "A chronological record of our wet lab work, one notebook per research line, each entry also downloadable as a PDF.",
      },
      {
        name: "Results",
        title: "Results",
        path: "/results",
        component: Results,
        lead: "What came out of the Toolkit and Therapeutics pipelines, from the promoter library to bile salt deconjugation by our hydrolase candidates.",
      },
    ],
  },
  {
    name: "Engagement",
    folder: [
      {
        name: "Integrated Human Practices",
        title: "Integrated Human Practices",
        path: "/human-practices",
        component: HumanPractices,
        lead: "The five stakeholder groups we spoke with, how their feedback reached the project, and what it changed.",
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
    title: "Entrepreneurship",
    path: "/entrepreneurship",
    component: Entrepreneurship,
    lead: "The business case for EMPOWER, phase by phase, from mission and problem to market, funding and a sustainable venture.",
  },
  {
    name: "Prizes and Medals",
    title: "Prizes and Medals",
    path: "/awards",
    component: Awards,
    lead: "The medal and special prizes we are competing for, why we believe we deserve each one, and where on the wiki to find the work behind it.",
  },
  {
    name: "Team",
    folder: [
      {
        name: "Attribution",
        title: "Attributions",
        path: "/attributions",
        component: Attributions,
        lead: "See who contributed to each part of the project.",
      },
      {
        name: "Team",
        title: "Meet Our Team",
        path: "/team",
        component: Members,
        lead: "Get to know the team behind EMPOWER.",
      },
      {
        name: "Sponsors",
        title: "Sponsors",
        path: "/sponsors",
        component: Sponsors,
        lead: "EMPOWER is made possible by the organisations on this page. Thank you for supporting our project!",
      },
    ],
  },
];

export default Pages;
