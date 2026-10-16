/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEAM_ID: string;
  readonly VITE_TEAM_NAME: string;
  readonly VITE_TEAM_YEAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-14
// Purpose: the full-text search index built by src/search/searchIndexPlugin.ts.
declare module "virtual:search-index" {
  import type { FC } from "react";
  import type { SearchSection } from "./search/searchIndexPlugin";
  const pages: { component: FC; sections: SearchSection[] }[];
  export default pages;
}
