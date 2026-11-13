import { test, expect } from '@playwright/test';

const filter = (page) => page.locator('nav[aria-label="Filter by topic"]');
const rows = (page) => page.locator('main li[data-sort]');

test('filter buttons and order', async ({ page }) => {
  await page.goto('/research/');
  await expect(filter(page).locator('a')).toHaveText(
    ['All', 'LLM agents and RL', 'Diffusion language models', 'Active inference', 'Eye tracking and VR']);
  const sorts = await rows(page).evaluateAll((els) => els.map((e) => e.dataset.sort));
  expect(sorts).toEqual([...sorts].sort().reverse());
  expect(new Set(sorts).size).toBe(sorts.length);
});

test('filtering updates the list and the address without a reload', async ({ page }) => {
  await page.goto('/research/');
  const total = await rows(page).count();
  await page.evaluate(() => { window.__sameDocument = true; });
  await filter(page).getByRole('link', { name: 'Diffusion language models' }).click();
  await expect(page).toHaveURL(/\/research\/\?topic=diffusion$/);
  expect(await page.evaluate(() => window.__sameDocument)).toBe(true);

  const visible = page.locator('main li[data-sort]:visible');
  await expect(visible).toHaveCount(2);
  for (const row of await visible.all()) {
    await expect(row).toHaveAttribute('data-under-review', '');
    await expect(row.locator('h3')).not.toBeEmpty();
    await expect(row.locator('.label')).toContainText(/ICLR 2027|ACL ARR October 2026/);
    await expect(row.locator('a')).toHaveCount(0);
  }
  await expect(filter(page).getByRole('link', { name: 'Diffusion language models' })).toHaveAttribute('aria-current', 'true');

  await page.goBack();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.locator('main li[data-sort]:visible')).toHaveCount(total);
  await expect(filter(page).getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'true');
});

test('a filtered address can be opened directly', async ({ page }) => {
  await page.goto('/research/?topic=active-inference');
  const visible = page.locator('main li[data-sort]:visible');
  await expect(visible.first()).toBeVisible();
  for (const row of await visible.all()) await expect(row).toHaveAttribute('data-topic', 'active-inference');
  await expect(page.locator('main li[data-sort][data-topic="agents"]').first()).toBeHidden();
});

test('an unknown topic shows everything', async ({ page }) => {
  await page.goto('/research/?topic=bogus');
  await expect(filter(page).getByRole('link', { name: 'All' })).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('main li[data-sort][hidden]')).toHaveCount(0);
});

test('without JavaScript all entries are shown', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/research/?topic=diffusion');
  const all = rows(page);
  expect(await all.count()).toBeGreaterThan(2);
  for (const row of await all.all()) await expect(row).toBeVisible();
  await context.close();
});

test('the filter bar stays under the header while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 420 });
  await page.goto('/research/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const header = await page.locator('header.site-header').boundingBox();
  await expect.poll(async () => Math.abs((await filter(page).boundingBox()).y - header.height)).toBeLessThanOrEqual(1);
});

test('the Software section is not filtered', async ({ page }) => {
  await page.goto('/research/?topic=diffusion');
  await expect(page.locator('section#software')).toBeVisible();
  await expect(page.locator('section#software h2')).toHaveText('Software');
});

test('research rows link to their project pages', async ({ page }) => {
  await page.goto('/research/');
  const row = page.locator('main li[data-sort]').filter({ hasText: 'SR-AIF' });
  await expect(row.locator('a')).toHaveAttribute('href', '/research/sr-aif/');
  await expect(row.locator('img')).toHaveAttribute('alt', /.+/);
});

test('on a phone the active topic is scrolled into view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/research/?topic=eye-tracking-vr');
  const active = page.locator('nav[aria-label="Filter by topic"] a[aria-current="true"]');
  await expect(active).toHaveText('Eye tracking and VR');
  await expect(active).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('a portrait figure fits inside its list thumbnail', async ({ page }) => {
  await page.goto('/research/');
  const thumb = page.locator('#software a[href="/research/meow-translator/"] .entry-thumb');
  const box = await thumb.boundingBox();
  const img = await thumb.locator('img').boundingBox();
  expect(img.height).toBeLessThanOrEqual(box.height);
  expect(img.y).toBeGreaterThanOrEqual(box.y);
});
