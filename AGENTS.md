# Project guide for coding agents

## Overview and structure

This is David Nuñez's personal software engineering blog, built with Eleventy 3,
JavaScript ES modules, Markdown, Nunjucks, and plain CSS. It is a static site;
there is no application server or frontend framework.

- `eleventy.config.js`: plugins, drafts, asset copying, CSS minification, Atom
  feed, shortcodes, and HTML transforms. Input is `src/content`; output is `_site`.
- `src/content/`: pages, archive, tags, sitemap, and feed stylesheet.
- `src/content/blog/`: posts; `blog.11tydata.js` assigns the `posts` collection and
  `layouts/post.njk`. Article folders may contain images and standalone Go examples.
- `src/_includes/`: Nunjucks layouts and reusable `postslist.njk`.
- `src/_data/metadata.js`: site title, description, language, author, and URL.
- `src/_config/`: Luxon date/collection filters and custom Go Prism grammar.
- `public/css/`: source styles. `index.css` defines the Gruvbox-inspired palette,
  typography, and responsive layout; `404.css` and `prism-diff.css` are inlined.
- `.github/workflows/gh-pages.yml`: builds and deploys `_site` to GitHub Pages.
- `.skillshare/config.yaml`: shared agent skill sources and sync targets.

## Setup and verification

Use Node.js 22 (matching CI) and pnpm; preserve `pnpm-lock.yaml` and do not add
npm/yarn lockfiles. The lockfile uses pnpm's v9 format; the package does not pin a
pnpm version.

```sh
pnpm install --frozen-lockfile
pnpm start                 # Development server with watch
pnpm build                 # Production build
pnpm run build-ghpages     # CI build entry point
pnpm run debug             # Eleventy debug logging
pnpm run benchmark         # Eleventy benchmark logging
```

The scripts currently use `pnpm dlx @11ty/eleventy`, which can download an
Eleventy version independently of the lockfile. For a build using the installed
dependency, use `pnpm exec eleventy`. Do not silently change this behavior while
working on unrelated tasks.

There are no configured test, lint, or formatter scripts. For site changes, run
a production build and inspect the affected output. For visual changes, also
check desktop and mobile layouts, navigation, keyboard focus, long code blocks,
and browser console errors. Check archive/tag links, sitemap, and Atom feed when
changing collections, dates, URLs, or metadata. Report checks that could not run.
Documentation-only changes need a diff/command review, not a new test framework.

## Content and implementation conventions

- Follow `.editorconfig`: UTF-8, LF, tabs with width 4, final newline, no trailing
  whitespace. YAML must use spaces; follow existing two-space YAML indentation.
- Keep JavaScript in ES module form and match surrounding style. Avoid unrelated
  formatting, dependency upgrades, or changes to the author's prose.
- New posts should provide `title`, `description`, `date`, and topical `tags` in
  YAML front matter. The blog directory supplies the layout and `posts` tag.
  `draft: true` excludes a post in build mode but permits development previews.
- Markdown is processed with Nunjucks. Use `{% raw %}` / `{% endraw %}` around
  examples containing literal template delimiters when necessary.
- Blog images are explicitly copied by an image-extension glob. `public/` is
  **not** copied wholesale: adding a static asset may require a passthrough rule.
  Go examples under articles are separate modules, not part of the site build.
- Edit CSS in `public/css`, never generated `_site/css`. Configuration clears
  `_site/css` and minifies `index.css` after builds; other styles use the
  `includeMinifiedCSS` shortcode. Do not edit or commit `_site`, `node_modules`,
  or `.cache`.
- Preserve the existing blog's visual identity and CSS variables unless a
  redesign is requested. Prefer semantic HTML and accessible, responsive CSS.
- Syntax highlighting uses Prism, including a custom `golang` grammar. Mermaid
  renders in the browser through a CDN module; fonts also require network access.
- An HTML transform wraps occurrences of `trypanic` in a span. Inspect generated
  markup when changing branding or content that interacts with that transform.
- `CNAME` currently contains `trypanic.com`, while metadata and feed configuration
  use `https://trypanic.github.io`. Treat this as an existing discrepancy; review
  all three locations together when an intentional domain change is requested.

## Git and deployment

Check `git status` before editing and preserve existing work. Stage only files
for the current task.

