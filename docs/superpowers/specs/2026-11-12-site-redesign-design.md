# Personal site redesign: design

Date: 2026-11-12

## Intent

The site at https://george614.github.io is the personal website of Zhizhuo (George) Yang, an AI Research Scientist at WRITER.
It is built on the al-folio academic Jekyll template and still looks like one.
Its subtitle points to his former PhD lab, it carries a dark starfield animation, and it still publishes the template's sample blog posts, placeholder projects and sample bibliography entries.

The owner wants a modern, elegant site that suits him.
The audience is recruiters, potential collaborators, and researchers who have just read one of his papers.
Within ten seconds a visitor should understand that he is a senior industry researcher who trains very large language models end to end, and that he has taste.

## Goals

- Replace the template look with the approved "Field notes" design described below.
- Lead with current work: reinforcement learning and post-training for LLM agents at WRITER.
- Bring the important facts from the November 2026 CV onto the site.
- Add a research section: a list of projects and papers, each with its own page holding a short summary, a figure and links.
- Keep the photography gallery, restyled to match.
- Remove all template sample content.

## Non-goals

- No blog.
  The site has no real posts, so the blog, its archives, comments and the RSS feed are removed.
- No change of hosting or build system.
  The site stays a Jekyll site deployed to GitHub Pages by the existing `deploy` workflow.
- No new photographs or new written research content beyond what the CV and the papers already say.

## Anti-goals

- It must not look like a template, including the common "AI-generated" looks: cream background with a terracotta accent, near-black with a neon accent, or identical rounded cards everywhere.
- No particle or starfield background, and no decorative scroll animations.
- No fact, number or claim that is not in the CV PDF or in a published paper.
  The CV PDF at `assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf` is the source of truth for all biographical and project content.
- No all-capital label text, no emoji in site copy, and no em dashes in any copy.

## The approved design

The owner reviewed three home page directions in the browser and chose direction A, "Field notes", then approved a second mockup that added navigation, a research list and a project page.
The approved mockup is saved at `.superpowers/brainstorm/45367-1794509845/content/field-notes-nav-v2.html`.
That file is the visual reference for layout, type, colour and navigation behaviour.
It is a reference, not production code.
The directory is git-ignored, so the builder copies the file to `docs/superpowers/specs/assets/field-notes-mockup.html` as the first step.

### Visual language

- **Palette.**
  The colours come from the owner's own Sierra Nevada photographs: granite grey, sky blue and the gold of dry grass.
  Light theme: paper `#f7f9fa`, ink `#17222c`, soft text `#53626f`, rule `#d5dce2`, blue `#1f5d8c`, gold `#a06d0c`, tint `#e8eef2`.
  Dark theme: paper `#111a22`, ink `#e4eaef`, soft text `#9aa9b6`, rule `#283642`, blue `#86bbe8`, gold `#e0b04f`, tint `#1b2833`.
  Blue is for links and figures.
  Gold is for venue and date labels and the current-page marker.
- **Type.**
  Newsreader (serif) for headings, the hero statement and long-form body text.
  Hanken Grotesk (sans) for navigation, labels, summaries and metadata.
  Both fonts are self-hosted as subsetted WOFF2 files with `font-display: swap`.
- **Layout.**
  One centred column of at most 1080px.
  Content is left aligned.
  A recurring two-column pattern puts prose on the left and a narrow margin column of key facts on the right.
  Sections are separated by thin rules and generous vertical space, not by cards or shadows.
- **Motion.**
  Only motion that answers an action: hover and focus states, the theme switch, the phone menu.
  `prefers-reduced-motion` is respected.

### Navigation

- A header that stays at the top while scrolling, with a translucent blurred background and a bottom rule that appears once the page has scrolled.
- The owner's name on the left links home.
- Links: Home, Research, Publications, CV, Photography.
- The current page is marked with a gold underline and `aria-current="page"`.
  Project pages mark Research as current.
- A theme button switches between light and dark.
  The theme follows the visitor's system setting by default, and a manual choice is remembered in `localStorage`.
  The theme is applied before first paint so the page does not flash.
- Below 820px the links collapse into a menu button that opens a full-width list.
- A footer on every page repeats the contact links: Email, Google Scholar, GitHub, LinkedIn.

## Pages

### Home (`/`)

