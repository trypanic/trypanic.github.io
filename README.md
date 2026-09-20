# trypanic Blog

A personal blog built using Eleventy ([11ty](https://www.11ty.dev/)), based on the  [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) starter but refactored,  restructured, and redesigned for responsive (mobile-first in mind).

## About This Project

For coding-agent guidance, build commands, and shared skill setup, see
[AGENTS.md](AGENTS.md). After installing [Skillshare](https://github.com/runkids/skillshare),
run `skillshare install -p && skillshare sync -p` from the repository root to
restore the configured skills for Codex, Claude Code, and GitHub Copilot.

This project started with [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) and evolved into a custom blog system with a redesigned layout, streamlined folder structure, minified CSS output, and improved responsiveness.

- 🎨 Gruvbox color palette design
- 🔧 Custom folder structure for better clarity and separation of concerns
- 💡 Responsive design with custom layouts and typography
- 🧹 Minified CSS output using `clean-css` during the build process
- 🧼 Removed unused base files to simplify the codebase
- 🌐 Custom and fancy `404` page

## Project Structure

```
├── eleventy.config.js          # Eleventy configuration
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── public/                     # Public assets copied as-is to output
│   ├── css/
│   │   ├── 404.css             # Inlined in 404 HTML
│   │   ├── index.css           # Linked globally in layout
│   │   └── prism-diff.css      # Inlined in code block templates
│   └── img/                    # Static images
├── README.md
└── src/
    ├── _config/
    │   └── filters.js          # Custom filters for Eleventy
    ├── _data/
    │   └── metadata.js         # Site-wide metadata
    ├── _includes/
    │   ├── layouts/
    │   │   ├── 404.njk
    │   │   ├── base.njk
    │   │   └── post.njk
    │   └── postslist.njk       # Reusable post list component
    ├── content/                # All content pages and posts
    │   ├── 404.md
    │   ├── about.md
    │   ├── archive.njk
    │   ├── blog/
    │   │   ├── blog.11tydata.js
    │   ├── feed/
    │   │   └── pretty-atom-feed.xsl
    │   ├── index.njk
    │   ├── sitemap.xml.njk
    │   ├── tag-pages.njk
    │   └── tags.njk

```

## 🙋 Do You Want to Use It?

You're welcome to use this blog setup as a base for your own site!

### 🚀 Quick Start

1. Clone the repo
2. Install dependencies
3. Run the dev server
   1. Edit `css`files in `public/css`to add your own styles
   2. replace `trypanic` name for your onw in `eleventy.config.js`, `package.json`, `src/_data/metadata.js`
   3. update `README.md`and `src/content/about.md`files
   4. add your name in `LICENSE` file