Before starting any new change, read and apply the `conventional-branch` skill
and create a task branch instead of editing directly on `main`. Use
`<type>/<description>` with an appropriate prefix (`feature/`, `bugfix/`,
`hotfix/`, `release/`, or `chore/`) and a concise lowercase kebab-case description,
such as `chore/update-agent-guidance`. Follow the skill's naming rules for release
versions. Reuse the current task branch for follow-up changes to the same task;
do not create a new branch for every iteration. Explicit user instructions about
branch selection take precedence.

Use the commit skills when a commit is requested. Creating a task branch does
not itself authorize committing or pushing changes.

CI runs on pushes to `main` and manual dispatch; its deployment step is restricted
to `main`. Pushing there can publish the site. Keep deployment changes explicit.

## Shared skills with Skillshare

Use [Skillshare](https://github.com/runkids/skillshare) in **project mode** from
the repository root. Setup was verified with version 0.21.1. Install the CLI
using the official macOS/Linux installer (or `brew install skillshare`):

```sh
curl -fsSL https://raw.githubusercontent.com/runkids/skillshare/main/install.sh -o /tmp/install-skillshare.sh
mkdir -p "$HOME/.local/bin"
INSTALL_DIR="$HOME/.local/bin" sh /tmp/install-skillshare.sh
export PATH="$HOME/.local/bin:$PATH"
skillshare version
skillshare install -p
skillshare sync -p
skillshare status -p
```

Persist the PATH setting in your shell configuration if needed. If a broken
tool-manager shim shadows the executable, use `~/.local/bin/skillshare` directly.
The repository is already initialized; do not rerun `init` for a fresh clone.
`install -p` restores the skills declared in the committed config, and `sync -p`
links them into `.agents/skills` (Codex), `.claude/skills` (Claude Code), and
`.github/skills` (Copilot). Reload the agent session if new skills are not visible.

| Skill                 | Use                                              | Source revision                     |
| --------------------- | ------------------------------------------------ | ----------------------------------- |
| `conventional-commit` | Conventional Commit message guidance             | awesome-copilot `HEAD`              |
| `anti-ui-slop`        | UI reference and design guidance                 | awesome-copilot pinned commit below |
| `chrome-devtools`     | Browser debugging through Chrome DevTools MCP    | awesome-copilot pinned commit below |
| `conventional-branch` | Branch naming                                    | awesome-copilot pinned commit below |
| `git-commit`          | Reviewing, staging, and making requested commits | awesome-copilot pinned commit below |
| `frontend-design`     | Frontend design implementation                   | anthropics/skills `main`            |

The four pinned skills use commit
`4f4796f0bf30e105700f97ed8408c12b6aa95e06`. Exact source URLs live in
`.skillshare/config.yaml`. Preserve those revisions unless an update is requested;
`HEAD` and `main` sources can change between installations. Read the relevant
`SKILL.md` before applying a skill, and reconcile general advice with this site's
existing design and explicit user instructions. The Chrome DevTools skill does
not install its MCP server; it requires that tool to be connected separately.

Useful commands for later iterations:

```sh
skillshare list -p
skillshare target list -p --no-tui
skillshare install -p                 # Restore missing skills from config
skillshare sync -p --dry-run          # Preview target changes
skillshare sync -p
skillshare status -p
skillshare doctor -p
skillshare audit -p
skillshare update -p --all --dry-run
skillshare update -p conventional-commit frontend-design
skillshare sync -p                    # Sync after a deliberate update
skillshare target add cursor -p       # Optional additional agent
skillshare sync -p
```

To add a skill, run `skillshare install -p <repository-or-skill-URL>`, inspect the
resulting config and audit output, then sync. To remove one, use
`skillshare uninstall -p <name>` and sync. To change a pinned revision, uninstall
that skill, install its new full GitHub `tree/<revision>/skills/<name>` URL,
review the config change, and sync.

If an agent cannot discover symlinked skills, use
`skillshare target <target> --mode copy -p` and then `skillshare sync -p`.

Commit `.skillshare/config.yaml` and `.skillshare/.gitignore`; remote downloads,
logs, caches, and generated target links are local artifacts. Do not edit a
synced link expecting a private copy: it points back to the source skill.
Use `-p` explicitly to avoid modifying global skill configuration.