1. Hero: the statement "I train large language models to act, not only to answer.", one line on role and employer including "I also go by George", contact links (Email, Google Scholar, GitHub, LinkedIn, CV as PDF), and the portrait `assets/img/prof_pic.jpg` cropped 4:5.
2. A two-paragraph bio on the left and a margin column of four facts on the right (Now, Shipped, Under review, Ph.D.), with the wording used in the mockup.
3. Selected work: the research entries marked as featured, in the same row style as the research list, with an "All research" link.
   The initial featured entries are the 744B-parameter agent work, the Palmyra x6 technical report, and SR-AIF.
4. Recent news: the four most recent items, each a date and one sentence.
   This section was not in the mockup and is the designer's call.
5. A short personal note (photography, saxophone, basketball, hiking) with one wide photograph from the gallery that links to Photography.
   This borrows the one element the owner might want from the photo-led direction and is the designer's call.

### Research list (`/research/`)

- A short introduction, then topic filter buttons that stay visible under the header while scrolling: All, LLM agents and RL, Diffusion language models, Active inference, Eye tracking and VR.
- Entries newest first.
  Each row has a figure thumbnail, a title, a one or two sentence summary, and a gold venue or date label, and links to the project page.
- Filtering works without a page reload and is reflected in the URL (for example `/research/?topic=diffusion`) so a filtered view can be shared.
  With JavaScript disabled, all entries are shown.
- Below the research entries, a section titled "Software" lists the three existing side projects from `_pages/portfolio.md` in the same row style, each with its own project page: GPU Memory Calculator, AI Interview Prep, and Meow Translator.
  The modal interface is dropped.
- The text and screenshots for GPU Memory Calculator and AI Interview Prep are carried over from the current portfolio page.
- Meow Translator is the entry the current page calls "My iOS App".
  The owner confirmed its name.
  Its current description and feature list are generic placeholder text and are not carried over.
  The new description is written only from what its four screenshots in `assets/portfolio/` show: an iPhone app that listens to a cat's meows and reports the emotion it hears (happy, playful, calm or curious), with Listen, History and Settings tabs.
  The current page's App Store and GitHub links are empty placeholders, so the entry has no links unless the owner supplies them.

### Project page (`/research/<slug>/`)

- A trail at the top: "Research / <topic>".
- Title, authors and venue line, and link buttons (paper, arXiv, code, and others as available).
- One large figure with a caption.
- A summary in prose and a short "Main results" list on the left; a margin column of key facts on the right (for example method, scale, framework, related work).
- At the bottom, a link back to the list and a link to the next project.

Research entries are a Jekyll collection, one Markdown file per project, with front matter for title, topic, date, venue label, summary, authors, links, figure, figure caption, margin facts, and a featured flag.

Initial entries, all drawn from the CV:

| Entry | Topic | Source |
|---|---|---|
| Reinforcement learning for a 744B-parameter agent | LLM agents and RL | CV, "LLM post-training and agentic RL" |
| Palmyra x6 technical report | LLM agents and RL | arXiv 2608.16620 |
| Self-evolving agentic AI systems | LLM agents and RL | CV |
| Differential Transformer with low-rank adapters | LLM agents and RL | CV |
| SR-AIF | Active inference | ICRA 2025 |
| A neural active inference model of perceptual-motor learning | Active inference | Frontiers in Computational Neuroscience 2023 |
| Gaze-in-Wild | Eye tracking and VR | Scientific Reports 2020 |
| RIT-Eyes | Eye tracking and VR | ACM SAP 2020 |
| Passive haptics based mixed reality system | Eye tracking and VR | ISMAR 2016 and VRCAI 2016 |

Papers under review:

- The two diffusion language model papers under review ("Denoising Blocks, Not Tokens" at ICLR 2027 and "When Are Errors Evidence?" at ACL ARR October 2026) get no project page and are not featured on the home page.
  This is the owner's decision, and it holds until a paper is accepted or posted on arXiv.
- They appear in two places only, by title and venue, with no authors, summary or results: the "Under review" group on Publications, and a plain non-clickable row under the "Diffusion language models" topic on the research list.
- The home page margin fact "Under review: Two papers on diffusion language models" stays.

Figures:

- For published, publicly available papers, use a figure from the paper itself, saved locally under `assets/img/research/`, with a caption that credits the paper.
- For work that is internal to WRITER, no figure is public.
  Those entries are shown without a figure until the owner supplies one.
  The row and project page layouts must look intentional without a figure, not broken.
  No invented charts or illustrative diagrams stand in for real results.

### Publications (`/publications/`)

