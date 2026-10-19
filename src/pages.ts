import type { SVGProps } from "react";
import {
  Attributions,
  Awards,
  Contribution,
  Description,
  DryLab,
  Engineering,
  Entrepreneurship,
  Events,
  Home,
  HumanPractices,
  Measurement,
  Members,
  Notebook,
  Parts,
  Protocols,
  Results,
  SafetyAndSecurity,
  Sponsors,
} from "./contents";
import {
  BlocksIcon,
  CalendarIcon,
  ClipboardIcon,
  CodeIcon,
  DbtlCycleIcon,
  HandshakeIcon,
  NotebookIcon,
  PeopleIcon,
  PuzzleIcon,
  RibbonIcon,
  ShieldIcon,
  TrophyIcon,
} from "./components/NavMenuIcons";
// These five pages already have an illustration on the home page's "Find
// out more about EMPOWER" cards — reused here instead of drawing a
// near-duplicate (see NavMenuIcons.tsx).
import {
  BubblesIcon,
  LightbulbIcon,
  MagnifierIcon,
  RocketIcon,
  RulerIcon,
} from "./components/FindOutMoreIcons";

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
  // Optional: shown beside the name in the navbar's mega-menu (see
  // Navbar.tsx, folder pages only) and beside the title on the page's own
  // header (see Header.tsx / App.tsx, every page that sets one).
  icon?: React.FC<SVGProps<SVGSVGElement>>;
  // Optional: marks a page as the dedicated page for a special prize EMPOWER
  // is competing for (see the home page's FindOutMore "Special prize" badge,
  // Tgr5Story.tsx). Shown in the navbar (Navbar.tsx) and on the page's own
  // header (Header.tsx / App.tsx). Only prizes with a page of their own carry
  // this.
  specialPrize?: boolean;
  // Optional: a thin divider line before this tile in the navbar's mega-menu
  // (see Navbar.tsx), pushing it onto its own row. Used once today — Dry Lab
  // in the Lab folder, set apart from the four wet-lab-specific pages above
  // it (team request, 2026-10-18).
  menuDivider?: boolean;
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
        icon: LightbulbIcon,
      },
      {
        name: "Engineering Success",
        title: "Engineering Success",
        path: "/engineering",
        component: Engineering,
        lead: "The design-build-test-learn cycles behind EMPOWER, and what each round changed about our design.",
        icon: DbtlCycleIcon,
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution",
        component: Contribution,
        lead: "What we are leaving behind for the teams that come after us, and how to build on it.",
        icon: PuzzleIcon,
      },
      {
        name: "Safety",
        title: "Safety and Security",
        path: "/safety-and-security",
        component: SafetyAndSecurity,
        lead: "The risks we identified in the lab, the containment measures and training behind every protocol, and how we thought about safety beyond the bench.",
        icon: ShieldIcon,
      },
    ],
  },
  {
    name: "Lab",
    folder: [
      {
        name: "Results",
        title: "Results",
        path: "/results",
        component: Results,
        lead: "What came out of the Toolkit and Therapeutics pipelines, from the promoter library to bile salt deconjugation by our hydrolase candidates.",
        icon: MagnifierIcon,
      },
      {
        name: "Measurement",
        title: "Measurement",
        path: "/measurement",
        component: Measurement,
        // Standard URL for the Best Measurement special prize per
        // competition.igem.org/judging/awards/special — keep this path
        // exactly "/measurement".
        lead: "How we validated and calibrated our measurements, and where to find the methods, equipment, and data behind each one.",
        icon: RulerIcon,
        specialPrize: true,
      },
      {
        name: "Notebook",
        title: "Notebook",
        path: "/notebook",
        component: Notebook,
        lead: "A chronological record of our wet lab work, one notebook per research line, each entry also downloadable as a PDF.",
        icon: NotebookIcon,
      },
      {
        name: "Protocols",
        title: "Protocols",
        path: "/protocols",
        component: Protocols,
        lead: "Detailed, step-by-step protocols used throughout the project so other teams can replicate our work.",
        icon: ClipboardIcon,
      },
      {
        name: "Parts",
        title: "Parts",
        path: "/parts",
        component: Parts,
        lead: "The basic and composite parts of our Promoter Reporter Library, each linked to its iGEM Registry page.",
        icon: BlocksIcon,
      },
      {
        name: "Dry Lab",
        title: "Dry Lab",
        path: "/dry-lab",
        component: DryLab,
        lead: "A toolkit for engineering Bacteroides species, and the computational screening that narrowed our bile salt hydrolase candidates.",
        icon: CodeIcon,
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
        icon: BubblesIcon,
        specialPrize: true,
      },
      {
        name: "Events",
        title: "Events",
        path: "/events",
        component: Events,
        lead: "A timeline of the talks, workshops, meetups, and outreach activities our team took part in throughout the season.",
        icon: CalendarIcon,
      },
    ],
  },
  {
    name: "Entrepreneurship",
    title: "Entrepreneurship",
    path: "/entrepreneurship",
    component: Entrepreneurship,
    lead: "The business case for EMPOWER, phase by phase, from mission and problem to market, funding and a sustainable venture.",
    icon: RocketIcon,
    specialPrize: true,
  },
  {
    name: "Prizes and Medals",
    title: "Prizes and Medals",
    path: "/awards",
    component: Awards,
    lead: "The medal and special prizes we are competing for, why we believe we deserve each one, and where on the wiki to find the work behind it.",
    icon: TrophyIcon,
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
        icon: RibbonIcon,
      },
      {
        name: "Team",
        title: "Meet Our Team",
        path: "/team",
        component: Members,
        lead: "Get to know the team behind EMPOWER.",
        icon: PeopleIcon,
      },
      {
        name: "Sponsors",
        title: "Sponsors",
        path: "/sponsors",
        component: Sponsors,
        lead: "EMPOWER is made possible by the organisations on this page. Thank you for supporting our project!",
        icon: HandshakeIcon,
      },
    ],
  },
];

export default Pages;
