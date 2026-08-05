import {
  AlternativePlatform,
  Attributions,
  Biocontainment,
  Contribution,
  Crispr,
  Description,
  Engineering,
  Entrepreneurship,
  Events,
  Experiments,
  Home,
  HumanPractices,
  Members,
  Notebook,
  Promoter,
  ProofOfConcept,
  Protocols,
  Rbs,
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
        name: "Engineering",
        title: "Engineering Success",
        path: "/engineering",
        component: Engineering,
        lead: "Demonstrate engineering success in a technical aspect of your project by going through at least one iteration of the engineering design cycle.",
      },
      {
        name: "Contributions",
        title: "Contributions",
        path: "/contribution",
        component: Contribution,
        lead: "Make a useful contribution for future iGEM teams and document it on this page.",
      },
      {
        name: "Entrepreneurship",
        title: "Entrepreneurship",
        path: "/entrepreneurship",
        component: Entrepreneurship,
        lead: "The entrepreneurship award recognizes exceptional effort to build a business case and commercialize an iGEM project.",
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
        name: "Promoter",
        title: "Promoter",
        path: "/promoter",
        component: Promoter,
        lead: "Placeholder page — replace with your promoter content.",
      },
      {
        name: "RBS",
        title: "RBS",
        path: "/rbs",
        component: Rbs,
        lead: "Placeholder page — replace with your RBS content.",
      },
    ],
  },
  {
    name: "Wet Lab",
    folder: [
      {
        name: "Experiments",
        title: "Experiments",
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
    name: "Outreach",
    folder: [
      {
        name: "Integrated Human Practices",
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
    name: "Team",
    folder: [
      {
        name: "Attributions",
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
