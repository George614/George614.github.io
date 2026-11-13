# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the al-folio template with the approved "Field notes" design: a hand-written Jekyll theme with Home, Research, Publications, CV and Photography pages, filled only with content from the November 2026 CV and the published papers.

**Architecture:** The site stays a Jekyll site deployed to GitHub Pages by the `deploy` workflow.
All al-folio layouts, includes, Sass, JavaScript and sample content are deleted and replaced by semantic HTML layouts, one stylesheet built from Sass partials with design tokens as CSS custom properties, and a few small vanilla JavaScript modules.
Content lives in data: a `research` collection (one Markdown file per project), `_bibliography/papers.bib`, and YAML files under `_data/`.

**Tech Stack:** Jekyll 4.4 on Ruby 3.4, jekyll-scholar, jekyll-imagemagick, jekyll-sitemap, jekyll-minifier, jekyll-redirect-from, jekyll-seo-tag, Sass, vanilla ES modules, Playwright with axe-core, Node 22 test runner, html-proofer, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-11-12-site-redesign-design.md`.
Read it before starting any task.
The visual reference is the approved mockup, which Task 1 copies to `docs/superpowers/specs/assets/field-notes-mockup.html`.

## Global Constraints

- All work happens on the `redesign` branch. Nothing is pushed or merged to `master` until the owner approves the finished site (Task 12).
- Commit messages use the form `<type>: <description>` and carry no co-author or attribution lines.
- No em dash anywhere: not in site copy, code comments, commit messages or documents. Use a plain hyphen.
- Site copy is first person, plain sentences, sentence case. No all-capital label text and no emoji.
- Every fact, number and claim on the site comes from `assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf` or from a published paper that the builder has opened. Numbers are copied, not rounded up or strengthened. A link is added only after the builder has opened it and confirmed that it shows the named work.
- No front matter key is named `url`. Link lists use `href`.
- Light palette: paper `#f7f9fa`, raised `#ffffff`, ink `#17222c`, soft `#53626f`, rule `#d5dce2`, blue `#1f5d8c`, gold `#a06d0c`, gold text `#8a5d08`, tint `#e8eef2`.
- Dark palette: paper `#111a22`, ink `#e4eaef`, soft `#9aa9b6`, rule `#283642`, blue `#86bbe8`, gold and gold text `#e0b04f`, tint `#1b2833`.
- Fonts: Newsreader (headings, hero statement, long-form text) and Hanken Grotesk (navigation, labels, summaries, metadata), self-hosted WOFF2 with `font-display: swap`.
- One centred column of at most 1080px. The phone menu breakpoint is 820px.
- Pages load nothing from other domains except Google Analytics (`G-Z9YMBS9KFE`), which loads only in production builds.
- Works from 320px to 1920px with no horizontal scrolling. Both themes meet WCAG AA. Every interactive element is keyboard reachable with a visible focus ring. Every `img` has `width`, `height` and `alt`. `prefers-reduced-motion` is respected.
- Image file names contain no spaces and no dots other than the extension.
- Commands in this plan are run from the repository root. On the owner's Mac, prefix each command with `mise exec ruby@3.4.12 --` so that `bundle` resolves to Ruby 3.4 (Docker is not usable on this machine).
- When writing UI, follow the mockup for layout, spacing and type, and the frontend-design skill for craft.

## Decisions this plan adds to the spec

The spec leaves these to the builder. They are listed here so the owner can object before work starts.

- **Automated tests gate the deploy.** The `deploy` workflow builds the site, runs unit tests, browser tests in Chromium, Firefox and WebKit, and a link check, and deploys only if all pass.
- **Gems.** Added: `jekyll-redirect-from` (redirects), `jekyll-seo-tag` (title, description, canonical and Open Graph tags), `html-proofer` (link check). Removed: every plugin the spec lists, plus `jekyll-email-protect`, `jekyll-link-attributes`, `jemoji`, `classifier-reborn`, `feedjira`, `httparty` and the `--lsi` build flag, none of which the new site uses.
- **Upstream template files are removed**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `bin/`, the three Docker workflows, `.all-contributorsrc`, `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/`, `.github/release.yml`, `.github/stale.yml`, `reports/`. They build or describe the al-folio template, not this site. `LICENSE` stays.
- **Content Security Policy.** Each page carries a `meta` Content-Security-Policy that allows only same-origin resources plus Google Analytics.
- **Photographs.** Album folders are renamed to `mammoth`, `olympic`, `sequoia` and `lassen-shasta`. The site publishes resized WebP copies with camera metadata (including any GPS position) stripped, and no longer publishes the 2 to 9 MB originals, which stay in the repository as sources.
- **Favicon.** The sailboat emoji favicon is replaced by an SVG monogram "ZY" in the site palette.
- **`/news/`** redirects to the home page news section.
- **Research order.** Entries are sorted by a `sort_date` key that is never displayed. For WRITER projects it is the last day of the end month the CV gives. For papers it is the publication month where the CV gives one, and otherwise 1 July of the publication year.

## Review Focus

These conditions are implied by the spec but easy to miss. Each has a test in the task named in brackets.

1. A visitor opens `/research/?topic=` with an unknown or malformed value: all entries are shown and "All" is marked current. [Task 4]
2. JavaScript is disabled or fails to load: on a phone every navigation link is still reachable, all research entries are shown, and each photograph thumbnail still opens its larger image. [Tasks 2, 4, 9]
3. `localStorage` is blocked (private browsing, strict settings): the theme follows the system setting, the theme button still switches the current page, and no error is thrown. [Task 2]
4. A research entry has no figure, no links, no results list or no margin facts: its row and its page show no empty box, no empty heading and no stray separator. [Task 3]
5. Collaborator names with characters outside basic Latin (for example "Święcicki") are drawn in the site fonts, not a fallback font. [Task 5]

## File Structure

```text
_config.yml                    site settings, collections, plugins, image sizes
Gemfile                        gems
package.json                   test tooling and npm scripts
playwright.config.js           browser test config, serves _site on port 4173
lighthouserc.json              Lighthouse thresholds
_data/nav.yml                  header links: key, title, href
_data/contact.yml              contact links: label, href
_data/topics.yml               research topics: key, title
_data/under_review.yml         the two papers under review: title, venue, topic, sort_date
_data/cv.yml                   education, experience, teaching, mentoring
_data/albums.yml               photo albums: title, slug, photos (file, title, width, height)
_layouts/default.html          html shell: head, header, main, footer
_layouts/page.html             page title plus content
_layouts/home.html             home page
_layouts/research.html         research list
_layouts/project.html          research or software project page
_layouts/bib.html              one bibliography entry (jekyll-scholar)
_includes/head.html            meta, CSP, fonts, stylesheet, theme-init script
_includes/header.html          sticky header, nav, theme button, menu button
_includes/footer.html          contact links
_includes/contact-links.html   list of contact links
_includes/picture.html         responsive img with srcset
_includes/entry-row.html       one row in a research or software list
_includes/analytics.html       Google Analytics, production only
_sass/                         _tokens, _fonts, _base, _layout, _header, _footer, _home,
                               _research, _project, _publications, _cv, _photography
assets/css/main.scss           imports the partials
assets/js/theme-init.js        classic script, sets theme before first paint
assets/js/analytics.js         gtag configuration
assets/js/site.js              theme button, phone menu, header scroll state
assets/js/research-filter.js   topic filter
assets/js/lightbox.js          photo lightbox
assets/js/lib/theme.js         pure theme logic
assets/js/lib/topic.js         pure topic parsing
assets/js/lib/gallery.js       pure index arithmetic
assets/fonts/                  WOFF2 files
assets/img/research/           figures and screenshots
_research/                     one Markdown file per project
_news/                         news items
_pages/                        home, research, publications, cv, photography, 404, redirects
_plugins/hideCustomBibtex.rb   kept: strips custom keys from displayed BibTeX
_fixtures/                     test-only research entries, published only by build:test
tests/_config.test.yml         adds the fixtures collection for build:test
tests/unit/                    node:test, pure logic
tests/e2e/                     Playwright
tests/site/                    node:test over the built _site
```

