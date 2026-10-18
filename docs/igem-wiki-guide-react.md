# Building your iGEM wiki with the React template

**Who this is for:** anyone on an iGEM team who has little or no coding
experience and has been handed the job of writing wiki pages. This is the
most code-heavy of iGEM's three wiki templates (you're writing real
TypeScript/React, not plain text), but it's also the most powerful, and this
guide starts from zero. This team's own wiki is built on this template, so
everything here reflects how it actually works, not just the stock version.

This guide covers the official **`wiki-react-vite`** template:
https://gitlab.igem.org/templates/wiki-react-vite. If you'd rather write
plain text or plain HTML instead, see the other two guides in this folder.

## 1. The big picture: what are you actually doing?

Your wiki is a folder of files sitting in a **GitLab repository** (think:
Google Drive folder, but for code, with a history of every change). The
parts that matter to you:

```
src/
|-- contents/
|   |-- home.tsx          (one component file per wiki page)
|   |-- description.tsx
|   |-- index.tsx         (re-exports every page component, see Step 2 below)
|   `-- ... (one .tsx file per page)
|-- components/           (reusable pieces: Navbar, Footer, Callout, etc.)
|-- pages.ts               (registers each page: path, title, which component)
`-- containers/App/App.css (global custom CSS)
```

Each page is a small **React component**, a JavaScript function that
returns the HTML-like markup for that page. "Saving and publishing" your
change means:

