# Building your iGEM wiki with the HTML/CSS/JS template

**Who this is for:** anyone on an iGEM team who has little or no coding
experience and has been handed the job of writing wiki pages. This guide
starts from zero: what a tag is, what a class is, where to type things. You
will be writing a bit of real code on this template (more than the Markdown
option), but nothing here requires a computer science background.

This guide covers the official **`wiki-frozen-flask`** template:
https://gitlab.igem.org/templates/wiki-frozen-flask, iGEM's "classic" wiki
option. Instead of plain text files (like the Markdown template), your pages
are HTML files, so you get full control over layout, styling, and
interactivity, at the cost of a slightly steeper learning curve.

## 1. The big picture: what are you actually doing?

Your wiki is a folder of files sitting in a **GitLab repository** (think:
Google Drive folder, but for code, with a history of every change). The part
that matters to you is `wiki/pages/`, one HTML file per wiki page:

```
wiki/
|-- layout.html         (shared page frame: nav bar, header, footer)
|-- menu.html            (the navigation links)
|-- footer.html           (the footer, license + repo link)
`-- pages/
    |-- home.html
    |-- description.html
    `-- ... (one .html file per page)
static/
|-- style.css             (your custom styling)
`-- ... (Bootstrap CSS/JS files, already included)
```

"Saving and publishing" your change means:

1. You edit an `.html` (or `.css`) file.
2. You **commit** it (GitLab's word for "save this change, with a note about
   what you changed") to the `main` branch.
3. A robot (GitLab's automated pipeline) turns your files into an actual
   website and publishes it. This happens automatically within about 30
   seconds of you committing. You never touch a web server yourself.

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
with proper HTML/CSS/JS support: it highlights your tags so a missing `</div>`
or stray quote is easy to spot, auto-closes tags as you type, and has an
extension (Live Server) that refreshes a browser preview every time you
save. To use it:

1. Install VS Code and [Git](https://git-scm.com/downloads).
2. Clone your team's repo (in VS Code: `File > Open Folder`, or from a
   terminal: `git clone https://gitlab.igem.org/<your-team-repo>.git`).
3. Edit `.html`/`.css`/`.js` files directly in VS Code; you get syntax
   highlighting and tag auto-completion for free.
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

## 3. HTML, explained from zero

HTML describes the *structure* of a page using **tags**. A tag usually comes
in an opening and closing pair, wrapping the content it applies to:

```html
<p>This is a paragraph of text.</p>
<strong>This text is bold.</strong>
<em>This text is italic.</em>
```

Tags can be **nested** inside each other, and many tags take **attributes**
(extra settings written inside the opening tag):

```html
<a href="https://competition.igem.org">Click here to read the iGEM rules</a>
<img src="https://static.igem.wiki/teams/0000/cloning.png" alt="Cloning workflow photo">
```

`href` is "where this link goes", `src` is "which image to load", `alt` is a
text description (for screen readers and for when the image fails to load).
A tag like `<img>` has no separate closing tag; it's self-contained.

### Tags you'll use constantly

Headings (bigger number = smaller heading):

```html
<h2>A main section</h2>
<h3>A smaller sub-section</h3>
```

Lists:

```html
<ul>
  <li>A bullet point</li>
  <li>Another bullet point</li>
</ul>

<ol>
  <li>A numbered step</li>
  <li>Another numbered step</li>
</ol>
```

A table:

```html
<table>
  <tr><th>Strain</th><th>Plasmid</th><th>Result</th></tr>
  <tr><td>E. coli K-12</td><td>pSB1C3</td><td>Positive</td></tr>
</table>
```

A horizontal rule, to visually separate sections:

```html
<hr>
```

### Classes, and Bootstrap's grid

This template includes **Bootstrap**, a library of ready-made CSS classes,
so you rarely have to write layout CSS yourself. The `class="..."` attribute
is how you apply those styles to a tag. The most important pattern is the
**grid**: wrap content in a `row`, split it into up to 12 `col` units:

```html
<div class="row">
  <div class="col-lg-8">
    <p>Main content, takes up 8 of 12 columns on large screens.</p>
  </div>
  <div class="col-lg-4">
    <p>Sidebar content, takes up the remaining 4 columns.</p>
  </div>
</div>
```