## Shared contracts

Later tasks rely on these names. A task's Interfaces block refers to this section.

**npm scripts** (Task 1): `build` (`bundle exec jekyll build`), `build:test` (`bundle exec jekyll build --config _config.yml,tests/_config.test.yml`, which also publishes the test-only entries in `_fixtures/`), `test:unit`, `test:e2e`, `test:site`, `check:links`, and `test`.
`test` runs `build:test`, `test:unit`, `test:e2e`, `build`, `test:site`, `check:links` in that order, so browser tests see the fixtures and the final checks see the site exactly as it deploys.

**Layout variables** (Task 2): `title`, `description` (optional), `nav_key` (one of `home`, `research`, `publications`, `cv`, `photography`), `scripts` (optional list of file names under `/assets/js/` loaded as modules).

**DOM hooks** (Task 2): `header.site-header` (gets `data-scrolled` once the page has scrolled), `nav[aria-label="Main"]`, `button[data-theme-toggle]`, `button[data-menu-toggle]` with `aria-expanded` and `aria-controls="site-menu"`, `main#content`, `footer.site-footer`.
`html[data-js]` is set by `theme-init.js`; styles that hide content pending a script apply only under `html[data-js]`.
`html[data-theme]` is `light` or `dark` only after a manual choice. The `localStorage` key is `theme`.

**CSS** (Task 2): tokens `--paper --raised --ink --soft --rule --blue --gold --gold-text --tint --font-serif --font-sans`; classes `.wrap` (the 1080px column), `.with-margin` (prose left, facts right, single column below 820px), `.facts` (a `dl` of margin facts), `.label` (gold venue or date label), `.visually-hidden`.

**`_includes/picture.html`** (Task 2): parameters `src` (a source path such as `/assets/img/research/sr-aif.png`), `alt`, `width`, `height`, `sizes`, `loading` (default `lazy`), `class`.
It renders one `img` whose `src` is the `-800.webp` copy and whose `srcset` lists the `-480`, `-800`, `-1400` and `-2000` WebP copies that jekyll-imagemagick generates.

**Research entry front matter** (Task 3), files in `_research/<slug>.md`, served at `/research/<slug>/`:

```yaml
title: "SR-AIF: sparse-reward robotics from pixels"
kind: research              # research or software
topic: active-inference     # key in _data/topics.yml; research only
sort_date: "2025-07-01"     # research only; unique; ordering only, never shown
order: 1                    # software only; ascending
label: "ICRA 2025"          # gold venue or date label
summary: "One or two sentences for list rows."
authors: "One line for the project page."
featured: true              # shown under Selected work on the home page
links:                      # optional
  - {label: "Paper", href: "https://doi.org/..."}
figures:                    # optional; the first one is the row thumbnail
  - {src: "/assets/img/research/sr-aif.png", alt: "...", width: 1600, height: 900}
figure_caption: "..."       # required when figures is present
results: ["...", "..."]     # optional; the Main results list
facts:                      # optional; margin facts
  - {label: "Method", value: "...", href: "/research/palmyra-x6/"}   # href optional
bib_key: nguyen2025sr-aif   # optional; the matching bibliography key
cv_sourced: true            # true when every claim comes from the CV alone
```

The Markdown body is the summary prose.

**Topics** (`_data/topics.yml`, Task 3): `agents` "LLM agents and RL", `diffusion` "Diffusion language models", `active-inference` "Active inference", `eye-tracking-vr` "Eye tracking and VR".

**Test helpers** (`tests/e2e/helpers.js`, Task 1): `PAGES` (array of paths; Task 2 lists the five main pages, and later tasks add project pages), `VIEWPORTS = [320, 768, 1024, 1440]`, `THEMES = ['light', 'dark']`, `setTheme(page, theme)`, `expectNoOverflow(page)` (asserts `document.documentElement.scrollWidth <= window.innerWidth`), `expectNoAxeViolations(page)` (axe with tags `wcag2a`, `wcag2aa`, `wcag21aa`).

---

### Task 1: Tooling, configuration and clean slate

**Files:**
- Create: `package.json`, `playwright.config.js`, `tests/e2e/helpers.js`, `tests/e2e/every-page.spec.js`, `tests/site/clean-slate.test.js`, `tests/site/html-rules.test.js`, `_layouts/default.html` (bare shell for now), `_pages/home.md`, `docs/superpowers/specs/assets/field-notes-mockup.html`
- Rewrite: `_config.yml`, `Gemfile`
- Modify: `.gitignore` (add `node_modules/`, `test-results/`, `playwright-report/`, `.lighthouseci/`)
- Delete: `_layouts/*`, `_includes/**`, `_sass/**`, `assets/css/*`, `assets/js/**`, `assets/json/`, `assets/fonts/`, `assets/webfonts/`, `assets/audio/`, `assets/video/`, `assets/plotly/`, `assets/bibliography/`, `assets/pdf/example_pdf.pdf`, `assets/img/{1..12}.jpg`, `assets/img/*-screenshot.png`, `assets/img/al-folio-preview.png`, `assets/img/pagespeed.svg`, `assets/img/prof_pic_Einstein.jpg`, `_posts/`, `_projects/`, `blog/`, `news.html`, `404.html`, `purgecss.config.js`, every file in `_pages/`, `_data/coauthors.yml`, `_data/repositories.yml`, `_data/venues.yml`, `_data/cv.yml`, `_plugins/cache-bust.rb`, `_plugins/details.rb`, `_plugins/external-posts.rb`, `_plugins/file-exists.rb`, and the upstream template files named under "Decisions this plan adds to the spec"
- Keep for later tasks: `robots.txt`, `_news/`, `_bibliography/papers.bib`, `_plugins/hideCustomBibtex.rb`, `assets/photography/`, `assets/portfolio/`, `assets/img/prof_pic.jpg`, `assets/img/gpu-calculator.png`, `assets/img/interview-prep-app.png`, `assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf`
- Later tasks that need the text of a deleted page read it from the `master` branch with `git show master:<path>`.

**Interfaces:**
- Produces: the npm scripts and test helpers in "Shared contracts"; a site that builds with one bare home page.

- [ ] **Step 1: Copy the mockup** from `.superpowers/brainstorm/45367-1794509845/content/field-notes-nav-v2.html` to `docs/superpowers/specs/assets/field-notes-mockup.html`.

- [ ] **Step 2: Add the test tooling.**
`package.json` is private with `"type": "module"` and the npm scripts from "Shared contracts".
Dev dependencies, installed with `npm install --save-dev`: `@playwright/test`, `@axe-core/playwright`, `http-server`, `@lhci/cli`.
`test:unit` is `node --test --experimental-test-coverage --test-coverage-include='assets/js/lib/**' --test-coverage-lines=80 tests/unit/`.
`test:site` is `node --test tests/site/`.
`tests/_config.test.yml` holds only `collections: {fixtures: {output: true, permalink: "/fixtures/:name/"}}`.
`check:links` is `bundle exec htmlproofer _site --disable-external`.
`playwright.config.js` defines projects `chromium`, `firefox` and `webkit`, `baseURL` `http://localhost:4173`, and a `webServer` that runs `npx http-server _site -p 4173 -c-1 --silent` with `reuseExistingServer: !process.env.CI`.

- [ ] **Step 3: Write the failing site tests.**

