import { test, expect } from '@playwright/test';

test('four albums and 31 photographs', async ({ page }) => {
  await page.goto('/photography/');
  await expect(page.locator('section.album h2')).toHaveText(['Mt. Mammoth', 'Olympic Park', 'Sequoia', 'Lassen and Mt. Shasta']);
  expect(await page.locator('section.album').evaluateAll((s) => s.map((a) => a.querySelectorAll('a.photo').length))).toEqual([6, 8, 9, 8]);
  await expect(page.locator('a.photo img').first()).toHaveAttribute('alt', 'Morning Light, Mt. Mammoth');
});

test('thumbnails are resized and lazy', async ({ page }) => {
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/photography/');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
  });
  await page.waitForLoadState('networkidle');
  expect(requests.filter((u) => /\.jpe?g$/i.test(u))).toEqual([]);
  const sources = await page.locator('a.photo img').evaluateAll((imgs) => imgs.map((i) => i.currentSrc));
  for (const src of sources) expect(src).toMatch(/\.webp$/);
  const lazy = await page.locator('section.album:not(:first-of-type) a.photo img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('loading')));
  expect(lazy.length).toBe(25);
  expect(lazy.every((l) => l === 'lazy')).toBe(true);
});

test('rows are justified without a script', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('/photography/');
  const album = page.locator('section.album').first();
  const grid = await album.locator('.album-grid').boundingBox();
  const boxes = await album.locator('a.photo').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()));
  const firstRow = boxes.filter((b) => Math.abs(b.top - boxes[0].top) < 1);
  expect(firstRow.length).toBeGreaterThan(1);
  expect(Math.abs(firstRow.at(-1).right - (grid.x + grid.width))).toBeLessThan(2);
  await context.close();
});

test('lightbox with the keyboard', async ({ page }) => {
  await page.goto('/photography/');
  const url = page.url();
  const first = page.locator('a.photo').first();
  await first.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog).toContainText('Morning Light');
  await expect(dialog).toContainText('1 of 31');
  expect(page.url()).toBe(url);
  await page.keyboard.press('ArrowLeft');
  await expect(dialog).toContainText('Guardian Peak');
  await expect(dialog).toContainText('31 of 31');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('Morning Light');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(first).toBeFocused();
});

test('the lightbox buttons step and close', async ({ page }) => {
  await page.goto('/photography/');
  await page.locator('a.photo').nth(1).click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toContainText('Snow Peaks');
  await dialog.getByRole('button', { name: 'Next photograph' }).click();
  await expect(dialog).toContainText('Winter Silence');
  await dialog.getByRole('button', { name: 'Previous photograph' }).click();
  await expect(dialog).toContainText('Snow Peaks');
  await expect(dialog.locator('img')).toHaveAttribute('src', /DSC_0541-1400\.webp$/);
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(page.locator('a.photo').nth(1)).toBeFocused();
});

test('without JavaScript a thumbnail opens the larger image', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/photography/');
  const [response] = await Promise.all([page.waitForNavigation(), page.locator('a.photo').first().click()]);
  expect(page.url()).toMatch(/-2000\.webp$/);
  expect(response.status()).toBe(200);
  await context.close();
});
