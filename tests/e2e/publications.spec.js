import { test, expect } from '@playwright/test';
import { expectNoOverflow } from './helpers.js';

test('three groups in CV order', async ({ page }) => {
  await page.goto('/publications/');
  await expect(page.locator('main h2')).toHaveText(['Published', 'Technical reports', 'Under review']);
  await expect(page.locator('#published li.pub')).toHaveCount(10);
  await expect(page.locator('#technical-reports li.pub')).toHaveCount(1);
  await expect(page.locator('#under-review li')).toHaveText([
    /Denoising Blocks, Not Tokens.*ICLR 2027/s, /When Are Errors Evidence\?.*ACL ARR October 2026/s]);
  await expect(page.locator('#under-review a')).toHaveCount(0);
});

test('the owner is bold once in every entry', async ({ page }) => {
  await page.goto('/publications/');
  const strongs = await page.locator('li.pub').evaluateAll((items) =>
    items.map((li) => [...li.querySelectorAll('strong')].map((s) => s.textContent)));
  expect(strongs).toHaveLength(11);
  for (const s of strongs) {
    expect(s).toHaveLength(1);
    expect(s[0]).toContain('Yang');
  }
});

test('preprints are folded into their published versions', async ({ page }) => {
  await page.goto('/publications/');
  const titles = await page.locator('li.pub .pub-title').allTextContents();
  expect(titles.filter((t) => t.startsWith('R-AIF:'))).toEqual([]);
  expect(titles.filter((t) => t === 'A Neural Active Inference Model of Perceptual-Motor Learning')).toHaveLength(1);
  const srAif = page.locator('li.pub', { hasText: 'SR-AIF' });
  await expect(srAif.getByRole('link', { name: 'Paper' })).toHaveAttribute('href', 'https://doi.org/10.1109/ICRA55743.2025.11127713');
  await expect(srAif.getByRole('link', { name: 'arXiv' })).toHaveAttribute('href', 'https://arxiv.org/abs/2409.14216');
  await expect(srAif.getByRole('link', { name: 'Project page' })).toHaveAttribute('href', '/research/sr-aif/');
  const pml = page.locator('li.pub', { hasText: 'Perceptual-Motor Learning' });
  await expect(pml.getByRole('link', { name: 'arXiv' })).toHaveAttribute('href', 'https://arxiv.org/abs/2211.10419');
});

test('every published entry links to its paper', async ({ page }) => {
  await page.goto('/publications/');
  const papers = page.locator('#published li.pub').getByRole('link', { name: 'Paper', exact: true });
  await expect(papers).toHaveCount(10);
  for (const href of await papers.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
    expect(href).toMatch(/^https:\/\/doi\.org\/10\./);
});

test('years run newest first in a gutter', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/publications/');
  const years = (await page.locator('#published h3').allTextContents()).map(Number);
  expect(years.length).toBeGreaterThan(1);
  for (let i = 1; i < years.length; i++) expect(years[i]).toBeLessThan(years[i - 1]);
  const year = await page.locator('#published h3').first().boundingBox();
  const entry = await page.locator('#published li.pub').first().boundingBox();
  expect(year.x + year.width).toBeLessThanOrEqual(entry.x);
  expect(Math.abs(year.y - entry.y)).toBeLessThan(24);
});

test('BibTeX opens in place without custom keys', async ({ page }) => {
  await page.goto('/publications/');
  const srAif = page.locator('li.pub', { hasText: 'SR-AIF' });
  const pre = srAif.locator('details pre');
  await expect(pre).toBeHidden();
  await srAif.locator('summary', { hasText: 'BibTeX' }).click();
  await expect(pre).toBeVisible();
  await expect(pre).toContainText('@inproceedings{nguyen2025sr-aif');
  for (const key of ['selected', 'group', 'project', 'arxiv =']) await expect(pre).not.toContainText(key);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator('details').evaluateAll((els) => els.forEach((d) => { d.open = true; }));
  await expectNoOverflow(page);
});