```js
// tests/site/clean-slate.test.js  (node:test, reads files under _site)
test('template content is gone', () => {
  for (const path of ['blog', 'projects/1_project', 'docs', 'tests', 'fixtures', 'node_modules',
                      'package.json', 'README.md', 'CLAUDE.md', 'assets/json'])
    assert.equal(existsSync(join('_site', path)), false, path);
  for (const html of allHtmlFiles('_site'))
    assert.doesNotMatch(read(html), /Einstein|al-folio|polyfill\.io|particles|mathjax|bootstrap|jquery|font-?awesome/i, html);
});

// tests/site/html-rules.test.js
test('no em dash and no emoji in any page', () => {
  for (const html of allHtmlFiles('_site')) {
    assert.doesNotMatch(read(html), /\u2014/, html);
    assert.doesNotMatch(visibleText(html), /\p{Extended_Pictographic}/u, html);
  }
});
test('every img has width, height and alt', () => { /* each <img ...> tag matches all three attributes */ });
test('only Google Analytics is loaded from another domain', () => {
  // every src/href/srcset on script, link[rel=stylesheet|preload|icon], img and source is
  // same-origin or starts with https://www.googletagmanager.com/
});
```

`tests/e2e/every-page.spec.js` loops over `PAGES` (starting as `['/']`), `THEMES` and `VIEWPORTS` and asserts for each: HTTP 200, exactly one `h1`, `expectNoOverflow`, `expectNoAxeViolations`, no console errors, and every network request is to `localhost`.

- [ ] **Step 4: Run `npm run build && npm run test:site`.** Expected: `clean-slate` FAILS on `blog` and on "Einstein".

- [ ] **Step 5: Delete the files listed above and rewrite the configuration.**
`Gemfile` keeps `jekyll ~> 4.0`, `jekyll-imagemagick`, `jekyll-minifier`, `jekyll-scholar`, `jekyll-sitemap`, `webrick`, `unicode_utils`, adds `jekyll-redirect-from` and `jekyll-seo-tag` to the plugin group, and adds `html-proofer` in a `:test` group.
`_config.yml` is rewritten from scratch with only the keys the new site reads:

```yaml
title: Zhizhuo Yang
description: AI Research Scientist at WRITER, working on reinforcement learning and post-training for LLM agents.
url: https://George614.github.io
baseurl: ""
lang: en
email: yangzhizhuo@gmail.com
github_username: George614
linkedin_username: zhizhuo-yang
scholar_userid: OA2-BIsAAAAJ
google_analytics: G-Z9YMBS9KFE
cv_pdf: /assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf
include: [_pages]
exclude: [docs, tests, _fixtures, node_modules, package.json, package-lock.json, playwright.config.js,
          lighthouserc.json, README.md, CLAUDE.md, LICENSE, test-results, playwright-report,
          .lighthouseci, "assets/photography/*/*.JPG", "assets/photography/*/*.jpg"]
collections:
  research: {output: true, permalink: "/research/:name/"}
  news: {output: false}
defaults:
  - {scope: {path: "", type: research}, values: {layout: project, nav_key: research}}
  - {scope: {path: "_pages"}, values: {layout: page}}
  - {scope: {path: assets}, values: {sitemap: false}}
plugins: [jekyll/scholar, jekyll-sitemap, jekyll-minifier, jekyll-imagemagick, jekyll-redirect-from, jekyll-seo-tag]
sass: {style: compressed}
jekyll-minifier: {exclude: ["robots.txt"]}
imagemagick:
  enabled: true
  widths: [480, 800, 1400, 2000]
  input_directories: [assets/img/, assets/photography/]
  input_formats: [".jpg", ".jpeg", ".png"]
  output_formats: {webp: "-auto-orient -strip -quality 82"}
scholar:
  last_name: [Yang]
  first_name: [Zhizhuo, Z.]
  style: apa
  locale: en
  source: /_bibliography/
  bibliography: papers.bib
  bibliography_template: bib
  bibtex_filters: [latex, smallcaps, superscript]
  replace_strings: true
  join_strings: true
  group_by: year
  group_order: descending
  bibliography_group_tag: h3
filtered_bibtex_keywords: [abbr, abstract, arxiv, bibtex_show, html, pdf, selected, supp, blog,
                           code, poster, slides, website, preview, altmetric, group, project]
```

`_pages/home.md` has `permalink: /`, `layout: default`, `title: Zhizhuo Yang` and a single `h1` for now.

- [ ] **Step 6: Run `npm run build:test && npm run test:e2e && npm run build && npm run test:site && npm run check:links`.** Expected: PASS.
The unit tests start in Task 2, and from then on the command is `npm test`.

- [ ] **Step 7: Commit** as `chore: remove the al-folio theme and add test tooling`.

---

### Task 2: Design tokens, fonts and page shell

**Files:**
- Create: `_includes/{head,header,footer,contact-links,picture,analytics}.html`, `_layouts/page.html`, `_data/nav.yml`, `_data/contact.yml`, `_sass/{_tokens,_fonts,_base,_layout,_header,_footer}.scss`, `assets/css/main.scss`, `assets/js/{theme-init,analytics,site}.js`, `assets/js/lib/theme.js`, `assets/fonts/*.woff2`, `assets/img/favicon.svg`, `tests/unit/theme.test.js`, `tests/e2e/shell.spec.js`
- Create as stubs (front matter, `nav_key` and an `h1` only; later tasks fill them): `_pages/research.md` (`/research/`), `_pages/publications.md` (`/publications/`), `_pages/cv.md` (`/cv/`), `_pages/photography.md` (`/photography/`)
- Modify: `_layouts/default.html`, `tests/e2e/helpers.js` (`PAGES` becomes `/`, `/research/`, `/publications/`, `/cv/`, `/photography/`)

**Interfaces:**
- Produces: the layout variables, DOM hooks, CSS and `picture.html` contracts in "Shared contracts".
- `assets/js/lib/theme.js` exports `effectiveTheme(stored: string | null, prefersDark: boolean): 'light' | 'dark'` and `nextTheme(current: 'light' | 'dark'): 'light' | 'dark'`.

- [ ] **Step 1: Write the failing unit test.**

```js
// tests/unit/theme.test.js
assert.equal(effectiveTheme(null, true), 'dark');
assert.equal(effectiveTheme(null, false), 'light');
assert.equal(effectiveTheme('light', true), 'light');
assert.equal(effectiveTheme('dark', false), 'dark');
assert.equal(effectiveTheme('purple', true), 'dark');   // an invalid stored value is ignored
assert.equal(nextTheme('light'), 'dark');
assert.equal(nextTheme('dark'), 'light');
```

- [ ] **Step 2: Write the failing browser tests in `tests/e2e/shell.spec.js`.**

