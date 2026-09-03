// Generated with Claude Sonnet 5 (Anthropic), 2026-09-03
// Purpose: lets teammates write a citation's full text right where it's
// used — `[ref: Smith et al. 2024, some paper]` — instead of having to
// invent an id and write a separate `[^id]: ...` definition elsewhere.
// This rewrites every match into a standard footnoteReference /
// footnoteDefinition mdast pair before remark-rehype runs, so it gets
// exactly the same auto-numbering, References panel, and "Back" link as a
// hand-written [^id] footnote (see rehypeReferences.ts) for free — the two
// styles can be mixed freely on the same page.

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  identifier?: string;
  label?: string;
  url?: string;
  [key: string]: unknown;
}

// Matches [ref: ...] or [ref = ...], case-insensitively, capturing up to
// the next "]". remark-gfm's bare-URL autolinking runs before this plugin
// and turns a URL inside the brackets into its own link node, splitting
// what looks like one text run into several siblings — so matching can't
// just scan one text node at a time. Instead, a non-text sibling (an
// autolinked URL, emphasis, an existing footnoteReference, ...) is
// represented by one placeholder character while scanning, then swapped
// back in as its original node wherever a match ends up covering it. That
// also means simple inline content (a bare URL, *emphasis*) can appear
// inside the shorthand and survives into the reference list unchanged;
// what it can't span is a literal "]" or another [ref: ...] typed as text.
const REF_PATTERN = /\[ref\s*[:=]\s*([^[\]]+)\]/gi;
const PLACEHOLDER = "";

interface Span {
  start: number;
  end: number;
  node: MdastNode;
  isText: boolean;
}

function buildCombined(children: MdastNode[]): { combined: string; spans: Span[] } {
  let combined = "";
  const spans: Span[] = [];
  for (const child of children) {
    const start = combined.length;
    if (child.type === "text" && typeof child.value === "string") {
      combined += child.value;
    } else {
      combined += PLACEHOLDER;
    }
    spans.push({ start, end: combined.length, node: child, isText: child.type === "text" });
  }
  return { combined, spans };
}

// Reconstructs the original nodes (or text slices of them) covering
// combined-string range [from, to). A non-text span can only be wholly in
// or wholly out of the range, since it's exactly one placeholder character.
function sliceToNodes(spans: Span[], from: number, to: number): MdastNode[] {
  const result: MdastNode[] = [];
  for (const span of spans) {
    if (span.end <= from || span.start >= to) continue;
    if (span.isText) {
      const text = span.node.value as string;
      const localFrom = Math.max(from, span.start) - span.start;
      const localTo = Math.min(to, span.end) - span.start;
      const slice = text.slice(localFrom, localTo);
      if (slice) result.push({ type: "text", value: slice });
    } else {
      result.push(span.node);
    }
  }
  return result;
}

// Citation shorthand inside literal code shouldn't be touched.
function skipsChildren(type: string): boolean {
  return type === "code" || type === "inlineCode";
}

export function remarkAutoReferences() {
  return (tree: MdastNode) => {
    let counter = 0;
    const definitions: MdastNode[] = [];

    function visit(node: MdastNode) {
      if (!node.children || skipsChildren(node.type)) return;

      for (const child of node.children) visit(child);
      if (node.children.length === 0) return;

      const { combined, spans } = buildCombined(node.children);
      REF_PATTERN.lastIndex = 0;
      if (!REF_PATTERN.test(combined)) return;
      REF_PATTERN.lastIndex = 0;

      const nextChildren: MdastNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = REF_PATTERN.exec(combined)) !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;
        // The captured group's own offset within the match (the fixed
        // "[ref" + separator prefix can't itself contain a copy of the
        // captured text, so the first occurrence is always the right one).
        const innerStart = matchStart + match[0].indexOf(match[1]);
        const innerEnd = innerStart + match[1].length;

        nextChildren.push(...sliceToNodes(spans, lastIndex, matchStart));

        counter += 1;
        const identifier = `auto-ref-${counter}`;
        nextChildren.push({ type: "footnoteReference", identifier, label: identifier });
        definitions.push({
          type: "footnoteDefinition",
          identifier,
          label: identifier,
          children: [{ type: "paragraph", children: sliceToNodes(spans, innerStart, innerEnd) }],
        });

        lastIndex = matchEnd;
      }

      nextChildren.push(...sliceToNodes(spans, lastIndex, combined.length));
      node.children = nextChildren;
    }

    visit(tree);
    if (definitions.length > 0) {
      tree.children = [...(tree.children ?? []), ...definitions];
    }
  };
}

export default remarkAutoReferences;