1. You edit a `.tsx` file.
2. You **commit** it (GitLab's word for "save this change, with a note about
   what you changed") to the `main` branch.
3. A robot (GitLab's automated pipeline) compiles your React code into an
   actual website and publishes it. This happens automatically within about
   30 seconds to a couple of minutes of you committing.

## 2. Where to actually edit files

Unlike the Markdown and HTML templates, React code needs to be **compiled**
before a browser can show it, so you genuinely benefit from running it
locally while you work, rather than editing blind and waiting for each
commit to deploy.

**Option A: GitLab's Web IDE (zero install, but no live preview).** You can
open your repository on gitlab.igem.org, click **Edit, then Web IDE**, and
edit `.tsx` files right there. Fine for small text tweaks, but you won't see
what your change actually looks like until you commit and wait for the site
to rebuild, which gets slow and frustrating for real page-building.

**Option B: VS Code with a local dev server (recommended for this
template).** This gives you a live preview that updates the instant you
save a file.

**Step 1:** install [Node.js](https://nodejs.org) (version 20.19 or later),
[VS Code](https://code.visualstudio.com), and [Git](https://git-scm.com/downloads).

**Step 2:** clone your team's repo and install dependencies:

```bash
git clone https://gitlab.igem.org/<your-team-repo>.git
cd <your-team-repo>
yarn install
```

**Step 3:** start the dev server:

```bash
yarn run dev
```

Open the `localhost` URL it prints; the page refreshes automatically every
time you save a file.

**Step 4:** edit files in VS Code, watch the browser update, then commit
and push when you're happy (VS Code's **Source Control** tab, or `git` from
a terminal).

Nobody has to be a React expert to do this; `yarn install` and `yarn run
dev` are the only two commands you actually need to remember.

## 3. JSX, explained from zero

React pages are written in **JSX**, which looks like HTML but lives inside a
JavaScript/TypeScript function. A page component looks like this:

```tsx
export function Description() {
  return (
    <div className="row">
      <div className="col">
        <h2>Our Project</h2>
        <hr />
        <p>Explain what your project does here.</p>
      </div>
    </div>
  );
}
```

Everything you know from the HTML/CSS/JS guide mostly carries over
(`<h2>`, `<p>`, `<ul>`/`<li>`, `<a href="...">`, Bootstrap's `row`/`col`
grid), with a few JSX-specific rules:

- Use **`className`** instead of `class` (because `class` is a reserved
  word in JavaScript).
- **Every tag must be closed**, even ones that don't need it in plain HTML:
  `<img ... />` and `<hr />`, not `<img ...>` or `<hr>`.
- A component can only return **one** outer element.
- Curly braces `{ }` let you drop real JavaScript values into your markup.

If you have several side-by-side elements with nothing natural to wrap them,
use an empty `<>...</>` wrapper (called a "Fragment") instead of a `<div>`:

```tsx
return (
  <>
    <h2>First section</h2>
    <h2>Second section</h2>
  </>
);
```

And curly braces in action, for dropping a JavaScript value into your markup:

```tsx
const projectName = "EMPOWER";
return <h1>Welcome to {projectName}</h1>;
```

### Repeating content with `.map()`

Instead of copy-pasting a list item for every team member, you loop over an
array:

```tsx
const members = ["Alice", "Bo", "Chen"];

return (
  <ul>
    {members.map((name) => (
      <li key={name}>{name}</li>
    ))}
  </ul>
);
```

Read it as "for each name in `members`, produce one `<li>`." The `key`
attribute just has to be something unique per item; React uses it
internally and won't render correctly without it.

## 4. Reusable components

This repo already has ready-made pieces in `src/components/`, like
`Callout` for a highlighted note box. Using one looks just like using an
HTML tag, except you pass it data through **props** (attributes):

```tsx
<Callout title="Fun Fact">
  Our hydrolase candidate works even at low bile salt concentrations.
</Callout>
```

Browse `src/components/` before building something from scratch; there's a
good chance a similar box, card, or layout piece already exists.

## 5. CSS basics: changing how things look

Global custom styles live in `src/containers/App/App.css`. A CSS rule has a
**selector** (what to style) and **declarations** (how to style it):

```css
.bd-callout {
  padding: 1.25rem;
  border-left-width: 0.25rem;
}
```

`.bd-callout` targets any tag with `className="bd-callout"`. You can also
give a component its own CSS file, imported at the top of that `.tsx` file,
if you want styling that only applies there. Either way, you don't need to
memorize CSS properties; describe what you want and look it up (or ask an
AI assistant, see §8) when you need something specific.

## 6. Basic interactivity with `useState`

Most interactivity (dropdowns, the mobile nav toggle, modals) is already
handled by Bootstrap. For something custom, like a button that reveals more
text, React uses a `useState` hook to remember whether something is
currently shown:

```tsx
import { useState } from "react";

export function ExpandableNote() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Show more</button>
      {isOpen && <p>Here is the extra detail.</p>}
    </div>
  );
}
```

Read it as: "`isOpen` starts as `false`; clicking the button sets it to
`true`; and `{isOpen && <p>...}` means 'only show this paragraph when
`isOpen` is true'." That one pattern covers most of what a beginner needs.

## 7. Adding a brand-new page

**Step 1:** create `src/contents/my-new-page.tsx` with a component, following
the pattern in §3.

**Step 2:** re-export it from `src/contents/index.tsx`, so other files can
import it:

```tsx
export { MyNewPage } from "./my-new-page.tsx";
```

**Step 3:** register it in `src/pages.ts`, importing it at the top and
adding an entry to the `Pages` array:

```ts
{
  name: "My New Page",
  title: "My New Page",
  path: "/my-new-page",
  component: MyNewPage,
  lead: "One sentence describing what this page covers.",
},
```

That's it; unlike the other two templates, you don't manually edit a
navigation file. The nav bar and the page routing are both generated
automatically from this same `Pages` array.

## 8. The iGEM-specific rules (these apply no matter which template you use)

These aren't optional style choices; they're judging/competition
requirements:

- **Images, icons, and fonts can't just be linked from anywhere.** Upload
  them first through [the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads),
  which gives you back a URL on `static.igem.wiki`. *Only then* use it as
  `<img src="..." alt="..." />`. Why: iGEM archives wikis permanently, and a
  link to some random external site could break or disappear later; their
  own server never will.
- **Videos must come from [iGEM Video Universe](https://video.igem.org)**,
  not YouTube/Vimeo. Upload there first, then embed it in your `.tsx` page.
  See the [Video & Audio guidance](https://teams.igem.org/go/deliverables/wiki/videos-and-audios)
  for the exact steps.
- **No external CDNs**: don't add a font `<link>` or a `<script src="...">`
  pointing at some other site's server. Every single thing your site loads
  (fonts, CSS, JS, images) has to be hosted on iGEM's own servers, or
  bundled into your project through `yarn add` like the libraries already
  in `package.json`.
- **Every page must show the license and a link back to your GitLab
  repository in the footer.** `src/components/Footer.tsx` already does
  this. Just don't delete or edit that part, and don't touch the `LICENSE`
  file at all. Judges check for this.

## 9. Using an AI assistant (e.g. Claude) to help you code the wiki

Anthropic has sponsored iGEM teams with free Claude access in past seasons.
If that continues for your season and your team gets Claude Pro or Claude
Code, **use it**, especially on this template. React has a real learning
curve for a beginner, and an AI assistant is well suited to exactly the
kind of small, self-contained problems it throws at you.

What it's genuinely useful for here:

- Writing a new page component from a plain-English description of what it
  should contain
- Explaining what a chunk of unfamiliar JSX/TypeScript does before you
  change it
- Debugging an error message from `yarn run dev` that means nothing to you
  yet
- Adding simple interactivity (an expandable section, a tab switcher) from
  a plain-English description
- Finding whether a component you need already exists in `src/components/`

**If you're using Claude Code** (the CLI/IDE tool), open this repository as
the working directory. It automatically reads `CLAUDE.md` and
`.claude/RESPONSIBLE_AI_USE.md`, so it already knows this project's rules
(don't touch the license/footer, no external CDNs, images via the uploads
tool, etc.) without you having to repeat them.

**If you're using claude.ai (web chat) instead**, it won't see those files
automatically, so paste in the relevant bits yourself, e.g. "Here's our
page template's rules: [paste `.claude/RESPONSIBLE_AI_USE.md`]. Write a
`description.tsx` page about our project following this structure: [paste
an existing page as an example]."

A few ground rules, straight from this repo's own
[`.claude/RESPONSIBLE_AI_USE.md`](../.claude/RESPONSIBLE_AI_USE.md):

- **You're accountable, not the AI.** Judges evaluate your team's work, so
  you need to be able to explain and defend every page, even one an
  assistant helped write.
- **Never let it invent results, data, or citations.** Every scientific claim
  on the wiki has to come from work your team actually did.
- **Read before you commit.** Review and understand anything an AI writes
  for you before it goes live; don't commit something you can't explain.

## 10. Quick checklist before you commit

- [ ] New/edited page has a component in `src/contents/`, is re-exported
      from `src/contents/index.tsx`, and is registered in `src/pages.ts`
- [ ] Every image/font URL starts with `static.igem.wiki` (from the uploads
      tool)
- [ ] Any video is embedded from iGEM Video Universe, not YouTube/Vimeo
- [ ] I haven't linked to any external CDN for fonts/CSS/JS
- [ ] The footer's license + repo link (`src/components/Footer.tsx`) and
      the `LICENSE` file are untouched
- [ ] I previewed the page with `yarn run dev`, or via the Web IDE, before
      committing to `main`

For the current, official requirements, always check
[teams.igem.org/go/deliverables/wiki](https://teams.igem.org/go/deliverables/wiki).
Rules can be updated between seasons.