```js
test('header links and current page', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  await expect(nav.getByRole('link')).toHaveText(['Home', 'Research', 'Publications', 'CV', 'Photography']);
  await expect(nav.locator('[aria-current="page"]')).toHaveText('Home');
  await expect(page.locator('header.site-header a').first()).toHaveAttribute('href', '/');
});
test('footer repeats the contact links', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('footer.site-footer').getByRole('link');
  await expect(links).toHaveText(['Email', 'Google Scholar', 'GitHub', 'LinkedIn']);
  await expect(links.nth(0)).toHaveAttribute('href', 'mailto:yangzhizhuo@gmail.com');
  await expect(links.nth(1)).toHaveAttribute('href', 'https://scholar.google.com/citations?user=OA2-BIsAAAAJ');
  await expect(links.nth(2)).toHaveAttribute('href', 'https://github.com/George614');
  await expect(links.nth(3)).toHaveAttribute('href', 'https://www.linkedin.com/in/zhizhuo-yang');
});
test('theme follows the system, then remembers a manual choice', async ({ browser }) => {
  // colorScheme 'dark' and no stored value: body background is rgb(17, 26, 34)
  // click button[data-theme-toggle]: background becomes rgb(247, 249, 250),
  //   localStorage.theme === 'light', the button's aria-label is "Switch to dark theme"
  // reload: still light, and html[data-theme="light"] is set before DOMContentLoaded
});
test('theme works when localStorage is blocked', async ({ browser }) => {
  // addInitScript makes Storage.prototype.getItem and setItem throw
  // colorScheme 'dark': page is dark; clicking the theme button makes it light; no pageerror
});
test('header stays on top and gains a rule after scrolling', async ({ page }) => {
  // scroll 400px: header boundingBox().y === 0 and header has attribute data-scrolled
});
test('phone menu', async ({ page }) => {
  // viewport 375x800: nav links are hidden and the menu button has aria-expanded="false"
  // click it: aria-expanded="true", five links visible, each at least 44px tall
  // press Escape: closed again and focus is on the menu button
  // viewport 1024: the menu button is hidden and the links are visible
});
test('without JavaScript the phone navigation is reachable', async ({ browser }) => {
  // context { javaScriptEnabled: false, viewport: { width: 375, height: 800 } }: five nav links visible
});
test('keyboard focus is visible and a skip link comes first', async ({ page }) => {
  // first Tab focuses a link "Skip to content" with href "#content"
  // every focused element in the header has a computed outline-style other than "none"
});
test('reduced motion removes transitions', async ({ browser }) => {
  // context { reducedMotion: 'reduce' }: computed transition-duration of the menu and theme button is "0s"
});
test('fonts are self-hosted', async ({ page }) => {
  // after document.fonts.ready: document.fonts.check('1em Newsreader') and ('1em "Hanken Grotesk"') are true
});
```

- [ ] **Step 3: Run `npm run test:unit` and `npm run build && npm run test:e2e`.** Expected: FAIL (module not found; no nav).

- [ ] **Step 4: Add the fonts.**
Take the variable WOFF2 files for the `latin` and `latin-ext` subsets from the npm packages `@fontsource-variable/newsreader` (normal and italic) and `@fontsource-variable/hanken-grotesk` (normal), installed in a scratch directory outside the repository.
Copy them to `assets/fonts/` and copy each `unicode-range` from the package's CSS into `_sass/_fonts.scss`.
Preload only the Newsreader normal latin file.

- [ ] **Step 5: Implement the shell.**
`_sass/_tokens.scss` defines the dark tokens once in a mixin and applies it under both `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`.
`theme-init.js` is a classic script loaded in `head` without `defer`: it sets `data-js` on `html` and, inside `try`, copies a stored `light` or `dark` value to `data-theme`.
The header is `position: sticky` with a translucent paper background and `backdrop-filter: blur`, and its bottom rule is drawn only under `[data-scrolled]`.
`site.js` is a module that wires the theme button, the menu button (toggle, Escape, close on link click) and an `IntersectionObserver` on a sentinel above the header that sets `data-scrolled`.
`head.html` contains `{% seo %}`, the favicon, and this policy in a `meta http-equiv="Content-Security-Policy"` tag:
`default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'none'`.
`analytics.html` is included only when `jekyll.environment == "production"` and loads `gtag/js` with `async` plus the local `analytics.js` with `defer`; no inline script is used anywhere.
Stylesheet and script URLs carry `?v={{ site.time | date: "%s" }}`.
External links carry `rel="noopener"`.

- [ ] **Step 6: Run `npm test`.** Expected: PASS in all three browsers, including the every-page checks in both themes at all four widths.

- [ ] **Step 7: Commit** as `feat: add the Field notes page shell, tokens and fonts`.

---

### Task 3: Research collection and project page

**Files:**
- Create: `_layouts/project.html`, `_data/topics.yml`, `_sass/_project.scss`, `_research/agentic-rl-744b.md`, `_research/sr-aif.md`, `assets/img/research/sr-aif.png`, `_fixtures/minimal.md`, `tests/e2e/project.spec.js`
- Modify: `tests/e2e/helpers.js` (add both project paths to `PAGES`)

**Interfaces:**
- Consumes: layout `default`, `.wrap`, `.with-margin`, `.facts`, `.label`, `picture.html`.
- Produces: the research entry front matter and topics in "Shared contracts"; `_layouts/project.html`.
- The project sequence used for "Next project" is: research entries by `sort_date` descending, then software entries by `order` ascending. The last entry has no "Next project" link.

- [ ] **Step 1: Write the failing tests in `tests/e2e/project.spec.js`.**

```js
test('project page with a figure', async ({ page }) => {
  await page.goto('/research/sr-aif/');
  const trail = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(trail.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/research/');
  await expect(trail.getByRole('link', { name: 'Active inference' })).toHaveAttribute('href', '/research/?topic=active-inference');
  await expect(page.locator('h1')).toHaveText('SR-AIF: sparse-reward robotics from pixels');
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Research');
  await expect(page.locator('.project-links a')).toHaveText(['Paper', 'arXiv']);
  await expect(page.locator('.project-links a').nth(0)).toHaveAttribute('href', 'https://doi.org/10.1109/ICRA55743.2025.11127713');
  await expect(page.locator('.project-links a').nth(1)).toHaveAttribute('href', 'https://arxiv.org/abs/2409.14216');
  await expect(page.locator('figure img')).toHaveAttribute('alt', /.+/);
  await expect(page.locator('figure figcaption')).toContainText('Nguyen');
  await expect(page.getByRole('heading', { name: 'Main results' })).toBeVisible();
  await expect(page.locator('.project-pager a').first()).toHaveAttribute('href', '/research/');
});
test('project page without a figure or links shows no empty parts', async ({ page }) => {
  await page.goto('/research/agentic-rl-744b/');
  await expect(page.locator('figure')).toHaveCount(0);
  await expect(page.locator('.project-links')).toHaveCount(0);
  await expect(page.locator('.facts dt')).toHaveText(['Method', 'Scale', 'Framework']);
});
test('entry with only a title, kind and summary renders cleanly', async ({ page }) => {
  await page.goto('/fixtures/minimal/');
  await expect(page.locator('h1')).toHaveText('Minimal fixture');
  for (const sel of ['figure', '.project-links', '.facts', '.label'])
    await expect(page.locator(`main ${sel}`)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Main results' })).toHaveCount(0);
  expect(await page.locator('main *:not(img):not(br):not(hr)').evaluateAll(
    els => els.filter(e => !e.textContent.trim() && !e.querySelector('img')).length)).toBe(0);
});
```

`_fixtures/minimal.md` has only `layout: project`, `title: Minimal fixture`, `kind: software` and `summary`, and a one-sentence body.
It is published at `/fixtures/minimal/` only by `npm run build:test`, and Task 1's `clean-slate` test proves it is absent from the deployable build.

- [ ] **Step 2: Run `npm run test:e2e -- project`.** Expected: FAIL with 404.

- [ ] **Step 3: Implement `_layouts/project.html` and the two entries.**
The page order follows the mockup: trail, `h1`, authors line with the gold label, link buttons, figures, then `.with-margin` holding the body and "Main results" on the left and the facts on the right, then the pager.
Each optional block is wrapped in a Liquid condition so that nothing is emitted when its data is absent.
`_research/agentic-rl-744b.md`: `topic: agents`, `sort_date: "2026-09-30"`, `label: "WRITER, 2025 to 2026"`, `featured: true`, `cv_sourced: true`, no figures, no links.
Its title, summary, authors line, body, three results and the facts Method, Scale and Framework are the ones shown on the mockup's project page, which were written from the CV section "LLM post-training and agentic RL".
The mockup's fourth fact, "Related", links to the Palmyra x6 page and is added in Task 5 when that page exists.
The mockup's "Technical report", "arXiv" and "Slides" buttons are placeholders and are not carried over.
`_research/sr-aif.md`: `topic: active-inference`, `sort_date: "2025-07-01"`, `label: "ICRA 2025"`, `featured: true`, `bib_key: nguyen2025sr-aif`, authors "Viet Dung Nguyen, Zhizhuo Yang, Christopher L. Buckley and Alexander Ororbia".
Its body and results are written from the paper's abstract and results section, opened at `https://arxiv.org/abs/2409.14216`.
Its figure is the paper's method overview figure, rendered from the arXiv PDF with `pdftoppm -png -r 200` and cropped to the figure, at most 1600px wide, with the caption "Figure N from Nguyen et al., ICRA 2025." using the real figure number.

