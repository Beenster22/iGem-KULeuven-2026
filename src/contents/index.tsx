// Every page is its own chunk, fetched when its route is first visited, so a
// visitor to the home page doesn't download the notebook and protocols too.
// App.tsx shows a skeleton (PageSkeleton) while a chunk is on its way. `file`
// is the page's .mdx file name: the search index (searchIndexPlugin.ts) is
// built per file, and Search.tsx uses it to find a page's route.
import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type PageComponent = LazyExoticComponent<ComponentType> & { file: string };

// Every loader, so preloadPages() can fetch the chunks the visitor hasn't
// opened yet.
const loaders: Array<() => Promise<unknown>> = [];

const page = (file: string, load: () => Promise<{ default: ComponentType }>): PageComponent => {
  loaders.push(load);
  return Object.assign(lazy(load), { file });
};

export const Home = page("home", () => import("./home.mdx"));
// Team
export const Attributions = page("attributions", () => import("./attributions.mdx"));
export const Members = page("members", () => import("./members.mdx"));
export const Sponsors = page("sponsors", () => import("./sponsors.mdx"));
// Project
export const Description = page("description", () => import("./description.mdx"));
export const Engineering = page("engineering", () => import("./engineering.mdx"));
export const Contribution = page("contribution", () => import("./contribution.mdx"));
export const SafetyAndSecurity = page("safety-and-security", () => import("./safety-and-security.mdx"));
// Dry Lab
export const DryLab = page("dry-lab", () => import("./dry-lab.mdx"));
// Lab
export const Protocols = page("protocols", () => import("./protocols.mdx"));
export const Notebook = page("notebook", () => import("./notebook.mdx"));
export const Parts = page("parts", () => import("./parts.mdx"));
export const Results = page("results", () => import("./results.mdx"));
export const Measurement = page("measurement", () => import("./measurement.mdx"));
// iHP
export const HumanPractices = page("human-practices", () => import("./human-practices.mdx"));
export const Events = page("events", () => import("./events.mdx"));
export const ScienceCommunication = page("science-communication", () => import("./science-communication.mdx"));
// Entrepreneurship
export const Entrepreneurship = page("entrepreneurship", () => import("./entrepreneurship.mdx"));
// Prizes and Medals / Judging Form
export const Awards = page("awards", () => import("./awards.mdx"));

// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-21
// Purpose: once the first page has loaded and the browser is idle, fetch the
// other page chunks one at a time in the background, so moving between pages
// is instant and a chunk that has gone stale after a redeploy is hit less
// often. Skipped in dev (it would compile every page) and on data-saver
// connections. A failed fetch is ignored: the page is requested again, with
// PageErrorBoundary as the fallback, when the visitor opens it.
export function preloadPages() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!import.meta.env.PROD || connection?.saveData) return;
  const idle: (cb: () => void) => void =
    "requestIdleCallback" in window
      ? (cb) => window.requestIdleCallback(cb, { timeout: 5000 })
      : (cb) => setTimeout(cb, 2000);
  const queue = [...loaders];
  const next = () => {
    const load = queue.shift();
    if (!load) return;
    load().catch(() => {}).finally(() => idle(next));
  };
  idle(next);
}
