# george614.github.io

The personal site of Zhizhuo Yang, an AI research scientist working on reinforcement learning and post-training for LLM agents.
It is a static site built with Jekyll and published with GitHub Pages at <https://george614.github.io>.

## Pages

| Address | What it shows | Built from |
| --- | --- | --- |
| `/` | Introduction over a contour map, a short bio, the career path, selected work, recent news, photographs | `_layouts/home.html`, `_research/`, `_news/`, `_data/path.yml`, `_data/home_photos.yml` |
| `/research/` | Research projects with a topic filter, software, papers under review | `_layouts/research.html`, `_research/`, `_data/topics.yml`, `_data/under_review.yml` |
| `/research/<name>/` | One project: summary, figure, links, results, key facts | `_layouts/project.html`, one file in `_research/` |
| `/publications/` | Published papers, technical reports, papers under review | `_pages/publications.html`, `_bibliography/papers.bib`, `_data/under_review.yml` |
| `/cv/` | Education, experience, teaching and mentoring, with a link to the PDF | `_pages/cv.html`, `_data/cv.yml`, `assets/pdf/` |
| `/photography/` | Photo albums with a full-screen viewer | `_pages/photography.html`, `_data/albums.yml`, `assets/photography/` |

The old addresses `/teaching/`, `/portfolio/`, `/projects/` and `/news/` redirect to their new places, and any other unknown address shows the page in `_pages/404.md`.

## Where the content comes from

Every fact, number and claim on the site comes from the CV (`assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf`) or from a published paper.
Numbers are copied as written, never rounded up or strengthened.
A link is added only after it has been opened and confirmed to show the named work.
A browser test checks that every number in a part of a page marked `data-source="cv"` also appears in the CV PDF.

## Running the site locally

You need Ruby 3.4, Node 22, ImageMagick with WebP support, and `pdftotext` from Poppler (used by one test).
On macOS: `brew install imagemagick webp poppler`.

```bash
bundle install
npm ci
npx playwright install
bundle exec jekyll serve    # http://localhost:4000, rebuilds on every change
```

The first build takes a few minutes, because it makes resized WebP copies of every image.
Later builds only redo images that changed.

## Tests

```bash
npm test             # everything below except Lighthouse, in this order
npm run build:test   # builds the site with the test-only fixture pages
npm run test:unit    # pure JavaScript logic, with at least 80% line coverage
npm run test:e2e     # browser tests in Chromium, Firefox and WebKit
npm run build        # production build (set JEKYLL_ENV=production to include analytics)
npm run test:site    # checks over the built _site folder
npm run check:links  # every internal link and image resolves
npm run lighthouse   # performance and accessibility of the home page, run after a production build
```

`npm run lighthouse` runs Lighthouse three times on the home page with its mobile profile and checks the median against `lighthouserc.json`: performance at least 0.95, accessibility 1, largest contentful paint at most 2.5 seconds and cumulative layout shift at most 0.1.
It serves the site over HTTP/2 with gzip, as GitHub Pages does, and blocks Google Analytics so that only the site itself is measured.

## Publishing

Every push to `master` runs `.github/workflows/deploy.yml`.
It builds the site, runs the unit, browser, site and link tests, and publishes `_site` to the `gh-pages` branch only if all of them pass.
Pull requests, and manual runs on any other branch, run the same tests without publishing.

## Adding content

### A research project

Create `_research/<name>.md`; the page appears at `/research/<name>/`.

```yaml
---
title: "SR-AIF: sparse-reward robotics from pixels"
kind: research                 # research or software
topic: active-inference        # research only: a key from _data/topics.yml
sort_date: "2025-07-01"        # research only: orders the list, newest first; never shown
order: 1                       # software only: position in the software list
label: "ICRA 2025"             # venue or context, shown under the summary
summary: "One sentence for the list."
authors: "Viet Dung Nguyen, Zhizhuo Yang, Christopher L. Buckley and Alexander Ororbia."
featured: true                 # also show it under Selected work on the home page
highlight: 3                   # the newest featured entry quotes this result on the home page, counting from 1
bib_key: nguyen2025sr-aif      # the matching entry in _bibliography/papers.bib
links:
  - { label: "Paper", href: "https://doi.org/..." }
figures:                       # the first figure is also the thumbnail in lists
  - src: /assets/img/research/sr-aif.png
    alt: "What the figure shows, in a sentence or two."
    width: 1560
    height: 650
figure_caption: "Where the figure comes from."
diagram: rl-loop.svg           # instead of figures: a diagram from _includes/diagrams/, shown with figure_caption
results:
  - "One main result per item."
facts:
  - { label: Method, value: "..." }
  - { label: Related, value: "Another project", href: "/research/other/" }
---
The body: two or three short paragraphs on the problem and the approach.
```