- [ ] **Step 4: Run `npm test`.** Expected: PASS.

- [ ] **Step 5: Commit** as `feat: add the research collection and project page`.

---

### Task 4: Research list and topic filter

**Files:**
- Create: `_layouts/research.html`, `_includes/entry-row.html`, `_data/under_review.yml`, `_sass/_research.scss`, `assets/js/research-filter.js`, `assets/js/lib/topic.js`, `tests/unit/topic.test.js`, `tests/e2e/research.spec.js`
- Modify: `_pages/research.md` (`layout: research`, `scripts: [research-filter.js]`), `tests/e2e/helpers.js` (add `/research/?topic=diffusion`)

**Interfaces:**
- Consumes: research entries, `_data/topics.yml`, `picture.html`.
- Produces: `entry-row.html` with parameter `entry` (a research document), used again on the home page.
- `assets/js/lib/topic.js` exports `parseTopic(search: string, validKeys: string[]): string | null`.
- DOM: `nav[aria-label="Filter by topic"]` holding links `a[data-topic]` (`data-topic=""` and `href="/research/"` for All, otherwise `href="/research/?topic=<key>"`), the active one marked `aria-current="true"`; rows `li[data-topic][data-sort]`; under-review rows also carry `data-under-review` and contain no link; `section#software` with heading "Software".
- `_data/under_review.yml`:

```yaml
- title: "Denoising Blocks, Not Tokens: Efficient Compressed Continuous Diffusion with Branching Token Realization"
  venue: "ICLR 2027"
  topic: diffusion
  sort_date: "2026-06-02"
- title: "When Are Errors Evidence? Deciding Whether to Revise, What to Keep, and How to Commit in Diffusion Language Models"
  venue: "ACL ARR October 2026"
  topic: diffusion
  sort_date: "2026-06-01"
```

- [ ] **Step 1: Write the failing unit test.**

```js
const keys = ['agents', 'diffusion', 'active-inference', 'eye-tracking-vr'];
assert.equal(parseTopic('?topic=diffusion', keys), 'diffusion');
assert.equal(parseTopic('?x=1&topic=agents', keys), 'agents');
assert.equal(parseTopic('', keys), null);
assert.equal(parseTopic('?topic=', keys), null);
assert.equal(parseTopic('?topic=bogus', keys), null);
assert.equal(parseTopic('?topic=%E0%A4%A', keys), null);   // malformed encoding does not throw
```

- [ ] **Step 2: Write the failing browser tests.**

```js
test('filter buttons and order', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('nav[aria-label="Filter by topic"] a')).toHaveText(
    ['All', 'LLM agents and RL', 'Diffusion language models', 'Active inference', 'Eye tracking and VR']);
  const sorts = await page.locator('main li[data-sort]').evaluateAll(els => els.map(e => e.dataset.sort));
  expect(sorts).toEqual([...sorts].sort().reverse());
  expect(new Set(sorts).size).toBe(sorts.length);
});
test('filtering updates the list and the address without a reload', async ({ page }) => {
  // click "Diffusion language models": URL is /research/?topic=diffusion, no navigation event fired,
  // exactly 2 visible rows, both [data-under-review], each showing its title and venue and no link,
  // the clicked filter has aria-current="true"
  // goBack(): URL is /research/ and all rows are visible again
});
test('a filtered address can be opened directly', async ({ page }) => {
  // /research/?topic=active-inference : every visible row has data-topic="active-inference"
});
test('an unknown topic shows everything', async ({ page }) => {
  // /research/?topic=bogus : no row hidden, "All" has aria-current="true"
});
test('without JavaScript all entries are shown', async ({ browser }) => { /* javaScriptEnabled: false */ });
test('the filter bar stays under the header while scrolling', async ({ page }) => {
  // scroll to the bottom: filter nav top equals the header's height, within 1px
});
test('the Software section is not filtered', async ({ page }) => {
  // /research/?topic=diffusion : section#software and its heading are visible
});
```

- [ ] **Step 3: Run the tests.** Expected: FAIL.

- [ ] **Step 4: Implement.**
`research.html` concatenates `site.research` entries of `kind: research` with `site.data.under_review`, sorts by `sort_date` descending, and renders each through `entry-row.html` or a plain under-review row.
A row shows the thumbnail (the first figure at `sizes` about 160px) when the entry has one; rows without a figure span the full width with the same text alignment, so a mixed list reads as intentional.
`research-filter.js` applies `parseTopic(location.search, keys)` on load and on `popstate`, intercepts filter link clicks, sets the `hidden` attribute on rows of other topics, and calls `history.pushState`.
The intro sentence is the mockup's: "Projects and papers, newest first. Each one opens a short summary with a figure, the main results and links."

- [ ] **Step 5: Run `npm test`.** Expected: PASS.

- [ ] **Step 6: Commit** as `feat: add the research list with a shareable topic filter`.

---

### Task 5: Research and software content

**Files:**
- Create: `_research/{palmyra-x6,self-evolving-agents,differential-transformer-lora,perceptual-motor-learning,gaze-in-wild,rit-eyes,passive-haptics-mr,gpu-memory-calculator,ai-interview-prep,meow-translator}.md`, figures under `assets/img/research/`, `tests/e2e/research-content.spec.js`, `tests/e2e/cv-claims.spec.js`
- Move: `assets/img/gpu-calculator.png` and `assets/img/interview-prep-app.png` to `assets/img/research/`; the first three files in `assets/portfolio/` to `assets/img/research/meow-translator-{1,2,3}.png`; delete the fourth file and the `assets/portfolio/` folder
- Modify: `tests/e2e/helpers.js` (add every new project path)

**Interfaces:**
- Consumes: the research entry front matter contract.
- Produces: the full set of entries that the home page (Task 6) and Publications (Task 7) link to.

| Slug | Title | Topic | `sort_date` | Label | Source |
|---|---|---|---|---|---|
| `palmyra-x6` | Palmyra x6: an agentic, tool-use model | agents | 2026-08-01 | Technical report, arXiv 2026 | CV; `https://arxiv.org/abs/2608.16620` |
| `self-evolving-agents` | Self-evolving agentic AI systems | agents | 2025-09-30 | WRITER, 2025 | CV section of the same name |
| `differential-transformer-lora` | Differential Transformer with low-rank adapters | agents | 2025-08-31 | WRITER, 2025 | CV section "More efficient differential Transformer with low-rank adapters" |
| `perceptual-motor-learning` | A neural active inference model of perceptual-motor learning | active-inference | 2023-07-01 | Frontiers in Computational Neuroscience, 2023 | paper; `https://arxiv.org/abs/2211.10419` |
| `rit-eyes` | RIT-Eyes | eye-tracking-vr | 2020-09-30 | ACM SAP 2020 | paper |
| `gaze-in-wild` | Gaze-in-Wild | eye-tracking-vr | 2020-07-01 | Scientific Reports, 2020 | paper |
| `passive-haptics-mr` | Passive haptics based mixed reality system | eye-tracking-vr | 2016-12-31 | ISMAR 2016 and VRCAI 2016 | both 2016 papers; CV sections on passive haptics |

