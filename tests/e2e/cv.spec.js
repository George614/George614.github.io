import { test, expect } from '@playwright/test';

test('the CV page links to the PDF and lists nothing else', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.locator('h1')).toHaveText('CV');
  await expect(page.getByRole('link', { name: 'Open the CV as a PDF' })).toHaveAttribute('href', '/assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf');
  await expect(page.locator('main h2, main ul, main ol, main section')).toHaveCount(0);
});

test('the CV link opens the PDF', async ({ page, request }) => {
  await page.goto('/cv/');
  const href = await page.getByRole('link', { name: 'Open the CV as a PDF' }).getAttribute('href');
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('on a short page the footer sits at the bottom of the window', async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/cv/');
    const footer = await page.locator('footer').boundingBox();
    expect(Math.abs(footer.y + footer.height - 900), `at ${width}px`).toBeLessThan(1);
  }
});
