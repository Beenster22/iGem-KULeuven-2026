// Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
// Purpose: remark-gfm auto-collects every [^n] footnote used on a page into
// a plain <section data-footnotes> appended at the end of the document.
// This rehype plugin rewrites that section into a collapsible
// <details>/<summary> "References" panel so a page's citation list stays
// tucked away until a reader opens it, while leaving the numbering and the
// [n] <-> list linking untouched. remark-gfm's per-reference "back to text"
// links are stripped — PageShell.tsx shows one floating "return" button
// instead, only once a reader has actually followed a [n] into this panel.

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

function isFootnotesSection(node: HastNode): boolean {
  return (
    node.type === "element" &&
    node.tagName === "section" &&
    node.properties?.dataFootnotes !== undefined
  );
}

function isBackref(node: HastNode): boolean {
  return node.type === "element" && node.properties?.dataFootnoteBackref !== undefined;
}

function isWhitespaceText(node: HastNode): boolean {
  return node.type === "text" && /^\s+$/.test(node.value ?? "");
}

// Recursively drops every backref link (and a lone whitespace text node
// left dangling right before it, so entries don't end with a trailing gap).
function stripBackrefs(node: HastNode) {
  if (!node.children) return;
  const kept: HastNode[] = [];
  for (const child of node.children) {
    if (isBackref(child)) {
      if (kept.length > 0 && isWhitespaceText(kept[kept.length - 1])) kept.pop();
      continue;
    }
    stripBackrefs(child);
    kept.push(child);
  }
  node.children = kept;
}

export function rehypeReferences() {
  return (tree: HastNode) => {
    if (!tree.children) return;

    tree.children = tree.children.map((node) => {
      if (!isFootnotesSection(node)) return node;

      // Drop the sr-only "Footnotes" <h2> remark-gfm generates — the
      // <summary> below is the visible, accessible label instead.
      const children = (node.children ?? []).filter(
        (child) => !(child.type === "element" && child.tagName === "h2"),
      );
      children.forEach(stripBackrefs);

      const details: HastNode = {
        type: "element",
        tagName: "details",
        properties: { className: ["page-references"] },
        children: [
          {
            type: "element",
            tagName: "summary",
            properties: { className: ["page-references-summary"] },
            children: [{ type: "text", value: "References" }],
          },
          ...children,
        ],
      };
      return details;
    });
  };
}

export default rehypeReferences;