Software entries (`kind: software`, no topic): `gpu-memory-calculator` (`order: 1`, links "Code" `https://github.com/George614/gpu-mem-calculator` and "Demo" `https://huggingface.co/spaces/george614/gpu-memory-calculator`), `ai-interview-prep` (`order: 2`, link "Code" `https://github.com/George614/interview-prep-app-public`), `meow-translator` (`order: 3`, no links, three screenshots).

- [ ] **Step 1: Write the failing tests.**

```js
// tests/e2e/research-content.spec.js
test('the list holds every entry', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('main li[data-sort]:not([data-under-review])')).toHaveCount(9);
  await expect(page.locator('main li[data-under-review]')).toHaveCount(2);
  await expect(page.locator('#software li')).toHaveText([/GPU Memory Calculator/, /AI Interview Prep/, /Meow Translator/]);
});
test('every row opens a project page and every project link is listed', async ({ page, request }) => { /* each row href returns 200 */ });
test('Meow Translator has three screenshots and no links', async ({ page }) => {
  await page.goto('/research/meow-translator/');
  await expect(page.locator('figure img')).toHaveCount(3);
  await expect(page.locator('.project-links')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('cat');
  await expect(page.locator('main')).not.toContainText(/SwiftUI|Core Data|MVVM|App Store/);
});
test('names outside basic Latin use the site fonts', async ({ page }) => {
  await page.goto('/research/differential-transformer-lora/');
  await expect(page.locator('main')).toContainText('Święcicki');
  await page.evaluate(() => document.fonts.ready);
  const extLoaded = await page.evaluate(() =>
    [...document.fonts].some(f => f.status === 'loaded' && /U\+0*100-/i.test(f.unicodeRange)));
  expect(extLoaded).toBe(true);
});

// tests/e2e/cv-claims.spec.js
// cvText = execFileSync('pdftotext', ['-layout', 'assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf', '-'])
// For every element with [data-source="cv"] on every page in PAGES: each number in its text
// (regex /\d+(?:\.\d+)?/ after removing thousands separators) also occurs in cvText.
```

A number counts as present only when it equals a whole number token of the CV text.
`_layouts/project.html` sets `data-source="cv"` on `main` when the entry has `cv_sourced: true`.

- [ ] **Step 2: Run the tests.** Expected: FAIL on the counts.

- [ ] **Step 3: Write the four WRITER entries** (`palmyra-x6` and the two 2025 projects, and finish `agentic-rl-744b`), each with `cv_sourced: true`.
`agentic-rl-744b` gains the fact `{label: "Related", value: "Palmyra x6 technical report", href: "/research/palmyra-x6/"}`, and `project.spec.js` is updated to expect the four facts Method, Scale, Framework and Related with that link.
Authors lines name the collaborators the CV lists for that section.
`palmyra-x6` is `featured: true`, has the link "arXiv" `https://arxiv.org/abs/2608.16620`, `bib_key: du2026palmyra`, and uses a figure from the report if one represents the result, with a caption that credits the report.
The other WRITER entries have no figure.

- [ ] **Step 4: Write the four paper entries.**
For each, open the paper, write the summary and two to four results from its abstract and results, and take one figure from the paper itself.
Sources to try: arXiv for `perceptual-motor-learning`; the publisher's open-access page for `perceptual-motor-learning` and `gaze-in-wild`; an arXiv or author copy for `rit-eyes` and `passive-haptics-mr`.
If no copy of a paper can be opened, the entry is written from the CV alone, ships without a figure, and is named in the handover list in Task 12.
Add "Paper", "arXiv", "Code" or "Dataset" links only for pages opened and confirmed.
The `passive-haptics-mr` entry covers both 2016 papers and names both in its facts.

- [ ] **Step 5: Write the three software entries.**
The text for GPU Memory Calculator and AI Interview Prep is carried over from their sections of the old portfolio page (`git show master:_pages/portfolio.md`), trimmed to a summary, a short body and a results list of features.
Meow Translator is described only from its screenshots: an iPhone app that listens to a cat's meows and reports the emotion it hears (happy, playful, calm or curious), with Listen, History and Settings tabs.

- [ ] **Step 6: Run `npm test`.** Expected: PASS, including the every-page checks on all new pages.

- [ ] **Step 7: Commit** as `feat: add research and software entries from the CV and papers`.

---

### Task 6: Home page

**Files:**
- Create: `_layouts/home.html`, `_sass/_home.scss`, `_news/2026-08-palmyra-x6.md`, `tests/e2e/home.spec.js`
- Modify: `_pages/home.md` (`layout: home`, `nav_key: home`), `_news/announcement_{1..7}.md`

**Interfaces:**
- Consumes: `entry-row.html`, `contact-links.html`, `picture.html`, `.with-margin`, `.facts`, featured research entries, the `news` collection.

- [ ] **Step 1: Write the failing tests.**

```js
test('hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('I train large language models to act, not only to answer.');
  await expect(page.locator('.hero')).toContainText('AI Research Scientist at WRITER, working on reinforcement learning and post-training for agents. I also go by George.');
  const links = page.locator('.hero').getByRole('link');
  await expect(links).toHaveText(['Email', 'Google Scholar', 'GitHub', 'LinkedIn', 'CV as PDF']);
  await expect(links.last()).toHaveAttribute('href', '/assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf');
  const portrait = page.locator('.hero img');
  await expect(portrait).toHaveAttribute('fetchpriority', 'high');
  await expect(portrait).not.toHaveAttribute('loading', 'lazy');
  const box = await portrait.boundingBox();
  expect(box.width / box.height).toBeCloseTo(0.8, 1);
});
test('margin facts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.facts dt')).toHaveText(['Now', 'Shipped', 'Under review', 'Ph.D.']);
  await expect(page.locator('.facts dd')).toHaveText(['AI Research Scientist, WRITER, San Francisco',
    'Training data pipeline behind Palmyra x6', 'Two papers on diffusion language models',
    'Rochester Institute of Technology, 2024']);
});
test('selected work', async ({ page }) => {
  // section "Selected work": exactly 3 rows, hrefs in order /research/agentic-rl-744b/, /research/palmyra-x6/, /research/sr-aif/
  // a link "All research" to /research/
});
test('recent news', async ({ page }) => {
  // section#news: exactly 4 items; dates read "Aug 2026", "Feb 2025", "Jan 2025", "Dec 2024"; first item links to /research/palmyra-x6/
});
test('personal note', async ({ page }) => {
  // mentions photography, saxophone, basketball and hiking; its photograph is inside a link to /photography/ and is lazy-loaded
});
```

- [ ] **Step 2: Run the tests.** Expected: FAIL.

- [ ] **Step 3: Implement.**
The two bio paragraphs and all hero wording are copied from the mockup.
The hero, bio, facts and selected work containers carry `data-source="cv"`.
The portrait is `/assets/img/prof_pic.jpg` (3024 by 4032) shown in a 4:5 box with `object-fit: cover`.
The personal note is two sentences in the first person built from the hobbies in the old home page text (photography, saxophone, basketball, hiking), and its photograph is `/assets/photography/mammoth/DSC_0617.JPG` (4496 by 3000) shown wide.
News items keep only `date` in front matter; their text is edited only to remove emoji and emoji codes, fix "exited" to "excited", and write "WRITER".
The new item is dated `2026-08-01` and reads "Our Palmyra x6 technical report is on arXiv." with "Palmyra x6 technical report" linking to `/research/palmyra-x6/`.
News dates are shown as month and year (`%b %Y`).

- [ ] **Step 4: Run `npm test`.** Expected: PASS, including `cv-claims`.

- [ ] **Step 5: Commit** as `feat: add the home page`.

---

