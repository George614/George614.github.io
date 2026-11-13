import { test, expect } from '@playwright/test';

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
  await page.goto('/');
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Selected work' }) });
  const rows = section.locator('a.entry-row');
  await expect(rows).toHaveCount(3);
  expect(await rows.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
    .toEqual(['/research/agentic-rl-744b/', '/research/palmyra-x6/', '/research/sr-aif/']);
  await expect(section.getByRole('link', { name: 'All research' })).toHaveAttribute('href', '/research/');
});

test('recent news', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('section#news li');
  await expect(items).toHaveCount(4);
  await expect(items.locator('time')).toHaveText(['Aug 2026', 'Feb 2025', 'Jan 2025', 'Dec 2024']);
  await expect(items.first().getByRole('link')).toHaveAttribute('href', '/research/palmyra-x6/');
});

test('personal note', async ({ page }) => {
  await page.goto('/');
  const note = page.locator('section.personal');
  for (const hobby of ['photograph', 'saxophone', 'basketball', 'hik']) await expect(note).toContainText(hobby);
  const photo = note.locator('a[href="/photography/"] img');
  await expect(photo).toHaveCount(1);
  await expect(photo).toHaveAttribute('loading', 'lazy');
});
