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

test('each album is a clean rectangle of full rows, at most three to a row, shorter rows first', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('/photography/');
  const albums = await page.locator('section.album').evaluateAll((sections) => sections.map((section) => {
    const grid = section.querySelector('.album-grid').getBoundingClientRect();
    return {
      grid: { left: grid.left, right: grid.right },
      rows: [...section.querySelectorAll('.album-row')].map((row) => [...row.querySelectorAll('a.photo')].map((a) => a.getBoundingClientRect().toJSON())),
    };
  }));
  expect(albums.map((a) => a.rows.map((r) => r.length))).toEqual([[3, 3], [2, 3, 3], [3, 3, 3], [2, 3, 3]]);
  for (const { grid, rows } of albums) {
    for (const row of rows) {
      expect(Math.abs(row[0].left - grid.left)).toBeLessThan(1);
      expect(Math.abs(row.at(-1).right - grid.right)).toBeLessThan(1);
      for (const box of row) expect(Math.abs(box.height - row[0].height)).toBeLessThan(1);
    }
  }
  await context.close();
});

test('the heading, album titles and album index are centred on the page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/photography/');
  const middle = await page.evaluate(() => document.documentElement.clientWidth / 2);
  for (const selector of ['.page-head h1', '.page-head .lede', 'section.album h2', '.album-index']) {
    const centres = await page.locator(selector).evaluateAll((els) => els.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      return r.left + r.width / 2;
    }));
    for (const x of centres) expect(Math.abs(x - middle), selector).toBeLessThan(2);
  }
});

test('the album index shows each album with its cover and count, and jumps to it', async ({ page }) => {
  await page.goto('/photography/');
  const index = page.getByRole('navigation', { name: 'Albums' });
  const links = index.getByRole('link');
  await expect(links).toHaveCount(4);
  await expect(links.locator('.album-index-title')).toHaveText(['Mt. Mammoth', 'Olympic Park', 'Sequoia', 'Lassen and Mt. Shasta']);
  await expect(links.locator('.album-index-count')).toHaveText(['6 photographs', '8 photographs', '9 photographs', '8 photographs']);
  expect(await links.evaluateAll((els) => els.map((a) => a.getAttribute('href')))).toEqual(['#album-mammoth', '#album-olympic', '#album-sequoia', '#album-lassen-shasta']);
  for (const img of await links.locator('img').all()) {
    await expect(img).toHaveAttribute('alt', '');
  }
  await links.nth(2).click();
  await expect(page).toHaveURL(/#album-sequoia$/);
  const top = await page.locator('#album-sequoia').evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(top).toBeLessThan(160);
});

test('on a phone each photograph takes the full width, one after another', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/photography/');
  const grid = await page.locator('.album-grid').first().boundingBox();
  const boxes = await page.locator('section.album').first().locator('a.photo').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()));
  for (const box of boxes) {
    expect(Math.abs(box.width - grid.width)).toBeLessThan(1);
    expect(Math.abs(box.height - box.width / 1.4987)).toBeLessThan(1.5);
  }
  for (let i = 1; i < boxes.length; i += 1) expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].bottom);
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