### Task 7: Publications

**Files:**
- Create: `_layouts/bib.html`, `_sass/_publications.scss`, `tests/e2e/publications.spec.js`
- Modify: `_bibliography/papers.bib`, `_pages/publications.md`

**Interfaces:**
- Consumes: `_data/under_review.yml`, research entries' `bib_key`.
- Bibliography custom fields: `group = {published}` or `group = {report}`, `arxiv = {<id>}`, `project = {<research slug>}`, `html = {<paper address>}`, `code = {<address>}`.

- [ ] **Step 1: Write the failing tests.**

```js
test('three groups in CV order', async ({ page }) => {
  await page.goto('/publications/');
  await expect(page.locator('main h2')).toHaveText(['Published', 'Technical reports', 'Under review']);
  await expect(page.locator('#published li.pub')).toHaveCount(10);
  await expect(page.locator('#technical-reports li.pub')).toHaveCount(1);
  await expect(page.locator('#under-review li')).toHaveText([
    /Denoising Blocks, Not Tokens.*ICLR 2027/s, /When Are Errors Evidence\?.*ACL ARR October 2026/s]);
  await expect(page.locator('#under-review a')).toHaveCount(0);
});
test('the owner is bold once in every entry', async ({ page }) => { /* each li.pub has exactly one strong, containing "Yang" */ });
test('preprints are folded into their published versions', async ({ page }) => {
  // no entry title starts with "R-AIF:"; "A Neural Active Inference Model of Perceptual-Motor Learning" appears once
  // the SR-AIF entry has links Paper, arXiv (https://arxiv.org/abs/2409.14216) and Project page (/research/sr-aif/)
  // the perceptual-motor entry has an arXiv link to https://arxiv.org/abs/2211.10419
});
test('years run newest first in a gutter', async ({ page }) => { /* #published h3 texts are strictly descending years */ });
test('BibTeX opens in place without custom keys', async ({ page }) => {
  // click the "BibTeX" summary in the SR-AIF entry: its pre is visible, contains "@inproceedings{nguyen2025sr-aif"
  // and none of "selected", "group", "project", "arxiv ="
  // at 320px with every details element open, expectNoOverflow(page)
});
```

- [ ] **Step 2: Run the tests.** Expected: FAIL.

- [ ] **Step 3: Edit `_bibliography/papers.bib`.**
Delete every sample entry that is not the owner's, and delete `nguyen2024r` and `yang2022neural`.
Add `arxiv = {2409.14216}` to `nguyen2025sr-aif` and `arxiv = {2211.10419}` to `yang2023neural`.
Add `du2026palmyra` for "Palmyra x6 Technical Report: An Agentic, Tool-Use Model Post-Trained via Anchored Supervised Fine-Tuning", `journal = {arXiv preprint arXiv:2608.16620}`, `year = {2026}`, `arxiv = {2608.16620}`, `group = {report}`, with the author names as shown on the arXiv page (the CV gives initials: Du, P., Kamble, K., Vasudev, R., Yang, Z., Nadimpally, R., Krishna, A., Alshikh, W., and Bikel, D. M.).
Set `group = {published}` on the ten remaining entries and `project = {<slug>}` on each entry that has a research page.

- [ ] **Step 4: Implement the page and the entry template.**
`bibliography_group_tag` in `_config.yml` is the jekyll-scholar setting for the heading level of the year groups; confirm its name in the jekyll-scholar README when the test first runs.
`_pages/publications.md` renders `<section id="published">` with `{% bibliography --query @*[group=published] %}`, `<section id="technical-reports">` with the `report` query, and `<section id="under-review">` from `_data/under_review.yml`.
`_layouts/bib.html` renders `li.pub`: title, authors with the owner in `strong`, venue line, then plain text links and a `details` element whose `summary` is "BibTeX" and whose `pre` holds `entry.bibtex | hideCustomBibtex`.
The year headings sit in a left gutter on wide screens and above the entries below 820px.
The BibTeX `pre` scrolls inside itself.

- [ ] **Step 5: Run `npm test`.** Expected: PASS.

- [ ] **Step 6: Commit** as `feat: add the publications page`.

---

### Task 8: CV page

**Files:**
- Create: `_data/cv.yml`, `_sass/_cv.scss`, `tests/e2e/cv.spec.js`
- Modify: `_pages/cv.md`

**Interfaces:**
- `_data/cv.yml` keys: `education` (`degree`, `institution`, `location`, `dates`, `details` list), `experience` (`role`, `organization`, `dates`, `summary`), `teaching` (`term`, `course`, `role`, `tools`), `mentoring` (`period`, `who`, `context`).

- [ ] **Step 1: Write the failing tests.**

```js
test('CV page', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.getByRole('link', { name: 'Open the CV as a PDF' })).toHaveAttribute('href', '/assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf');
  await expect(page.locator('main h2')).toHaveText(['Education', 'Professional experience', 'Teaching', 'Mentoring']);
  for (const id of ['education', 'experience', 'teaching', 'mentoring']) await expect(page.locator(`section#${id}`)).toBeVisible();
  await expect(page.locator('#education li')).toHaveCount(3);
  await expect(page.locator('#education li').first()).toContainText('08/2017 - 12/2024');
  await expect(page.locator('#experience li')).toHaveCount(5);
  await expect(page.locator('#teaching li')).toHaveCount(4);
  await expect(page.locator('#mentoring li')).toHaveCount(4);
  await expect(page.locator('main a[href="/publications/"]')).toBeVisible();
  await expect(page.locator('main a[href="/research/"]')).toBeVisible();
});
```

- [ ] **Step 2: Run the test.** Expected: FAIL.

- [ ] **Step 3: Implement.**
`_data/cv.yml` is transcribed from the PDF's Education, Professional Experience, Teaching Experience and Mentoring sections, with the PDF's own wording and dates.
`main` carries `data-source="cv"`.
Each section is a list with the dates in a left gutter, matching the year gutter on Publications.

- [ ] **Step 4: Run `npm test`.** Expected: PASS, including `cv-claims`.

- [ ] **Step 5: Commit** as `feat: add the CV page from one data file`.

---

### Task 9: Photography

**Files:**
- Create: `_data/albums.yml`, `_sass/_photography.scss`, `assets/js/lightbox.js`, `assets/js/lib/gallery.js`, `tests/unit/gallery.test.js`, `tests/e2e/photography.spec.js`, `tests/site/photos.test.js`
- Modify: `_pages/photography.md` (`scripts: [lightbox.js]`)
- Move with `git mv`: `assets/photography/Olympic` to `olympic`, `Sequoia` to `sequoia`, `Lassen & Mt. Shasta` to `lassen-shasta`

**Interfaces:**
- `assets/js/lib/gallery.js` exports `wrapIndex(index: number, count: number): number`.
- `_data/albums.yml`: a list of `{title, slug, photos: [{file, title, width, height}]}`, in the order and with the photo titles of the old page (`git show master:_pages/photography.md`); album titles "Mt. Mammoth", "Olympic Park", "Sequoia", "Lassen and Mt. Shasta"; `width` and `height` from `magick identify -auto-orient -format "%w %h"`.
- DOM: one `section.album` per album with an `h2`; each photo is `a.photo[href$="-2000.webp"]` wrapping an `img`; the lightbox is a single `dialog.lightbox`.

- [ ] **Step 1: Write the failing tests.**

```js
// tests/unit/gallery.test.js
assert.equal(wrapIndex(0, 31), 0);   assert.equal(wrapIndex(31, 31), 0);
assert.equal(wrapIndex(-1, 31), 30); assert.equal(wrapIndex(5, 1), 0);

// tests/site/photos.test.js
// no file under _site/assets/photography matches /\.jpe?g$/i
// for each _site/assets/photography/**/*.webp: `identify -format "%[EXIF:GPSLatitude]"` prints nothing

