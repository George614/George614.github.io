import { test, expect } from '@playwright/test';

test('project page with a figure', async ({ page }) => {
  await page.goto('/research/sr-aif/');
  const trail = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(trail.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/research/');
  await expect(trail.getByRole('link', { name: 'Active inference' })).toHaveAttribute('href', '/research/?topic=active-inference');
  await expect(page.locator('h1')).toHaveText('SR-AIF: sparse-reward robotics from pixels');
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Research');
  await expect(page.locator('.project-links a')).toHaveText(['Paper', 'arXiv', 'Code']);
  await expect(page.locator('.project-links a').nth(0)).toHaveAttribute('href', 'https://doi.org/10.1109/ICRA55743.2025.11127713');
  await expect(page.locator('.project-links a').nth(1)).toHaveAttribute('href', 'https://arxiv.org/abs/2409.14216');
  await expect(page.locator('.project-links a').nth(2)).toHaveAttribute('href', 'https://github.com/NACLab/self-revising-active-inference');
  await expect(page.locator('figure img')).toHaveAttribute('alt', /.+/);
  await expect(page.locator('figure figcaption')).toContainText('Nguyen');
  await expect(page.getByRole('heading', { name: 'Main results' })).toBeVisible();
  await expect(page.locator('.project-pager a').first()).toHaveAttribute('href', '/research/');
});

test('project page without a figure or links shows no empty parts', async ({ page }) => {
  await page.goto('/research/self-evolving-agents/');
  await expect(page.locator('figure')).toHaveCount(0);
  await expect(page.locator('.project-links')).toHaveCount(0);
});

test('project page with a diagram shows it as the figure', async ({ page }) => {
  await page.goto('/research/agentic-rl-744b/');
  const figure = page.locator('figure.project-figure');
  await expect(figure.getByRole('img', { name: /GRPO update improves the policy/ })).toBeVisible();
  await expect(figure.locator('figcaption')).toHaveText(/\w/);
  await expect(page.locator('.project-links')).toHaveCount(0);
  await expect(page.locator('.facts dt')).toHaveText(['Method', 'Scale', 'Framework', 'Related']);
  await expect(page.locator('.facts dd a')).toHaveAttribute('href', '/research/palmyra-x6/');
});

test('the pager walks the research entries newest first', async ({ page }) => {
  await page.goto('/research/agentic-rl-744b/');
  const next = page.locator('.project-pager a[rel="next"]');
  await expect(next).toHaveAttribute('href', '/research/palmyra-x6/');
  await expect(next).toContainText('Palmyra x6');
});

test('a software page sits under Software, and its pager walks the software in order', async ({ page }) => {
  await page.goto('/software/gpu-memory-calculator/');
  const trail = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(trail.getByRole('link')).toHaveText(['Software']);
  await expect(trail.getByRole('link')).toHaveAttribute('href', '/software/');
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Software');
  await expect(page.locator('.project-pager a').first()).toHaveAttribute('href', '/software/');
  await expect(page.locator('.project-pager a').first()).toContainText('All software');
  await expect(page.locator('.project-pager a[rel="next"]')).toHaveAttribute('href', '/software/ai-interview-prep/');
  await page.goto('/software/meow-translator/');
  await expect(page.locator('.project-pager a[rel="next"]')).toHaveCount(0);
});

test('the research pager never leads to software', async ({ page }) => {
  await page.goto('/research/passive-haptics-mr/');
  await expect(page.locator('.project-pager a[rel="next"]')).toHaveCount(0);
});

test('entry with only a title and summary renders cleanly', async ({ page }) => {
  await page.goto('/fixtures/minimal/');
  await expect(page.locator('h1')).toHaveText('Minimal fixture');
  for (const sel of ['figure', '.project-links', '.facts', '.label'])
    await expect(page.locator(`main ${sel}`)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Main results' })).toHaveCount(0);
  expect(await page.locator('main *:not(img):not(br):not(hr)').evaluateAll(
    (els) => els.filter((e) => !e.textContent.trim() && !e.querySelector('img')).length)).toBe(0);
});

test('a long publication label wraps inside the byline on a 320px phone instead of running past it', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/research/perceptual-motor-learning/');
  const byline = page.locator('.byline');
  await expect(byline.locator('.label')).toHaveText('Frontiers in Computational Neuroscience, 2023');
  const { overflow, labelRight, bylineRight } = await byline.evaluate((el) => ({
    overflow: el.scrollWidth - el.clientWidth,
    labelRight: el.querySelector('.label').getBoundingClientRect().right,
    bylineRight: el.getBoundingClientRect().right,
  }));
  expect(overflow).toBe(0);
  expect(labelRight).toBeLessThanOrEqual(bylineRight);
});
