import { test, expect } from '@playwright/test';
import { PAGES } from './helpers.js';

test('the list holds every entry', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('main li[data-sort]:not([data-under-review])')).toHaveCount(9);
  await expect(page.locator('main li[data-under-review]')).toHaveCount(2);
  await expect(page.locator('#software')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Meow Translator');
});

test('the software page lists the apps and tools in order, each opening its own page', async ({ page, request }) => {
  await page.goto('/software/');
  await expect(page.locator('h1')).toHaveText('Software');
  await expect(page.locator('nav[aria-label="Main"] [aria-current="page"]')).toHaveText('Software');
  const rows = page.locator('main a.entry-row');
  await expect(rows.locator('h3')).toHaveText(['GPU Memory Calculator', 'AI Interview Prep', 'Meow Translator']);
  const hrefs = await rows.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual(['/software/gpu-memory-calculator/', '/software/ai-interview-prep/', '/software/meow-translator/']);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
    expect(PAGES, `${href} is in PAGES`).toContain(href);
  }
});

test('every row opens a project page and every project page is checked', async ({ page, request }) => {
  await page.goto('/research/');
  const hrefs = await page.locator('main a.entry-row').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toHaveLength(9);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
    expect(PAGES, `${href} is in PAGES`).toContain(href);
  }
});

test('Meow Translator has three screenshots and no links', async ({ page }) => {
  await page.goto('/software/meow-translator/');
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
    [...document.fonts].some((f) => f.status === 'loaded' && /U\+0*100-/i.test(f.unicodeRange)));
  expect(extLoaded).toBe(true);
});
