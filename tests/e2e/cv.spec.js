import { test, expect } from '@playwright/test';

test('CV page', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.getByRole('link', { name: 'Open the CV as a PDF' })).toHaveAttribute('href', '/assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf');
  await expect(page.locator('main h2')).toHaveText(['Education', 'Professional experience', 'Teaching', 'Mentoring']);
  for (const id of ['education', 'experience', 'teaching', 'mentoring']) await expect(page.locator(`section#${id}`)).toBeVisible();
  await expect(page.locator('#education li')).toHaveCount(3);
  await expect(page.locator('#education li').first()).toContainText('08/2017 - 12/2024');
  await expect(page.locator('#experience li')).toHaveCount(5);
  await expect(page.locator('#teaching li')).toHaveCount(4);
  await expect(page.locator('#mentoring li')).toHaveCount(4);
  await expect(page.locator('main a[href="/publications/"]')).toBeVisible();
  await expect(page.locator('main a[href="/research/"]')).toBeVisible();
});

test('dates sit in a left gutter on wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/cv/');
  const row = page.locator('#experience li').first();
  const when = await row.locator('.cv-when').boundingBox();
  const what = await row.locator('.cv-what').boundingBox();
  expect(when.x + when.width).toBeLessThanOrEqual(what.x);
  expect(Math.abs(when.y - what.y)).toBeLessThan(12);
});
