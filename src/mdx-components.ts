import { TeamMembers, TeamMemberCard } from "./components/TeamMembers";
import { ProtocolBox } from "./components/ProtocolBox";
import { PageLayout } from "./components/PageLayout";
import { Callout } from "./components/Callout";
import { TabbedSections, TabSection } from "./components/TabbedSections";
import { SectionItem } from "./components/SectionItem";
import { WheelSelector } from "./components/WheelSelector";
import { SegmentedSelector } from "./components/SegmentedSelector";
import { NotebookTimeline, NotebookEntry } from "./components/NotebookTimeline";
import { ExpandableText } from "./components/Expandable-Text";
import { EventsTimeline, EventEntry } from "./components/EventsTimeline";
import { HumanPracticesInterviews, HPSection, Interviewee } from "./components/HumanPracticesInterviews";
import { PmosOverview } from "./components/PmosOverview";
import { BodySymptomsSection, PmosDefinition } from "./components/BodySymptomsSection";
import { InflammationSliderSection } from "./components/InflammationSliderSection";
import { BshStreamAnimation } from "./components/BshStreamAnimation";
import { MicChart } from "./components/MicChart";
import { MilestoneArc, Milestone } from "./components/MilestoneArc";
import { FanSelector, FanBranch } from "./components/FanSelector";
import { MarketRings, MarketRing } from "./components/MarketRings";
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
  Tgr5MechanismSection,
} from "./components/Tgr5Story";
import { SponsorGrid } from "./components/SponsorGrid";
import { HomeSnapScroll } from "./components/HomeSnapScroll";
import { ZoomableImage } from "./components/ZoomableImage";
import {
  StakeholderGroups,
  StakeholderGroup,
  StakeholderMatrix,
} from "./components/StakeholderAnalysis";
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
  PageLayout,
  PmosOverview,
  BodySymptomsSection,
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
  MicrobeBackdrop,
  TwoGutsSection,
  StoryScrollSection,
  StoryStatement,
  Tgr5MechanismSection,
  Tgr5ConsequencesSection,
  EngineerSection,
  FindOutMore,
  SponsorGrid,
  HomeSnapScroll,
  ZoomableImage,
  Callout,
  TabbedSections,
  TabSection,
  SectionItem,
  WheelSelector,
  SegmentedSelector,
  NotebookTimeline,
  NotebookEntry,
  ExpandableText,
  EventsTimeline,
  EventEntry,
  HumanPracticesInterviews,
  HPSection,
  Interviewee,
  StakeholderGroups,
  StakeholderGroup,
  StakeholderMatrix,
};
