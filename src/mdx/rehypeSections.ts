// Generated with Claude Opus 5.5 (Anthropic), 2026-10-11
// Purpose: markdown is flat — a "## Heading" and the paragraphs under it are
// just siblings — so there is nothing to draw a box around. This rehype
// plugin groups each h2 directly inside a <PageLayout>, together with
// everything up to the next h2, into a <section class="content-section">
// (styled in App.css) so the major sections of a content page read as
// separate boxes. Whatever comes before the first h2 (intro text, medal
// callouts) is left as it is, and so are h2s nested inside other components
// (tabs, wheels, dropdowns), which have their own framing.

interface HastNode {
  type: string;
  tagName?: string;
  name?: string | null;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

function isH2(node: HastNode): boolean {
  return node.type === "element" && node.tagName === "h2";
}

function isPageLayout(node: HastNode): boolean {
  return node.type === "mdxJsxFlowElement" && node.name === "PageLayout";
}

function groupSections(children: HastNode[]): HastNode[] {
  const grouped: HastNode[] = [];
  let section: HastNode | null = null;

  for (const child of children) {
    if (isH2(child)) {
      section = {
        type: "element",
        tagName: "section",
        properties: { className: ["content-section"] },
        children: [],
      };
      grouped.push(section);
    }
    (section?.children ?? grouped).push(child);
  }
  return grouped;
}

export function rehypeSections() {
  return (tree: HastNode) => {
    for (const node of tree.children ?? []) {
      if (isPageLayout(node) && node.children) {
        node.children = groupSections(node.children);
      }
    }
  };
}

export default rehypeSections;
