import { Children, ReactElement, ReactNode, isValidElement } from "react";
import { stringToSlug } from "./stringToSlug";

export interface HeadingEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

function getText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (isValidElement(node)) return getText((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

// Walks the already-rendered MDX children tree (not raw markdown) looking for
// h2/h3 elements, so the sidebar layout can be decided synchronously without
// a post-mount DOM pass causing a layout flash.
export function extractHeadings(children: ReactNode): HeadingEntry[] {
  const headings: HeadingEntry[] = [];
  const seen = new Map<string, number>();

  function addHeading(level: 2 | 3, rawText: string) {
    const text = rawText.trim();
    if (!text) return;
    let slug = stringToSlug(text) || "section";
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    headings.push({ id: slug, text, level });
  }

  function walk(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      const element = child as ReactElement<{ children?: ReactNode }>;
      if (element.type === "h2" || element.type === "h3") {
        addHeading(element.type === "h2" ? 2 : 3, getText(element.props.children));
        return;
      }
      if (element.props?.children) walk(element.props.children);
    });
  }

  walk(children);
  return headings;
}
