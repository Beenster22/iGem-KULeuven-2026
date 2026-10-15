// Generated with Claude Opus 5.5 (Anthropic), 2026-10-14
// Purpose: builds the full-text index behind the navbar search (see
// src/components/Search.tsx) at build time. Every src/contents/*.mdx page is
// split into one entry per heading, with its text reduced to plain words
// (JSX tags, markdown syntax, comments and reference definitions removed).
// The index is served as the virtual module "virtual:search-index", which the
// search dialog only loads the first time it is opened. Each page is linked
// to its route through its MDX component, so pages.ts stays the single place
// where paths are defined.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { stringToSlug } from "../utils/stringToSlug";

const VIRTUAL_ID = "virtual:search-index";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

export interface SearchSection {
  // The heading this text sits under; empty for the text before the first one.
  heading: string;
  // The headings this one sits under, outermost first ("## " section, "### "
  // group, dropdowns), shown as a breadcrumb and searched along with it.
  trail: string[];
  // Heading ids to try when jumping to this section, most specific first:
  // the heading itself, then the dropdowns it sits inside, then its "## "
  // section. A heading inside a closed dropdown isn't in the page until the
  // dropdown is opened, so the search falls back along this list.
  anchors: string[];
  text: string;
}

// Components whose title prop is rendered as a heading on the page.
const TITLED_CONTAINERS = ["ExpandableText", "NotebookDropdown", "NotebookSection"];
// String props whose values are visible text worth searching.
const TEXT_PROPS = ["title", "label", "subtitle", "name", "role", "caption", "alt"];

function stripInlineMarkup(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\[\^[^\]]+\]/g, "")
    .replace(/\[ref\s*[:=][^\]]*\]/gi, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[*_`|#>]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// The text of a component's title prop: title="..." or title={<>...</>}.
function readTitle(tag: string): string | null {
  const quoted = tag.match(/\btitle=(?:"([^"]*)"|'([^']*)')/);
  if (quoted) return quoted[1] ?? quoted[2];
  const expression = tag.match(/\btitle=\{(.*?)\}\s*(?:\w+=|\/?>)/s);
  if (expression) return stripInlineMarkup(expression[1].replace(/^["'`]|["'`]$/g, ""));
  return null;
}

function readTextProps(tag: string): string {
  const values: string[] = [];
  const pattern = new RegExp(`\\b(?:${TEXT_PROPS.join("|")})="([^"]*)"`, "g");
  for (const match of tag.matchAll(pattern)) values.push(match[1]);
  return values.join(" ");
}

function braceDepth(line: string): number {
  return (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
}

function bracketDepth(line: string): number {
  return (line.match(/[[{(]/g)?.length ?? 0) - (line.match(/[\]})]/g)?.length ?? 0);
}

export function indexMdx(source: string): SearchSection[] {
  const sections: SearchSection[] = [];
  let current: SearchSection = { heading: "", trail: [], anchors: [], text: "" };
  let h2: { title: string; anchor: string | null } | null = null;
  let h3Title: string | null = null;
  // Open titled containers, innermost last.
  const containers: { name: string; title: string | null; anchor: string | null }[] = [];

  const lines = source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\r?\n/);

  const startSection = (heading: string, anchor: string | null) => {
    if (current.text.trim() || current.heading) sections.push(current);
    const anchors = [anchor, ...containers.map((c) => c.anchor).reverse(), h2?.anchor];
    const trail = [h2?.title, h3Title, ...containers.map((c) => c.title)];
    current = {
      heading,
      trail: [...new Set(trail.filter((t): t is string => !!t && t !== heading))],
      anchors: [...new Set(anchors.filter((a): a is string => !!a))],
      text: "",
    };
  };
  const addText = (text: string) => {
    const clean = stripInlineMarkup(text);
    if (clean) current.text += (current.text ? " " : "") + clean;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^-{3,}$/.test(line) || /^\|?[\s:|-]+\|?$/.test(line)) continue;

    // import/export statements, possibly spanning several lines.
    if (/^(import|export)\s/.test(line)) {
      let depth = bracketDepth(line);
      while (depth > 0 && i + 1 < lines.length) depth += bracketDepth(lines[++i]);
      continue;
    }
    // Reference definitions only show up in the collapsed References panel.
    if (/^\[\^[^\]]+\]:/.test(line)) continue;

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const text = stripInlineMarkup(heading[2]);
      const anchor = stringToSlug(text) || null;
      if (heading[1].length <= 2) {
        h2 = { title: text, anchor };
        h3Title = null;
        // A "## " heading starts a new section of the page, outside any dropdown.
        containers.length = 0;
      } else if (heading[1].length === 3 && !containers.length) {
        h3Title = text;
      }
      startSection(text, anchor);
      continue;
    }

    const closing = line.match(/^<\/([A-Z]\w*)>/);
    if (closing) {
      const index = containers.map((c) => c.name).lastIndexOf(closing[1]);
      if (index !== -1) containers.length = index;
      addText(line.slice(closing[0].length));
      continue;
    }

    // A component tag on its own line (inline HTML like <em> is left to
    // stripInlineMarkup with the rest of the line).
    const opening = line.match(/^<([A-Z][\w.]*)/);
    if (opening) {
      // Gather a tag whose props run over several lines, until its braces
      // balance and a line ends the tag.
      let tag = line;
      let depth = braceDepth(line);
      while (!(depth <= 0 && />\s*$/.test(tag)) && i + 1 < lines.length) {
        const next = lines[++i].trim();
        depth += braceDepth(next);
        tag += " " + next;
      }
      const name = opening[1];
      if (TITLED_CONTAINERS.includes(name)) {
        const title = readTitle(tag);
        const anchor = title ? stringToSlug(title) || null : null;
        if (!/\/>\s*$/.test(tag)) containers.push({ name, title, anchor });
        if (title) startSection(title, anchor);
      } else {
        addText(readTextProps(tag));
      }
      continue;
    }

    addText(line.replace(/^(?:[-+*]|\d+\.)\s+/, ""));
  }
  if (current.text.trim() || current.heading) sections.push(current);
  return sections;
}

export function searchIndexPlugin(): Plugin {
  const contentsDir = resolve(process.cwd(), "src/contents");
  const mdxFiles = () => readdirSync(contentsDir).filter((file) => file.endsWith(".mdx"));

  return {
    name: "search-index",
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const imports: string[] = [];
      const entries: string[] = [];
      mdxFiles().forEach((file, i) => {
        const path = resolve(contentsDir, file);
        this.addWatchFile(path);
        imports.push(`import Page${i} from ${JSON.stringify(path.replace(/\\/g, "/"))};`);
        entries.push(
          `{ component: Page${i}, sections: ${JSON.stringify(indexMdx(readFileSync(path, "utf8")))} }`,
        );
      });
      return `${imports.join("\n")}\nexport default [\n${entries.join(",\n")}\n];\n`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".mdx")) return;
      const module = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (module) server.moduleGraph.invalidateModule(module);
    },
  };
}
