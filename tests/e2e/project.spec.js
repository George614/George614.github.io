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
  await page.goto('/research/agentic-rl-744b/');
  await expect(page.locator('figure')).toHaveCount(0);
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

test('entry with only a title, kind and summary renders cleanly', async ({ page }) => {
  await page.goto('/fixtures/minimal/');
  await expect(page.locator('h1')).toHaveText('Minimal fixture');
  for (const sel of ['figure', '.project-links', '.facts', '.label'])
    await expect(page.locator(`main ${sel}`)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Main results' })).toHaveCount(0);
  expect(await page.locator('main *:not(img):not(br):not(hr)').evaluateAll(
    (els) => els.filter((e) => !e.textContent.trim() && !e.querySelector('img')).length)).toBe(0);
});
