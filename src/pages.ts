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
      },
      {
        name: "Engineering Success",
        title: "Engineering Success",
        path: "/engineering",
        component: Engineering,
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution",
        component: Contribution,
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/safety-and-security",
        component: SafetyAndSecurity,
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
      },
      {
        name: "Results",
        title: "Results",
        path: "/results",
        component: Results,
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
