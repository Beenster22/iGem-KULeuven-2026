import { TeamMembers, TeamMemberCard } from "./components/TeamMembers";
import { ProtocolBox } from "./components/ProtocolBox";
import { ProtocolCalculator } from "./components/ProtocolCalculator";
import { ProtocolCalcGrid } from "./components/ProtocolCalcGrid";
import { ProtocolCalculations } from "./components/ProtocolCalculations";
import { ProtocolNote } from "./components/ProtocolNote";
import { ProtocolDownloads } from "./components/ProtocolDownloads";
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
import {
  HumanPracticesInterviews,
  HPSection,
  HPIntro,
  Interviewee,
} from "./components/HumanPracticesInterviews";
import { PmosOverview } from "./components/PmosOverview";
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
import { PhasePager } from "./components/PhasePager";
import { MicrobeBackdrop } from "./components/MicrobeBackdrop";
import { TwoGutsSection } from "./components/TwoGutsSection";
import {
  StoryScrollSection,
  StoryStatement,
} from "./components/StoryScrollSection";
import {
  EngineerSection,
  FindOutMore,
  Tgr5ConsequencesSection,
  Tgr5Ilc3Figure,
  Tgr5MechanismSection,
} from "./components/Tgr5Story";
import { SponsorGrid } from "./components/SponsorGrid";
import { HomeSnapScroll } from "./components/HomeSnapScroll";
import { DBTLCycles, DBTLCycle, DBTLStage } from "./components/DBTLCycles";
import { ZoomableImage } from "./components/ZoomableImage";
import { ElleSays } from "./components/ElleSays";
import { SuccessCards, SuccessCard } from "./components/SuccessCards";
import {
  ResultSection,
  KeyTakeaways,
  Takeaway,
  FigureSlot,
} from "./components/ResultsKit";
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
  PageLayout,
  PmosOverview,
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
  PhasePager,
  MicrobeBackdrop,
  TwoGutsSection,
  StoryScrollSection,
  StoryStatement,
  Tgr5MechanismSection,
  // Not on the home page any more; free to use on another page.
  Tgr5Ilc3Figure,
  Tgr5ConsequencesSection,
  EngineerSection,
  FindOutMore,
  SponsorGrid,
  HomeSnapScroll,
  ZoomableImage,
  ElleSays,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-16
  // Purpose: the headline result cards at the top of the results page.
  SuccessCards,
  SuccessCard,
  // Generated with Claude Opus 5 (Anthropic), 2026-10-17
  // Purpose: the results page's layout kit — the key-takeaway cards and the
  // placeholder boxes for figures that have not been added yet.
  ResultSection,
  KeyTakeaways,
  Takeaway,
  FigureSlot,
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
};
