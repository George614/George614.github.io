# Site redesign: handover notes

These are local working notes for the owner's review of the `redesign` branch.
They are not linked from the site, and the build does not publish the `docs` folder.

## Entries that have no figure

Three research entries describe work at WRITER that has no public paper, so they have no figure and no links:

- `_research/agentic-rl-744b.md` (Reinforcement learning for a 744B-parameter agent)
- `_research/self-evolving-agents.md` (Self-evolving agentic AI systems)
- `_research/differential-transformer-lora.md` (Differential Transformer with low-rank adapters)

Their text comes only from the CV.
If you can share a figure or a public link for any of them, add it under `figures:` or `links:` in the file, as the README describes.

## Links that could not be confirmed

- The Gaze-in-Wild paper names a dataset page at `cis.rit.edu/~rsk3900/gaze-in-wild/`, which returns "not found", so the project page has no Dataset link. If the dataset has moved, send the new address.
- Meow Translator has no link, because I found no public App Store or code page for it. Add one under `links:` in `_research/meow-translator.md` if it exists.

## Content to confirm

- The ISMAR 2016 paper ("Perceptual issues of a passive haptics feedback based MR system") is paywalled and I found no open copy. The passive haptics project page describes it from its abstract only, and its numbers and figure come from the VRCAI 2016 paper.
- The third author of that ISMAR paper is spelled "Zhengliang Zhang", as IEEE and Crossref print it. Please confirm the spelling.
- The Palmyra x6 co-author is spelled "Alshikh", as the arXiv listing and the CV spell it. The report's PDF title block spells it "AlShikh".
- The RIT-Eyes project page is written from arXiv version 1 of the paper.
- The Palmyra x6 page credits you with the synthetic tool-use data pipeline, the one CV bullet that names Palmyra x6. The question-generation and rejection-sampling bullets from the same CV section are not tied to Palmyra x6 on the page, because neither the CV nor the report links them to it. Tell me if they belong there.

## Photography titles

The photograph titles are kept exactly as on the old site, but three of them do not describe their picture:

- `DSC_0617`, titled "Frozen Trees", shows a stream in an autumn valley.
- `DSC_0299`, titled "River Crossing", shows bracket fungus on a tree trunk.
- `DSC_0457`, titled "Morning Light", is in the Mt. Mammoth album but shows Half Dome in Yosemite.

New titles, or a move of `DSC_0457` to another album, are one-line changes in `_data/albums.yml`.

## Smaller decisions for you

- The home page title in search results is "Zhizhuo Yang | AI Research Scientist at WRITER, working on reinforcement learning and post-training for LLM agents.", about 120 characters, which search engines cut off. A shorter `description` in `_config.yml` would fix it.
- The older news items keep their original wording, for example "Super excited to announce that our paper ... has been accepted at ICRA 2025!". Only the four newest appear on the home page.
- `LICENSE` is still the MIT licence of the al-folio theme. Whether the site's own text and photographs need a licence is your call.

## Checks run on the final branch

- The full test suite passes in Chromium, Firefox and WebKit, together with the site checks and the link check.
- Lighthouse on the home page, on a phone profile: performance 0.99, accessibility 1, largest contentful paint 2.1 seconds, layout shift 0.
- Every page was opened in the production build with Google requests blocked, with no console errors and no Content Security Policy violations.
- Every page was looked at in full-page screenshots at 320, 768, 1024 and 1440 pixels wide in both themes, together with the open phone menu, an active topic filter, an open BibTeX block and the open photo viewer.