- Generated from `_bibliography/papers.bib` with jekyll-scholar, restyled as a list with a year gutter, as in the first mockup.
- Three groups, matching the CV: Published, Technical reports, Under review.
- The owner's name is bold in author lists.
- Each entry has plain text links where available: paper, arXiv, code, project page, and a toggle that shows the BibTeX.
- The template's sample Einstein entries are deleted from the bibliography, and the Palmyra x6 technical report is added.
- Papers under review are listed by title and venue only, as in the CV.
- The bibliography holds four real entries that the CV's list leaves out.
  The owner approved this handling.
  The two arXiv preprints (R-AIF, 2024, and the perceptual-motor learning paper, 2022) are not listed separately; each becomes an "arXiv" link on its published version.
  The two Journal of Vision abstracts (2019 and 2022) are listed under Published.

### CV (`/cv/`)

- A button that opens the CV PDF.
- An HTML version of the main CV sections, written from the PDF: Education, Professional experience, Teaching, Mentoring.
  Publications and research are linked to their own pages instead of repeated.
- The data lives in one YAML file under `_data/`.
  The out-of-date `assets/json/resume.json` and the remote JSON resume mechanism are removed.
- The PhD dates are 08/2017 to 12/2024, as in the PDF.

### Photography (`/photography/`)

- Keeps the existing 32 photographs and their four albums (Mammoth, Olympic, Sequoia, Lassen and Mt. Shasta).
- Restyled in the new visual language: album headings, a justified or masonry grid, and a lightbox that opens the larger image with keyboard support.
- The page loads resized thumbnails, not the full-size originals, and lazy-loads images below the first screen.

### Other

- A 404 page in the new style.
- `/teaching/` redirects to `/cv/#teaching`.
- `/portfolio/` and `/projects/` redirect to `/research/`.
- `/blog/` and the sample posts are removed without redirects.

## Content rules

- Site copy is written in the first person, in plain sentences, in sentence case.
- All numbers and claims are copied from the CV or the paper, not rounded up or reworded into stronger claims.
- The existing news items are kept, lightly edited to remove emoji and fix spelling.
  News for 2025 and 2026 may be added only for events the CV states with a date (joining WRITER in 02/2025, and the Palmyra x6 report in 2026).
- The contact email shown on the site is the one already in `_config.yml`.

## How it gets made

These are the designer's calls, not decisions the owner made.

- **Keep Jekyll, replace the theme.**
  The al-folio layouts, includes, Sass, and JavaScript are removed and replaced by a small hand-written theme: semantic HTML layouts, one stylesheet built from Sass partials with design tokens as CSS custom properties, and a few small vanilla JavaScript modules (theme, menu, research filter, lightbox, BibTeX toggle).
  Bootstrap, MDB, jQuery, Font Awesome, particles and the template's animation scripts are removed.
- **Keep jekyll-scholar** for the bibliography, with a new entry template.
- **Remove unused plugins and their config**: archives, diagrams, feed, get-json, jupyter-notebook, paginate, twitter, toc, giscus and disqus settings.
  Keep sitemap, minifier, imagemagick or an equivalent for responsive images, and email-protect if still used.
- **Keep Google Analytics** with the existing measurement ID, loaded asynchronously.
- **Third-party requests.**
  Apart from Google Analytics, pages load nothing from other domains: fonts, scripts and images are all local.
  MathJax is removed because no page uses mathematics.
- **CSS purge.**
  The purgecss step in the deploy workflow is removed, since the hand-written stylesheet has no unused framework CSS.
- **Housekeeping.**
  `CLAUDE.md` and `README.md` are updated to describe the new structure.
  The `.gitignore` entry for `.superpowers/` is kept.

## Quality bar

- Works from 320px to 1920px wide with no horizontal scrolling.
- Both themes meet WCAG AA contrast for text.
- Every interactive element is reachable and usable by keyboard with a visible focus ring.
- Images have width, height and alt text.
- Lighthouse on the home page, mobile profile: performance 95 or higher, accessibility 100, with LCP under 2.5s and CLS under 0.1.
- The production build has no errors, and a link check over the built site finds no broken internal links.
- Pages are checked in the browser at 320, 768, 1024 and 1440px in both themes before release.

## Delivery

- Work happens on a `redesign` branch.
  The live site is not changed until the owner has seen the finished site running locally and approved it.
- The local build uses Ruby 3.4 through mise, as recorded in the project memory, because Docker is not usable on this machine.
- After approval the branch is merged to `master`, which deploys the site.

## Left to the builder

- Exact spacing, type scale steps and breakpoints, guided by the mockup.
- The photography grid algorithm and lightbox implementation.
- The Sass file structure and JavaScript module boundaries.
- How responsive image sizes are generated.
- Slugs for research entries.
- Which published figure best represents each paper.