Only `title`, `kind` and `summary` are required.
Leave out any other key and its part of the page is left out too.
For a project page, use `sort_date` as the publication month (the first day of the month), or 1 July of the year when the month is unknown.
For a project at WRITER, use the last day of its end month.
Put figures in `assets/img/research/`, with no spaces and no dots in the file name other than the extension, and give the original width and height.
The site publishes only resized WebP copies of each figure, with the image metadata removed.
To add a topic, add a `key` and `title` to `_data/topics.yml`.

A diagram is an inline SVG file in `_includes/diagrams/`, drawn with the classes in `_sass/_diagram.scss` so that it follows the theme.
It needs `role="img"` and a `<title>` that describes it in words.
A project with a diagram shows it on its page in place of a figure, and on its card under Selected work.

### The home page

The career path under "The way here" lists the steps in `_data/path.yml`, oldest first, with a year, a title and a place for each, all taken from the CV.
The last step is marked as the present one.
The photographs under "Outside work" are listed in `_data/home_photos.yml`, by album slug and file name from `_data/albums.yml`, each with its own alt text; the first is shown largest.

### A publication

Add a BibTeX entry to `_bibliography/papers.bib`.
These extra keys control how it is shown, and are hidden from the BibTeX that readers can copy:

- `group = {published}` or `group = {report}` puts it under Published or Technical reports.
- `arxiv = {2409.14216}` adds an arXiv link.
- `code = {https://...}` adds a Code link.
- `project = {sr-aif}` adds a link to `/research/sr-aif/`.
- `html = {https://...}` sets the Paper link when the entry has no `doi`.

Your own name is shown in bold, matched by the `scholar` names in `_config.yml`.
A paper under review goes in `_data/under_review.yml` instead, with its title, venue, topic and a `sort_date`; it is listed by title and venue only.

### A news item

Create a file in `_news/`, for example `_news/2026-08-palmyra-x6.md`, with only a date in the front matter and one sentence of Markdown below it:

```markdown
---
date: 2026-08-01
---

Our [Palmyra x6 technical report](/research/palmyra-x6/) is on arXiv.
```

The date sets the order, whatever the file name, and the home page shows the four most recent items.

### A photograph

Copy the photograph into an album folder in `assets/photography/`, with no spaces and no dots in the file name other than the extension.
Then add it to that album in `_data/albums.yml`:

```yaml
- { file: DSC_0457.JPG, title: "Morning Light", width: 4496, height: 3000 }
```

The width and height are those of the photograph as it is displayed, after any camera rotation; `magick DSC_0457.JPG -auto-orient -format '%w %h' info:` prints them.
A new album is a new folder and a new entry in `_data/albums.yml` with a `title`, a `slug` (the folder name) and its `photos`.
The site publishes resized WebP copies with the camera metadata removed; the originals stay in the repository and are not published.

### The CV

The CV page is built from `_data/cv.yml`, transcribed from the PDF in `assets/pdf/`.
To update it, replace the PDF, update `_data/cv.yml` with the same wording and dates, and change the PDF file name in `_pages/cv.html` and in `tests/e2e/cv-claims.spec.js` if it changed.

## Design

The layout is one centred column at most 1080px wide, with a light and a dark theme that follow the system setting and can be switched from the header.
Colours, spacing and type sizes are defined once in `_sass/_tokens.scss`.

The home page artwork is drawn by `scripts/landscape.mjs`, which is deterministic, so the same script always writes the same files:

- `assets/img/terrain.svg`, the contour lines of an imaginary mountain, used as a CSS mask so that the lines take the theme's `--terrain` colour.
- `_includes/terrain-trail.svg`, the gold path that climbs from the foothills to the summit, drawn over the same view box when the page loads.
  With reduced motion turned on, the path is shown already drawn.
- `_data/ridge.json`, the ridge that the career path climbs, sampled every 5 units across its width.

Run `npm run art` after changing the script; a site test fails if the committed files differ from what it draws.

The terrain and the climb to its summit live in `assets/js/lib/terrain.js`, which both the script and the page use.
On the page, `assets/js/terrain-map.js` makes the map answer the pointer.
Moving over the map lights the contour lines near the pointer and previews, as a dotted line, the climb from there to the summit.
A click, or a tap on a phone, draws that climb in gold, and the last three climbs stay on the map.
A line under the map tells visitors that they can climb it; without JavaScript the line stays hidden and the map is still.

The fonts are [Newsreader](https://github.com/productiontype/Newsreader) for headings and long-form text, and [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk) for navigation, labels and metadata.
Both are self-hosted variable fonts from the `@fontsource-variable/newsreader` and `@fontsource-variable/hanken-grotesk` packages, version 5.3.0, in their `latin` and `latin-ext` subsets.
They are licensed under the SIL Open Font License 1.1, whose text is in `assets/fonts/`.
Each file is cut down to the weights the site uses, 400 to 600, with fontTools:

```bash
python3 -c "
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
import sys
for path in sys.argv[1:]:
    font = instancer.instantiateVariableFont(TTFont(path), {'wght': (400, 600)})
    font.flavor = 'woff2'
    font.save(path)
" assets/fonts/*.woff2
```

## Licence

`LICENSE` is the MIT licence of the al-folio theme that this site was first built on.
