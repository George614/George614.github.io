# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an academic personal website built with the **al-folio** Jekyll theme. The site is hosted on GitHub Pages and automatically deploys on push to the `master` branch.

## Common Commands

### Local Development (Docker - Recommended)
```bash
docker compose pull    # Pull latest image
docker compose up      # Start development server
```

The site will be available at `http://localhost:8080`. To change the port, edit `docker-compose.yml`.

### Local Development (Legacy - Ruby/Bundler)
```bash
bundle install                          # Install Ruby dependencies
pip install jupyter                     # Install Jupyter for notebook support
bundle exec jekyll serve --lsi          # Start development server at http://localhost:4000
```

### Building for Production
```bash
bundle exec jekyll build --lsi          # Build static site to _site/
npm install -g purgecss                 # Install purgecss if needed
purgecss -c purgecss.config.js          # Remove unused CSS classes
```

### Deployment
- **Automatic**: Push to `master` branch triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Manual**: Go to Actions → Deploy → Run workflow

The deploy workflow builds the site with Ruby 3.2.2 and deploys to the `gh-pages` branch.

## Site Structure and Architecture

### Configuration Files
- `_config.yml` - Main Jekyll configuration (site metadata, plugins, scholar settings, theme colors)
- `Gemfile` - Ruby gem dependencies for Jekyll plugins
- `purgecss.config.js` - Configuration for removing unused CSS

### Content Directories
- `_pages/` - Site pages (about, publications, projects, CV, etc.)
- `_posts/` - Blog posts with front matter (YYYY-MM-DD-title.md format)
- `_projects/` - Project portfolio entries
- `_news/` - News/announcement items displayed on homepage
- `_bibliography/` - BibTeX files for publications (parsed by jekyll-scholar)

### Layouts and Templates
- `_layouts/` - Page layout templates (about, bib, cv, distill, post, etc.)
- `_includes/` - Reusable components (header, footer, social, scripts, etc.)
- `_sass/` - SASS/SCSS stylesheets
- `assets/` - Static assets (images, PDFs, CSS, JS, fonts, etc.)

### Plugins
- `_plugins/` - Custom Jekyll plugins:
  - `cache-bust.rb` - Cache busting for assets
  - `details.rb` - BibTeX details page generation
  - `external-posts.rb` - External blog post integration
  - `file-exists.rb` - File existence checker
  - `hideCustomBibtex.rb` - Filters internal bibtex keywords from display

### Key Jekyll Collections
- `news` - Announcements shown on homepage
- `projects` - Portfolio projects displayed in grid layout

## Content Management

### Adding Publications
Edit `_bibliography/papers.bib` with standard BibTeX entries. Custom keywords control display:
- `selected=true` - Highlights publication on homepage
- `abstract` - Adds expandable abstract
- `pdf`, `code`, `blog`, `website` - Add link buttons
- `arxiv` - Links arXiv preprint
- `bibtex_show` - Shows BibTeX entry

### Adding Blog Posts
Create files in `_posts/` with format `YYYY-MM-DD-title.md`. Front matter options:
- `title`, `date` - Required
- `related_posts: false` - Disable related posts section
- Use Jekyll/Distill tags for special formatting

### Adding Projects
Create markdown files in `_projects/` with front matter including:
- `title`, `image`, `description`
- `authors`, `venue`, `year` (optional)

### News Items
Create markdown files in `_news/` - automatically displayed on homepage if `announcements.enabled: true` in `_config.yml`

## Theme Customization

### Colors
Edit `_sass/_themes.scss` to change `--global-theme-color`. Additional theme colors in `_sass/_variables.scss`.

### Personal Info
Edit these fields in `_config.yml`:
- `first_name`, `last_name`, `email`
- Social links (`github_username`, `linkedin_username`, etc.)
- `scholar_userid` for Google Scholar integration

### Author Identification
Publications highlight your name based on:
```yaml
scholar:
  last_name: [Yang]
  first_name: [Zhizhuo]
```

Co-authors are linked automatically via `_data/coauthors.yml`.

## Important Notes

- GitHub Actions auto-updates `giscus.repo` in `_config.yml` during deployment
- Site builds with `JEKYLL_ENV=production` for optimization
- Images in `assets/img/` are automatically processed to responsive WebP formats via jekyll-imagemagick
- MathJax is enabled by default (`enable_math: true`)
- Dark mode toggle is enabled (`enable_darkmode: true`)
- Bootstrap table integration version is configurable via `bootstrap-table.version` in `_config.yml`

## Portfolio vs Projects Collections

### Important: Two Different Systems
The site has **two separate project systems**:

1. **`_pages/portfolio.md`** - The main portfolio page at `/portfolio/`:
   - Uses **custom HTML** (not Jekyll collections)
   - Projects are hardcoded in the page with custom styling
   - Modal-based interface with project details
   - Used for showcasing work with interactive previews

2. **`_pages/projects.md`** - A Jekyll collection-based page at `/projects/`:
   - Uses the `site.projects` collection
   - Projects are defined as markdown files in `_projects/` folder
   - Standard card-based layout
   - Less frequently used

**When adding new projects**: Add them to `_pages/portfolio.md` with proper modal structure, NOT to the `_projects/` collection.

## Common Pitfalls

### Jekyll Front Matter
- **Never use `url` in front matter** - it's a reserved Jekyll variable that conflicts with collection permalinks
- Use `github` instead for repository links
- Use `img` for image paths (local paths only, not remote URLs)

### Modal Design
- **Always use light backgrounds (white) with dark text (black)** for maximum readability
- Dark backgrounds with light text reduce readability and create accessibility issues
- Use `padding-top` on the modal overlay (not just content padding) to clear fixed navbar
- Modal should have `position: fixed; inset: 0; padding-top: 50px;` to avoid cropping

### Image Handling
- **Always use local images** in `assets/` directory
- Download remote images before referencing them
- Convert HEIC images to JPEG using: `sips -s format jpeg [source] --out [destination]`
- Images are automatically processed to WebP formats by jekyll-imagemagick

### Testing with Playwright
When making UI changes:
1. Always test with Playwright's `browser_take_screenshot` with `fullPage: true`
2. Use `browser_evaluate` to check scrollability and element positions
3. Verify that modals are not cropped (top/bottom should be visible)
4. Test both opening and closing modals
5. Check that all links and interactive elements work

### Development Workflow
- Use `docker compose up` for local development (port 8080)
- Changes auto-reload via LiveReload
- For image conversions, macOS `sips` command is preferred over `ffmpeg`
- Test in browser after making changes - don't assume based on code alone
