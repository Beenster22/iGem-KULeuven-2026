// Generated with Claude Opus 5.5 (Anthropic), 2026-10-03
// Purpose: lets the plain-string page leads in pages.ts mark species names
// for italics with _underscores_ (as in the .mdx content), since those
// strings are rendered by Header and the navbar menu rather than by MDX.
import { Fragment, ReactNode } from "react";

export function renderItalics(text: string): ReactNode {
  return text
    .split(/_([^_]+)_/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <em key={index}>{part}</em>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}
