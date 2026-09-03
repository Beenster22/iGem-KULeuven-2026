// Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
// Purpose: remark-gfm auto-collects every [^n] footnote used on a page into
// a plain <section data-footnotes> appended at the end of the document.
// This rehype plugin rewrites that section into a collapsible
// <details>/<summary> "References" panel so a page's citation list stays
// tucked away until a reader opens it, while leaving the numbering, the
// [n] <-> list linking, and the built-in "back to text" links untouched.

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
