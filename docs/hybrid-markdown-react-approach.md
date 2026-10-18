# A hybrid approach: Markdown content on top of custom React components

**Who this is for:** teams deciding how to split wiki work when coding
ability on the team is uneven, and anyone on this team who wants to
understand why the wiki is structured the way it is.

## 1. The problem we were solving

Our team had one person with real programming experience and a wiki that
needed to look genuinely custom: interactive diagrams, animated figures,
calculators, timelines, none of which a plain Markdown or HTML template
gives you out of the box. The official [React template](igem-wiki-guide-react.md)
is the right tool for that kind of visual ambition, but it comes with a
real cost: every page is a `.tsx` file, so writing or editing one in the
stock template means knowing JSX, props, and enough React to not break the
build.

That's fine for one programmer building components. It's a bad deal for
everyone else on the team, who have real scientific content to write and no
reason to first learn a frontend framework to do it.

## 2. The pattern, in one sentence

**One programmer builds a library of reusable React components; everyone
else writes pages in plain Markdown and drops those components in by name
wherever they need something fancier than text, a list, or an image.**

This is not a new template; it's a layer on top of the standard React
template. `src/pages.ts`, the navigation, and the routing are completely
untouched. The only thing that changes is *how page content files are
written*: `.tsx` becomes `.mdx` (Markdown, with the option to use JSX
components inline). A non-coder writing a page never sees JSX syntax,
props, or imports, they write:

```md
## Biological safety

We worked in a biosafety level 2 laboratory when handling our target
organism in an anaerobic chamber.

<ExpandableText title="Full containment details">

The rest of the detail goes here, and only appears when someone clicks to
expand it.

</ExpandableText>
```

That `<ExpandableText>` tag is a real React component the programmer built,
but using it requires nothing more than knowing its name and that it wraps
around some text, the same mental model as a `**bold**` or a `[link](url)`.

## 3. How to adjust the standard template for this

Starting from the official `wiki-react-vite` template, the programmer sets
this up once, which the rest of the team never has to touch:

**Step 1:** add the MDX plugin and provider as dependencies:

```bash
yarn add @mdx-js/rollup @mdx-js/react
```

**Step 2:** register the plugin in `vite.config.ts`, so `.mdx` files get
compiled like any other source file:

```ts
const mdx = (await import("@mdx-js/rollup")).default;

export default defineConfig({
  plugins: [
    react(),
    mdx({ providerImportSource: "@mdx-js/react" }),
  ],
});
```

**Step 3:** create one central file, `src/mdx-components.ts`, that maps a
tag name to the real component:

```ts
import { Callout } from "./components/Callout";
import { ExpandableText } from "./components/Expandable-Text";

export const mdxComponents = {
  Callout,
  ExpandableText,
  // every future component gets added here, and nowhere else
};
```

**Step 4:** wrap the whole app in an `MDXProvider` in `src/main.tsx`, so
every `.mdx` file automatically has access to that whole list without
needing its own `import` statements:

```tsx
import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "./mdx-components";

<MDXProvider components={mdxComponents}>
  <App />
</MDXProvider>;
```

**Step 5:** rename your content files from `.tsx` to `.mdx`, writing
Markdown instead of JSX inside them, and update `src/contents/index.tsx` to
match (MDX files export their content as the default export automatically):

```ts
export { default as Description } from "./description.mdx";
```

Nothing else changes. `src/pages.ts` still points `component:` at
`Description` exactly as it did before; it has no idea whether that name
came from a `.tsx` file or a `.mdx` file.

## 4. The day-to-day workflow

This is the actual pathway content moves through on this team:

**For the programmer, when a page needs something new:**

1. Build an ordinary React component in `src/components/`, accepting
   props for whatever varies (a title, a list of items, an image).
2. Add one import and one line to `src/mdx-components.ts`.
3. Tell whoever's writing that page what the component is called and what
   it expects, or just drop an example straight into the page for them.

That's the entire integration step. The component itself can be as simple
as [`Callout`](../src/components/Callout.tsx) (a title and some children)
or as involved as an animated diagram; from the `.mdx` author's side, both
look like a single tag.

**For everyone else, writing or editing a page:**

**Step 1:** open the relevant `.mdx` file in `src/contents/` (Web IDE, VS
Code, whichever you're comfortable with, see the
[React guide](igem-wiki-guide-react.md) §2 for both options).

**Step 2:** write the content as plain Markdown: headings, paragraphs,
lists, links, images, the same syntax covered in the
[Markdown guide](igem-wiki-guide-markdown.md).

**Step 3:** when the content calls for something the programmer has
already built (a collapsible section, a callout box, a timeline), use it
by name, exactly like any other Markdown block:

```md
<Callout title="Why this matters">

One or two sentences explaining the significance.

</Callout>
```

**Step 4:** commit. Nobody writing content ever touches `pages.ts`, the
navigation, or a single line of JSX.

**Adjusting layout:** shared page structure (the two-column content area,
whether a page shows the "Inspirations" sidebar, the header, the nav bar,
the footer) lives in a handful of components like
[`PageLayout`](../src/components/PageLayout.tsx), `Header`, `Navbar`, and
`Footer`. These are edited centrally, by the programmer, exactly once; a
change there applies to every page that uses it, so nobody has to go update
30 individual pages by hand.

## 5. When this is (and isn't) worth setting up

This pattern pays off when you have **one or two people comfortable
writing React and several who aren't**, and you want the wiki to be
visually ambitious regardless. It costs you a bit of setup (§3, maybe an
hour of work) and one ongoing responsibility: the programmer should skim
new `.mdx` pages before they land on `main`, since a malformed component
tag (a typo in the name, a missing closing tag) can break the whole site's
build, not just that one page, the same risk you'd have with raw JSX,
just confined to a smaller surface.

If your team has three or four people who can all comfortably write React,
this layer buys you less, just write `.tsx` pages directly, as the stock
template does. And if nobody on the team codes at all, skip React
entirely and use the [Markdown template](igem-wiki-guide-markdown.md) or
[HTML/CSS/JS template](igem-wiki-guide-html-css-js.md) guide instead.
