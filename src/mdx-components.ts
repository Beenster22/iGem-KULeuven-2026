import { TeamMembers, TeamMemberCard } from "./components/TeamMembers";
import { ProtocolBox } from "./components/ProtocolBox";
import { ProtocolCalculator } from "./components/ProtocolCalculator";
import { SoftwareDownload } from "./components/SoftwareDownload";
import { ProtocolCalcGrid } from "./components/ProtocolCalcGrid";
import { ProtocolCalculations } from "./components/ProtocolCalculations";
import { ProtocolNote } from "./components/ProtocolNote";
import { ProtocolDownloads } from "./components/ProtocolDownloads";
import { PartsTable } from "./components/PartsTable";
import { PageLayout } from "./components/PageLayout";
import { Callout } from "./components/Callout";
import { TabbedSections, TabSection } from "./components/TabbedSections";
import { SectionItem } from "./components/SectionItem";
import { WheelSelector } from "./components/WheelSelector";
import { SegmentedSelector } from "./components/SegmentedSelector";
import { NotebookTimeline, NotebookEntry } from "./components/NotebookTimeline";
import { ExpandableText } from "./components/Expandable-Text";
import {
  NotebookDropdown,
  NotebookSection,
  EntryLink,
} from "./components/NotebookDropdown";
import { NotebookEntryMeta } from "./components/NotebookEntryMeta";
import { EventsTimeline, EventEntry } from "./components/EventsTimeline";
import { PdfEmbed } from "./components/PdfEmbed";
import {
  HumanPracticesInterviews,
  HPSection,
  HPIntro,
  Interviewee,
} from "./components/HumanPracticesInterviews";
import { PmosOverview } from "./components/PmosOverview";
import { PmosGlobeSection } from "./components/PmosGlobeSection";
import {
  SymptomGroups,
  PmosDefinition,
} from "./components/BodySymptomsSection";
import { PmosEffectsSection } from "./components/PmosEffectsSection";
import { ElleTour } from "./components/ElleTour";
import { InflammationSliderSection } from "./components/InflammationSliderSection";
import { BshStreamAnimation } from "./components/BshStreamAnimation";
import { MicChart } from "./components/MicChart";
import { MilestoneArc, Milestone } from "./components/MilestoneArc";
import { FanSelector, FanBranch } from "./components/FanSelector";
import { MarketRings, MarketRing } from "./components/MarketRings";
import { BusinessModelCanvas } from "./components/BusinessModelCanvas";
import { Roadmap } from "./components/Roadmap";
import { GlossaryTerm } from "./components/GlossaryTerm";
import { Checklist } from "./components/Checklist";
import { Medal } from "./components/Medal";
import { PrizeStar } from "./components/PrizeStar";
import { PhasePager } from "./components/PhasePager";
import { IntegrationSummary, IntegrationPoint } from "./components/IntegrationSummary";
import { MicrobeBackdrop } from "./components/MicrobeBackdrop";
import { TwoGutsSection } from "./components/TwoGutsSection";
import {
  StoryScrollSection,
  StoryStatement,
} from "./components/StoryScrollSection";
import {
  FindOutMore,
  Tgr5ConsequencesSection,
  Tgr5Ilc3Figure,
  Tgr5ImpairedSection,
  Tgr5MechanismSection,
  Tgr5ZoomSection,
} from "./components/Tgr5Story";
import { PvBalanceSection, PvCureSection } from "./components/PvHeroStory";
import { SponsorGrid } from "./components/SponsorGrid";
import { HomeSnapScroll, SnapHold } from "./components/HomeSnapScroll";
import { DBTLCycles, DBTLCycle, DBTLStage } from "./components/DBTLCycles";
import { ZoomableImage } from "./components/ZoomableImage";
import { ElleSays } from "./components/ElleSays";
import {
  ResultSection,
  KeyTakeaways,
  Takeaway,
  FigureSlot,
} from "./components/ResultsKit";
import { ResultsPipelines } from "./components/ResultsPipelines";
import { SuccessCards, SuccessCard } from "./components/SuccessCards";
import { TherapeuticsOverview } from "./components/TherapeuticsOverview";
import { ImageFlowSelector, FlowStep } from "./components/ImageFlowSelector";
import {
  StakeholderGroups,
  StakeholderGroup,
  StakeholderMatrix,
} from "./components/StakeholderAnalysis";
import {
  FeedbackCycle,
  FeedbackStep,
  FeedbackOutcomes,
  FeedbackOutcome,
  ResourceDownload,
} from "./components/FeedbackCycle";
import { DockingHeatmap } from "./components/DockingHeatmap";
import { BileSaltRatioTable } from "./components/BileSaltRatioTable";
import {
  QuestionSelector,
  Question,
  InfoCards,
  InfoCard,
} from "./components/QuestionSelector";
import { PhenotypeVenn } from "./components/PhenotypeVenn";
import {
  EvolutionIcon,
  DnaIcon,
  InsulinIcon,
  GlobeLeafIcon,
  BrainIcon,
} from "./components/HypothesisIcons";
import {
  InstagramCarousel,
  InstagramPost,
  PublicationShowcase,
  Publication,
  PhoneShowcase,
  VideoSlot,
} from "./components/ScienceCommunication";
import { Link } from "react-router-dom";

