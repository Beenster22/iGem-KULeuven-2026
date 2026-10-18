# Building your iGEM wiki with the Markdown template

**Who this is for:** anyone on an iGEM team who has little or no coding
experience and has been handed the job of writing wiki pages. You don't need
to know programming to use this template. If you've ever formatted text in a
Word doc or a Reddit/Discord post, you already know most of what you need.

This guide covers the official **`wiki-frozen-flask-markdown`** template
(https://gitlab.igem.org/templates/wiki-frozen-flask-markdown), the simplest
of iGEM's three wiki templates, because your content is just text files with
some light formatting, not real code.

## 1. The big picture: what are you actually doing?

Your wiki is a folder of files sitting in a **GitLab repository** (think:
Google Drive folder, but for code, with a history of every change). Most of
that folder is scaffolding you'll never touch. The one part that matters to
you is the `docs/` folder: it has one file per wiki page:

```
docs/
├── home.md
├── description.md
├── team.md
├── safety-and-security.md
└── ... (one .md file per page)
```

Each `.md` file is **plain text**: you just type into it. "Saving and
publishing" your change means:

1. You edit a `.md` file.
2. You **commit** it (GitLab's word for "save this change, with a note about
   what you changed") to the `main` branch.
3. A robot (GitLab's automated pipeline) turns your text files into an actual
   website and publishes it. This happens automatically within about 30
   seconds of you committing. You never touch a web server yourself.

That's the whole loop: **edit text → commit → wait 30 seconds → check the
live site.**

## 2. Where to actually edit files

You've got three options, roughly in order of "least setup" to "most setup".
Pick whichever one matches your comfort level; none of them is more "correct"
than another.

**Option A: GitLab's Web IDE (zero install).** Open your repository on
gitlab.igem.org in a browser, click **Edit, then Web IDE**, and you get a
text editor right there in your browser tab. Edit a file, then commit from
inside the Web IDE. This is the easiest path if you're not comfortable
installing anything.

**Option B: a code editor like VS Code (nicer editing, still simple).**
[VS Code](https://code.visualstudio.com) is a free, widely-used text editor
with much better Markdown support than a browser text box: live preview,
spell-check extensions, and it highlights your syntax so a missing `]` or
backtick is easy to spot. To use it:

1. Install VS Code and [Git](https://git-scm.com/downloads).
2. Clone your team's repo (in VS Code: `File > Open Folder`, or from a
   terminal: `git clone https://gitlab.igem.org/<your-team-repo>.git`).
3. Edit `.md` files directly in VS Code, you'll get syntax highlighting for
   free, and VS Code's Markdown preview pane (`Ctrl+Shift+V`) shows roughly
   how your page will look.
4. Commit and push your changes using VS Code's built-in **Source Control**
   tab (or `git add`, `git commit`, `git push` from a terminal, if you
   prefer).

This still doesn't require installing Python; you're only editing and
pushing text files. GitLab builds and publishes the site for you either way.

**Option C: a full local preview with Python (optional, for
double-checking formatting before it goes live).** This is the only option
that needs real "setup", and nobody needs to do it just to write a page:

```bash
git clone https://gitlab.igem.org/<your-team-repo>.git
cd <your-team-repo>
python3 -m venv venv
. venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r dependencies.txt
python app.py              # open http://localhost:8080 in your browser
```

## 3. Markdown, explained from zero

Markdown is a way of writing formatted text (headings, bold, lists, links)
using plain symbols instead of toolbar buttons, because the computer later
converts your text into a real web page automatically. Below is everything
you need for 95% of a wiki page.

**Leave a blank line between paragraphs.** A single line break is ignored:
Markdown only starts a new paragraph after an empty line.

```md
This is one paragraph. It can span
several lines in your editor and it will still
be treated as one paragraph.

This is a second paragraph, because there's a blank line above it.
```

**Headings**: a page section title. More `#` = smaller heading:

```md
## A main section
### A smaller sub-section
```
(You generally don't need a single `#` top heading. The page title is
generated automatically from the filename.)

**Bold, italic, inline code:**

```md
**This is bold.** *This is italic.* `This looks like code.`
```

**Lists:**

```md
- A bullet point
- Another bullet point
  - An indented sub-point (indent with 2 spaces)

1. A numbered step
2. Another numbered step
```

**Links:**

```md
[Click here to read the iGEM rules](https://competition.igem.org)
```

**Images** (see §5 below for the iGEM-specific part; you can't just link
any image URL):

```md
![Cloning workflow photo](https://static.igem.wiki/teams/0000/cloning.png)
```

**A quote block**, useful for pulling out a key sentence:

```md
> Safety isn't a checkbox; it's a mindset we built into every protocol.
```

**A table:**

```md
| Strain         | Plasmid | Result   |
| -------------- | ------- | -------- |
| *E. coli* K-12 | pSB1C3  | Positive |
```

**A code block** (for actual code/sequences, keeps spacing and monospacing):

````md
```
ATGACCATGATTACGGATTCA...
```
````

**A horizontal line**, to visually separate sections:

```md
---
```

### A few extra tricks this template supports

- Typing `[TOC]` on its own line auto-generates a clickable table of contents
  from your headings, handy on long pages like Notebook or Protocols.
- Straight quotes and dashes are automatically turned into "nicer" typographic
  ones, so you don't need to worry about that.

**Footnotes/citations**, for referencing a paper:

```md
Our hydrolase candidate reduced bile salt levels significantly[^ref1].

[^ref1]: Smith et al. (2024). *Title of the paper*. Journal Name.
    https://doi.org/10.xxxx/xxxxx
```

If Markdown genuinely can't do something you need (e.g. sizing an image), you
can drop in a raw HTML tag and it'll just work:

```html
<img src="https://static.igem.wiki/teams/0000/cloning.png"
     alt="Cloning workflow photo" class="img-fluid">
```

## 4. Adding a brand-new page

**Step 1:** In `docs/`, create a new file, e.g. `docs/my-new-page.md`, and
write your content in it using the Markdown above. The page will
automatically be reachable; no extra setup is needed to make the file
"exist" as a page.

**Step 2:** Add a link to it in the navigation menu, in `wiki/menu.html`.
This one file has some real code in it, just copy an existing link and
change the two `my-new-page` bits and the visible text:

```html
<a class="nav-link" href="{{ url_for('pages', page='my-new-page') }}">My New Page</a>
```

**Step 3** *(optional)*: add a one-sentence subtitle shown under the big
page header, in `wiki/base.html`. Find the list near the top and add a line
like:

```
"/my-new-page": "One sentence describing what this page covers.",
```

The page title shown to visitors is generated automatically from the
filename, so `safety-and-security.md` becomes "Safety And Security" with no
extra work.

## 5. The iGEM-specific rules (these apply no matter which template you use)

These aren't optional style choices; they're judging/competition
requirements:

- **Images, icons, and fonts can't just be linked from anywhere.** Upload
  them first through [the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads),
  which gives you back a URL on `static.igem.wiki`. *Only then* paste that
  URL into your page with the `![...](...)` syntax from §3. Why: iGEM
  archives wikis permanently, and a link to some random external site could
  break or disappear later; their own server never will.
- **Videos must come from [iGEM Video Universe](https://video.igem.org)**,
  not YouTube/Vimeo. Upload there first, then paste the embed code it gives
  you straight into your `.md` file (same archiving reason as above). See the
  [Video & Audio guidance](https://teams.igem.org/go/deliverables/wiki/videos-and-audios)
  for the exact steps.
- **No external CDNs**: don't add a `<link>` to Google Fonts, or a `<script>`
  from some JavaScript library's website, etc. Every single thing your site
  loads (fonts, CSS, JS, images) has to be hosted on iGEM's own servers.
- **Every page must show the license and a link back to your GitLab
  repository in the footer.** The template already does this in
  `wiki/footer.html`. Just don't delete or edit that part, and don't touch
  the `LICENSE` file at all. Judges check for this.

## 6. Using an AI assistant (e.g. Claude) to help you code the wiki

Anthropic has sponsored iGEM teams with free Claude access in past seasons. If
that continues for your season and your team gets Claude Pro or Claude Code,
**use it**, especially if nobody on your team codes. It's well suited to a
template like this one.

What it's genuinely useful for on a wiki like this:

- Turning a rough paragraph of notes into clean, properly-formatted Markdown
- Writing a `wiki/menu.html` nav link, or any other small real-code change,
  if that one part feels intimidating
- Explaining what a piece of template code does before you change it
- Debugging a page that "looks broken": paste the `.md` text in and ask what's
  wrong
- Reformatting data you already have into a table

**If you're using Claude Code** (the CLI/IDE tool), open this repository as
the working directory. It automatically reads `CLAUDE.md` and
`.claude/RESPONSIBLE_AI_USE.md`, so it already knows this project's rules
(don't touch the license/footer, no external CDNs, images via the uploads
tool, etc.) without you having to repeat them.

**If you're using claude.ai (web chat) instead**, it won't see those files
automatically, so paste in the relevant bits yourself, e.g. "Here's our
page template's rules: [paste `.claude/RESPONSIBLE_AI_USE.md`]. Write a
`description.md` page about our project following standard Markdown."

A few ground rules, straight from this repo's own
[`.claude/RESPONSIBLE_AI_USE.md`](../.claude/RESPONSIBLE_AI_USE.md):

- **You're accountable, not the AI.** Judges evaluate your team's work, so
  you need to be able to explain and defend every page, even one an
  assistant helped write.
- **Never let it invent results, data, or citations.** Every scientific claim
  on the wiki has to come from work your team actually did.
- **Read before you commit.** Review and understand anything an AI writes
  for you before it goes live, don't commit something you can't explain.

## 7. Quick checklist before you commit

- [ ] My new/edited page is a `.md` file in `docs/` and is linked in `wiki/menu.html`
- [ ] Every image/font URL starts with `static.igem.wiki` (from the uploads tool)
- [ ] Any video is embedded from iGEM Video Universe, not YouTube/Vimeo
- [ ] I haven't linked to any external CDN for fonts/CSS/JS
- [ ] The footer's license + repo link and the `LICENSE` file are untouched
- [ ] I previewed the page (Web IDE preview, or locally) before committing to `main`

For the current, official requirements, always check
[teams.igem.org/go/deliverables/wiki](https://teams.igem.org/go/deliverables/wiki).
Rules can be updated between seasons.
