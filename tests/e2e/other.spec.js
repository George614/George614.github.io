import { test, expect } from '@playwright/test';

test('retired addresses redirect to their new home', async ({ page, baseURL }) => {
  for (const [from, to] of [['/teaching/', '/cv/'], ['/portfolio/', '/software/'],
                            ['/projects/', '/research/'], ['/news/', '/#news']]) {
    await page.goto(from);
    await page.waitForURL((url) => url.pathname + url.hash === to);
    expect(new URL(page.url()).origin, `${from} left the site`).toBe(new URL(baseURL).origin);
  }
});

test('unknown addresses get the 404 page', async ({ page }) => {
  const response = await page.goto('/blog/');
  expect(response.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.locator('main a[href="/"]')).toBeVisible();
  await expect(page.locator('main a[href="/research/"]')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(new URL(page.url()).pathname).toBe('/blog/');
});
