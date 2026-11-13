# CLAUDE.md

This file gives Claude Code the context it needs to work in this repository.

## Overview

This is the personal site of Zhizhuo Yang, a static Jekyll 4 site published with GitHub Pages from the `master` branch.
The layouts, styles and scripts are written for this site; it uses no theme.
`README.md` describes the pages, how to add a research project, a publication, a news item, a photograph or a CV change, the fonts, and the tests.
Read it before changing content.

## Commands

On the owner's Mac, prefix every Ruby command (`bundle`, and the npm scripts that call it) with `mise exec ruby@3.4.12 --`, so that Ruby 3.4 is used.
Docker is not used.

```bash
mise exec ruby@3.4.12 -- bundle exec jekyll serve   # http://localhost:4000
mise exec ruby@3.4.12 -- npm test                   # every test except Lighthouse
JEKYLL_ENV=production mise exec ruby@3.4.12 -- npm run build && npm run lighthouse
npx playwright test photography --project=chromium  # one spec file in one browser, after npm run build:test
```

The browser tests serve `_site` on port 4173 and expect the test build (`npm run build:test`), which adds the fixture pages in `_fixtures/` and sets `url` to `http://localhost:4173` so that redirects stay on the local server.

## File structure

```text
_config.yml                    site settings, collections, plugins, image sizes
_data/                         nav, contact links, research topics, papers under review, CV, photo albums
_layouts/                      default (page shell), page, home, research, project, bib (one publication)
_includes/                     head, header, footer, contact-links, picture, entry-row, analytics
_sass/                         tokens, fonts, base, layout, header, footer, and one partial per page
assets/css/main.scss           imports the partials
assets/js/                     theme-init (runs before first paint), site, research-filter, lightbox, analytics
assets/js/lib/                 pure logic with unit tests: theme, topic, gallery
assets/fonts/                  self-hosted WOFF2 files and their licences
assets/img/research/           figures and screenshots for project pages
assets/photography/<album>/    original photographs, one folder per album
assets/pdf/                    the CV
_research/                     one Markdown file per research or software project
_news/                         news items
_bibliography/papers.bib       publications
_pages/                        home, research, publications, cv, photography, 404, redirects/
_plugins/hideCustomBibtex.rb   strips the custom keys from the BibTeX shown to readers
_fixtures/                     test-only research entries, published only by build:test
tests/unit/                    node:test over assets/js/lib
tests/e2e/                     Playwright, in Chromium, Firefox and WebKit
tests/site/                    node:test over the built _site
scripts/lighthouse.js          Lighthouse check, configured by lighthouserc.json
```

## Rules

- Every fact, number and claim on the site comes from the CV in `assets/pdf/` or from a published paper that you have opened. Copy numbers exactly; never round them up or strengthen them.
- Add a link only after opening it and confirming that it shows the named work.
- Site copy is first person, in plain sentences and sentence case, with no all-capital labels, no emoji and no em dashes.
- Never name a front matter key `url`, because Jekyll reserves it. Link lists use `href`.
- Images are local files. Download a remote image before using it. File names have no spaces and no dots other than the extension.
- Show images with `_includes/picture.html`, passing the full source path as `src` with its `width`, `height`, `alt` and `sizes`. It writes the `srcset` from the resized WebP copies and makes the image lazy unless you pass `fetchpriority` or `loading`.
- Every `img` in the built site has `width`, `height` and `alt`; a site test enforces this.
- Pages load nothing from other domains except Google Analytics, which is included only in production builds. The Content Security Policy in `_includes/head.html` allows no inline scripts, so scripts go in `assets/js/` and pages load them with `scripts:` in their front matter.
- Colours, spacing and type sizes come from the custom properties in `_sass/_tokens.scss`. Both themes must meet WCAG AA contrast.
- The layout must work from 320px to 1920px wide with no horizontal scrolling. The phone menu appears below 820px.
- Dialogs, such as the photo viewer, use the page's paper and ink colours rather than a dark overlay panel.

## Checking a change

Run `npm test`, and for any visible change look at the page in a browser at 320, 768 and 1440 pixels wide, in both themes.
Take full-page Playwright screenshots, scroll the page first so that lazy images load, and check the result rather than assuming it from the code.

## Pitfalls

- jekyll-imagemagick regenerates a resized copy only when the original is newer than it. After renaming a photo folder by letter case only (for example `Olympic` to `olympic`), delete `_site/assets/photography` once, because macOS treats both names as the same folder and the stale copies hide the new ones.
- The fonts are cut down to weights 400 to 600, so any weight outside that range is drawn at the nearest one. `strong` and `b` are set to 600.
- `jekyll-redirect-from` writes absolute addresses from `url` in `_config.yml`; the test build overrides `url` for that reason.
- jekyll-scholar renders the publications through `_layouts/bib.html`; the custom BibTeX keys it hides are listed under `filtered_bibtex_keywords` in `_config.yml`.
