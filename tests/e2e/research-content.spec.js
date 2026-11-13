import { test, expect } from '@playwright/test';
import { PAGES } from './helpers.js';

test('the list holds every entry', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('main li[data-sort]:not([data-under-review])')).toHaveCount(9);
  await expect(page.locator('main li[data-under-review]')).toHaveCount(2);
  await expect(page.locator('#software li')).toHaveText([/GPU Memory Calculator/, /AI Interview Prep/, /Meow Translator/]);
});

test('every row opens a project page and every project page is checked', async ({ page, request }) => {
  await page.goto('/research/');
  const hrefs = await page.locator('main a.entry-row').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toHaveLength(12);
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
    expect(PAGES, `${href} is in PAGES`).toContain(href);
  }
});

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
    [...document.fonts].some((f) => f.status === 'loaded' && /U\+0*100-/i.test(f.unicodeRange)));
  expect(extLoaded).toBe(true);
});
