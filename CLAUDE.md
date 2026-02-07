# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hexo 7.3.0 blog (FoundraLab, https://foundra.me) with a custom theme `hexo-deveye`. Content is primarily in Chinese (zh-CN). The blog covers AI tools and tech news.

## Commands

```bash
# Local preview (localhost:4000)
hexo s                        # hexo server

# Generate static files to public/
hexo g                        # hexo generate
hexo g -w                     # watch files and regenerate automatically
hexo g -f                     # force regenerate

# Clean cache and generated files (db.json + public/)
hexo clean

# Deploy to GitHub Pages (git@github.com:hellodeveye/blog.git, master branch)
hexo d                        # hexo deploy
hexo d -g                     # generate then deploy (same as hexo g && hexo d)

# Common combo: clean → generate → deploy
hexo clean && hexo g && hexo d

# Create content
hexo new "Post Title"         # new post → source/_posts/
hexo new draft "Draft Title"  # new draft → source/_drafts/
hexo new page "Page Title"    # new page → source/
hexo publish "Draft Title"    # publish draft → move from _drafts to _posts

# Tailwind CSS build (needed when changing theme styles)
npm run build:css             # one-off build
npm run watch:css             # watch mode
```

## Architecture

### Configuration

- `_config.yml` — Main Hexo config (site metadata, permalink format, plugins, deployment, markdown-it settings)
- `themes/hexo-deveye/_config.yml` — Theme config (menu, widgets, footer, avatar, social links)

### Theme: hexo-deveye

- **Templates**: `themes/hexo-deveye/layout/` — EJS templates. `layout.ejs` is the root wrapper; `_partial/` contains shared components (head, header, footer, sidebar, toc)
- **Styles**: Tailwind CSS. Source at `themes/hexo-deveye/source/css/tailwind.css`, compiled to `main.css`. Tailwind config is at `tailwind.config.js` (custom color palette, fonts: Lora, Poppins, JetBrains Mono)
- **JS**: `themes/hexo-deveye/source/js/plugins.js` handles dark mode (localStorage), lazy loading, mobile menu, back-to-top
- **Icons**: `themes/hexo-deveye/scripts/icons.js` — Hexo helper providing inline SVG Heroicons via `<%- icon('name') %>` in EJS
- **i18n**: `themes/hexo-deveye/languages/` — 12 language files

### Content

- Posts live in `source/_posts/` as Markdown with YAML frontmatter (`title`, `date`, `tags`, `categories`)
- Post scaffold: `scaffolds/post.md`
- Markdown rendered by `hexo-renderer-markdown-it` with plugins: abbr, footnote, ins, sub, sup
- Mermaid diagrams supported via `hexo-filter-mermaid-diagrams` (lazy-loaded, v11.7.0)
- RSS feed at `/atom.xml` (title-only, no full content)
- Search via `hexo-generator-searchdb` (JSON, title-only)

### CSS Build Pipeline

Tailwind CSS source → PostCSS → compiled `main.css`. When modifying styles:
1. Edit `themes/hexo-deveye/source/css/tailwind.css` or use Tailwind classes in EJS templates
2. Run `npm run build:css` (one-off build) or `npm run watch:css` (watch mode)
3. The compiled `themes/hexo-deveye/source/css/main.css` is checked into git

### Git Branching

- Working branch: `hexo` (source content and theme)
- Deploy branch: `master` (generated static files, managed by `hexo deploy`)