A `<div>` is just a generic box with no visual meaning of its own; it's there
to be styled or positioned. You'll see it constantly for grouping content.
Browse [getbootstrap.com's components](https://getbootstrap.com/docs/5.3/components)
for ready-made things to paste in (callout boxes, cards, alerts, buttons)
without writing any CSS at all.

## 4. This template's page structure (Jinja blocks)

Every page in `wiki/pages/` is a small file that fills in three "blocks" of
the shared layout (`wiki/layout.html`), rather than being a full HTML
document on its own:

```html
{% extends "layout.html" %}

{% block title %}Page Name{% endblock %}
{% block lead %}One sentence shown under the big page header.{% endblock %}

{% block page_content %}

<div class="row">
  <div class="col">
    <h2>Your Heading</h2>
    <hr>
    <p>Your actual content goes here.</p>
  </div>
</div>

{% endblock %}
```

The `{% ... %}` syntax is **Jinja**, the templating language the Python
backend uses to stitch pages together; you don't need to understand how it
works, just that these three blocks (`title`, `lead`, `page_content`) are
where your content goes, and everything else on the page (nav bar, header,
footer) is handled for you by `wiki/layout.html`.

## 5. CSS basics: changing how things look

CSS controls color, spacing, fonts, and layout. This template's custom
styles live in `static/style.css`. A CSS rule has a **selector** (what to
style) and **declarations** (how to style it):

```css
.bd-callout {
  padding: 1.25rem;
  border-left-width: 0.25rem;
  border-radius: 0.25rem;
}
```

`.bd-callout` targets any tag with `class="bd-callout"`. To use a custom
style you've added, give the tag that class:

```html
<div class="bd-callout">Some important note.</div>
```

You don't need to memorize CSS properties; describe what you want and look
it up (or ask an AI assistant, see §7) when you need something specific.

## 6. JavaScript basics: adding interactivity

Bootstrap already handles most interactive things (dropdown menus, collapsing
the mobile nav bar, popups) with zero JavaScript of your own. You'll only
need JS for custom behavior, like a button that reveals extra text. It goes
in a `<script>` tag, usually right before `</body>` content or in its own
`.js` file in `static/`:

```html
<button id="toggle-btn">Show more</button>
<p id="extra-text" style="display:none;">Here is the extra detail.</p>

<script>
  document.getElementById("toggle-btn").addEventListener("click", function () {
    document.getElementById("extra-text").style.display = "block";
  });
</script>
```

Read it as: "find the element with this id, and when it's clicked, run this
function." That one pattern (`addEventListener("click", ...)`) covers most
of what a beginner needs on a wiki page.

## 7. Adding a brand-new page

**Step 1:** create `wiki/pages/my-new-page.html`, following the block
structure from §4 (`title`, `lead`, `page_content`).

**Step 2:** add a link to it in `wiki/menu.html`. Copy an existing link and
change the page name and visible text:

```html
<a class="nav-link" href="{{ url_for('pages', page='my-new-page') }}">My New Page</a>
```

The route (`/my-new-page`) is wired up automatically; you don't register it
anywhere else.

## 8. The iGEM-specific rules (these apply no matter which template you use)

These aren't optional style choices; they're judging/competition
requirements:

- **Images, icons, and fonts can't just be linked from anywhere.** Upload
  them first through [the uploads tool](https://teams.igem.org/go/deliverables/wiki/uploads),
  which gives you back a URL on `static.igem.wiki`. *Only then* use it as an
  `<img src="...">`. Why: iGEM archives wikis permanently, and a link to some
  random external site could break or disappear later; their own server
  never will.
- **Videos must come from [iGEM Video Universe](https://video.igem.org)**,
  not YouTube/Vimeo. Upload there first, then paste the embed code it gives
  you straight into your `.html` page. See the
  [Video & Audio guidance](https://teams.igem.org/go/deliverables/wiki/videos-and-audios)
  for the exact steps.
- **No external CDNs**: don't add a `<link>` to Google Fonts, or a
  `<script src="...">` pointing at some JavaScript library's own website,
  etc. Every single thing your site loads (fonts, CSS, JS, images) has to be
  hosted on iGEM's own servers; put any extra CSS/JS files you need in
  `static/`.
- **Every page must show the license and a link back to your GitLab
  repository in the footer.** The template already does this in
  `wiki/footer.html`. Just don't delete or edit that part, and don't touch
  the `LICENSE` file at all. Judges check for this.

## 9. Using an AI assistant (e.g. Claude) to help you code the wiki

Anthropic has sponsored iGEM teams with free Claude access in past seasons.
If that continues for your season and your team gets Claude Pro or Claude
Code, **use it**, especially on this template, since you're writing real
HTML/CSS/JS rather than plain text. It's well suited to exactly the kind of
small, self-contained problems a wiki throws at a beginner.

What it's genuinely useful for here:

- Writing the HTML for a section you can describe in plain words (e.g. "a
  three-column layout showing our team photos with captions")
- Explaining what a chunk of unfamiliar HTML/CSS/JS does before you change it
- Debugging a layout that "looks broken": paste the relevant HTML/CSS and
  ask what's wrong
- Writing small JavaScript interactions (an expandable section, a simple
  image gallery) from a plain-English description
- Finding the right Bootstrap component for something, instead of writing
  CSS from scratch

**If you're using Claude Code** (the CLI/IDE tool), open this repository as
the working directory. It automatically reads `CLAUDE.md` and
`.claude/RESPONSIBLE_AI_USE.md`, so it already knows this project's rules
(don't touch the license/footer, no external CDNs, images via the uploads
tool, etc.) without you having to repeat them.

**If you're using claude.ai (web chat) instead**, it won't see those files
automatically, so paste in the relevant bits yourself, e.g. "Here's our
page template's rules: [paste `.claude/RESPONSIBLE_AI_USE.md`]. Write a
`description.html` page about our project following this structure: [paste
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

- [ ] New/edited page follows the `{% extends "layout.html" %}` block
      structure and is linked in `wiki/menu.html`
- [ ] Every image/font URL starts with `static.igem.wiki` (from the uploads
      tool)
- [ ] Any video is embedded from iGEM Video Universe, not YouTube/Vimeo
- [ ] I haven't linked to any external CDN for fonts/CSS/JS
- [ ] The footer's license + repo link and the `LICENSE` file are untouched
- [ ] I previewed the page (Web IDE preview, or locally) before committing to
      `main`

For the current, official requirements, always check
[teams.igem.org/go/deliverables/wiki](https://teams.igem.org/go/deliverables/wiki).
Rules can be updated between seasons.