// tests/e2e/photography.spec.js
test('four albums and 31 photographs', async ({ page }) => {
  await page.goto('/photography/');
  await expect(page.locator('section.album h2')).toHaveText(['Mt. Mammoth', 'Olympic Park', 'Sequoia', 'Lassen and Mt. Shasta']);
  expect(await page.locator('section.album').evaluateAll(s => s.map(a => a.querySelectorAll('a.photo').length))).toEqual([6, 8, 9, 8]);
});
test('thumbnails are resized and lazy', async ({ page }) => {
  // no request URL ends in .jpg or .JPG; every img currentSrc ends in .webp
  // every img after the first album has loading="lazy"
});
test('lightbox with the keyboard', async ({ page }) => {
  // focus the first a.photo and press Enter: dialog.lightbox is open, shows that photo's title, URL unchanged
  // ArrowLeft: shows the last photo (31 of 31); ArrowRight: back to the first
  // Escape: dialog closed and focus is back on the first a.photo
});
test('without JavaScript a thumbnail opens the larger image', async ({ browser }) => {
  // javaScriptEnabled false: clicking the first a.photo navigates to a URL ending in -2000.webp with status 200
});
```

- [ ] **Step 2: Run the tests.** Expected: FAIL.

- [ ] **Step 3: Implement.**
The grid is CSS only: each album is a wrapping flex row, and each photo sets `--ar` (its width divided by its height) in a `style` attribute, with `flex-grow: calc(var(--ar))` and `flex-basis: calc(var(--ar) * 220px)`, so rows are justified without a script.
The lightbox uses the native `dialog` element with `showModal()`, which supplies the focus trap, the backdrop and Escape.
It shows the `-1400.webp` copy with the `-2000.webp` copy in `srcset`, the photo title as a caption, previous and next buttons, and a close button.
The `alt` text of each photograph is its title followed by the album title.

- [ ] **Step 4: Run `npm test`.** Expected: PASS.

- [ ] **Step 5: Commit** as `feat: restyle the photography gallery with resized images and a lightbox`.

---

### Task 10: 404 page and redirects

**Files:**
- Create: `_pages/404.md` (`permalink: /404.html`, `sitemap: false`), `_pages/redirects/{teaching,portfolio,projects,news}.md`, `tests/e2e/other.spec.js`, `tests/site/sitemap.test.js`

- [ ] **Step 1: Write the failing tests.**

```js
test('redirects', async ({ page }) => {
  for (const [from, to] of [['/teaching/', '/cv/#teaching'], ['/portfolio/', '/research/'],
                            ['/projects/', '/research/'], ['/news/', '/#news']]) {
    await page.goto(from);
    await page.waitForURL(url => url.pathname + url.hash === to);
  }
});
test('unknown addresses get the 404 page', async ({ page }) => {
  const response = await page.goto('/blog/');
  expect(response.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.locator('main a[href="/"]')).toBeVisible();
  await expect(page.locator('main a[href="/research/"]')).toBeVisible();
});
// tests/site/sitemap.test.js: sitemap.xml lists /, /research/, /publications/, /cv/, /photography/ and every
// /research/<slug>/, and lists none of /teaching/, /portfolio/, /projects/, /news/, /404.html
```

- [ ] **Step 2: Run the tests.** Expected: FAIL.

- [ ] **Step 3: Implement.**
Each redirect file has only `permalink`, `redirect_to` and `sitemap: false`.
The 404 page says in one sentence that the page does not exist and offers links to Home and Research; it does not redirect automatically.

- [ ] **Step 4: Run `npm test`.** Expected: PASS.

- [ ] **Step 5: Commit** as `feat: add the 404 page and redirects for retired addresses`.

---

### Task 11: Deploy workflow and documentation

**Files:**
- Rewrite: `.github/workflows/deploy.yml`, `CLAUDE.md`, `README.md`
- Create: `lighthouserc.json`

- [ ] **Step 1: Rewrite `deploy.yml`** as one job on `ubuntu-latest` with the same triggers and permissions as today, and these steps in order: checkout; `ruby/setup-ruby` with `ruby-version: '3.4'` and `bundler-cache: true`; `actions/setup-node` with Node 22 and npm cache; `sudo apt-get install -y imagemagick webp poppler-utils`; `npm ci`; `npx playwright install --with-deps`; `npm run build:test`; `npm run test:unit`; `npm run test:e2e`; `JEKYLL_ENV=production bundle exec jekyll build`; `npm run test:site`; `npm run check:links`; then the existing `JamesIves/github-pages-deploy-action@v4` step with `folder: _site`, still skipped for pull requests.
The steps that installed Jupyter, mermaid and purgecss and the step that edited `giscus.repo` are removed.

- [ ] **Step 2: Add `lighthouserc.json`** with `collect.staticDistDir` `_site`, `collect.url` `["http://localhost/index.html"]`, `numberOfRuns` 3, `settings.blockedUrlPatterns` for `*googletagmanager.com*` and `*google-analytics.com*`, and assertions: `categories:performance` minimum 0.95, `categories:accessibility` minimum 1, `largest-contentful-paint` at most 2500, `cumulative-layout-shift` at most 0.1.
Add the npm script `lighthouse`: `lhci autorun`.

- [ ] **Step 3: Rewrite `CLAUDE.md` and `README.md`** to describe the site as it now is: the structure in "File Structure", how to add a research entry, a publication, a news item and a photograph, the local commands (`bundle exec jekyll serve`, `npm test`, `npm run lighthouse`), the font sources and versions with their licence, and the rule that all content comes from the CV or published papers.
Remove every instruction about al-folio, Docker, the portfolio modal and purgecss.
Each full sentence goes on its own line.

- [ ] **Step 4: Verify.**
Run `pre-commit run --all-files`. Expected: all hooks pass.
Run `JEKYLL_ENV=production npm run build && npm run test:site && npm run check:links && npm run lighthouse`. Expected: all pass, and Lighthouse meets every assertion.

- [ ] **Step 5: Commit** as `ci: test the site before deploying and document the new structure`.

---

### Task 12: Release verification and owner review

**Files:**
- Create: `docs/superpowers/plans/2026-11-12-site-redesign-notes.md` (local working notes and the handover list; not linked from the site)

- [ ] **Step 1: Run the whole suite from a clean build.** `rm -rf _site .jekyll-cache && npm test`, then `JEKYLL_ENV=production npm run build && npm run test:site && npm run check:links && npm run lighthouse`. Expected: PASS in Chromium, Firefox and WebKit, and Lighthouse meets every assertion.

- [ ] **Step 2: Check the production build in a browser.**
Serve the production build, block requests to Google domains at the network layer, open every page in `PAGES`, and confirm the console shows no Content-Security-Policy violation and no error.

- [ ] **Step 3: Review every page by eye.**
Take full-page screenshots of every page in `PAGES` at 320, 768, 1024 and 1440px in both themes, and screenshots of the open phone menu, an active topic filter, an open BibTeX block and the open lightbox.
Compare Home, the research list and a project page against the mockup.
Fix anything that looks off (alignment, spacing rhythm, orphaned words in headings, image crops, focus rings), add a test where the defect is testable, and commit each fix.

- [ ] **Step 4: Write the handover list** in the notes file: entries that shipped without a figure and why, links that could not be confirmed, and anything the owner must supply (a Meow Translator link, figures for WRITER work).

- [ ] **Step 5: Owner review.**
Start `bundle exec jekyll serve --port 4000` and give the owner `http://127.0.0.1:4000` with the handover list.
Wait for approval.
Only after approval, and only on the owner's instruction: push `redesign`, open a pull request to `master` (which runs the full workflow without deploying), and merge when it is green.