export const mdxComponents = {
  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
  // Purpose: lets .mdx pages link to another wiki page (optionally with a
  // #section) via <Link to="/page#section">, which respects the router's
  // base path — a plain markdown [text](/page) link would not.
  Link,
  TeamMembers,
  TeamMemberCard,
  ProtocolBox,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-12
  // Purpose: the wet lab protocol pages — live calculator tables, the
  // shaded Note/Critical boxes, and the PDF + workbook download row.
  ProtocolCalculator,
  ProtocolCalcGrid,
  ProtocolCalculations,
  ProtocolNote,
  ProtocolDownloads,
  SoftwareDownload,
  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
  // Purpose: the Basic / Composite part tables on the Parts page.
  PartsTable,
  PageLayout,
  PmosOverview,
  PmosGlobeSection,
  SymptomGroups,
  PmosEffectsSection,
  ElleTour,
  PmosDefinition,
  BshStreamAnimation,
  InflammationSliderSection,
  MicChart,
  MilestoneArc,
  Milestone,
  FanSelector,
  FanBranch,
  MarketRings,
  MarketRing,
  BusinessModelCanvas,
  Roadmap,
  GlossaryTerm,
  Checklist,
  Medal,
  PrizeStar,
  PhasePager,
  IntegrationSummary,
  IntegrationPoint,
  MicrobeBackdrop,
  TwoGutsSection,
  StoryScrollSection,
  StoryStatement,
  Tgr5MechanismSection,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-20: the close-up of
  // the receptor, under the screen about bile acids interacting with it.
  Tgr5ZoomSection,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-20: the screen where
  // the binding fails, which replaced a sentence on its own.
  Tgr5ImpairedSection,
  // Not on the home page any more; free to use on another page.
  Tgr5Ilc3Figure,
  Tgr5ConsequencesSection,
  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-20: P. vulgatus in a
  // cape levelling the scales, then clearing the symptoms (replace
  // EngineerSection).
  PvBalanceSection,
  PvCureSection,
  FindOutMore,
  SponsorGrid,
  HomeSnapScroll,
  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-20: pins a home-page
  // screen for two scrolls once it is showing.
  SnapHold,
  ZoomableImage,
  ElleSays,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: the results page's layout kit — the key-takeaway cards and the
  // placeholder boxes for figures that have not been added yet.
  ResultSection,
  KeyTakeaways,
  Takeaway,
  FigureSlot,
  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-19
  // Purpose: the results page's pipeline switch, section index and pager.
  ResultsPipelines,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-16
  // Purpose: the headline result cards at the top of the results page.
  SuccessCards,
  SuccessCard,
  TherapeuticsOverview,
  ImageFlowSelector,
  FlowStep,
  DockingHeatmap,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: BSA-07's Table 1 in the notebook, with the workbook's red/yellow
  // highlighting on the ratio columns, which a markdown table cannot carry.
  BileSaltRatioTable,
  QuestionSelector,
  Question,
  InfoCards,
  InfoCard,
  Callout,
  TabbedSections,
  TabSection,
  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-20
  // Purpose: the Science Communication & Outreach page — Instagram post
  // carousel, publications card, app phone mockup and collaboration videos.
  InstagramCarousel,
  InstagramPost,
  PublicationShowcase,
  Publication,
  PhoneShowcase,
  VideoSlot,
  SectionItem,
  WheelSelector,
  SegmentedSelector,
  NotebookTimeline,
  NotebookEntry,
  ExpandableText,
  NotebookDropdown,
  NotebookSection,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: <EntryLink to="CNJ-07" /> — a cross-reference from one notebook
  // entry to another, which opens the notebook and entry it names.
  EntryLink,
  NotebookEntryMeta,
  EventsTimeline,
  EventEntry,
  PdfEmbed,
  HumanPracticesInterviews,
  HPSection,
  HPIntro,
  Interviewee,
  StakeholderGroups,
  StakeholderGroup,
  StakeholderMatrix,
  FeedbackCycle,
  FeedbackStep,
  FeedbackOutcomes,
  FeedbackOutcome,
  ResourceDownload,
  // Generated with Claude Opus 5.5 (Anthropic), 2026-10-12
  // Purpose: the interactive phenotype Venn diagram on the description page.
  PhenotypeVenn,
  // Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-18
  // Purpose: DBTL cycle browser on the Engineering success page.
  DBTLCycles,
  DBTLCycle,
  DBTLStage,
  // Generated with Claude Sonnet 5 (Anthropic), 2026-10-19
  // Purpose: the PMOS hypothesis figure's wedge icons (project description
  // page), one per hypothesis in Nisa et al.'s grouping of five.
  EvolutionIcon,
  DnaIcon,
  InsulinIcon,
  GlobeLeafIcon,
  BrainIcon,
};
