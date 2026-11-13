import { test, expect } from '@playwright/test';
import { PAGES, THEMES, VIEWPORTS, setTheme, expectNoOverflow, expectNoAxeViolations } from './helpers.js';

for (const path of PAGES) {
  for (const theme of THEMES) {
    test(`${path} in the ${theme} theme`, async ({ page }) => {
      const errors = [];
      const foreign = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('request', (req) => {
        if (new URL(req.url()).hostname !== 'localhost') foreign.push(req.url());
      });
      await setTheme(page, theme);

      for (const width of VIEWPORTS) {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(path, { waitUntil: 'load' });
        expect(response.status(), `${path} at ${width}px`).toBe(200);
        await expect(page.locator('h1')).toHaveCount(1);
        await expectNoOverflow(page);
        await expectNoAxeViolations(page);
      }

      expect(errors).toEqual([]);
      expect(foreign).toEqual([]);
    });
  }
}

for (const path of PAGES) {
  test(`${path} has a heading outline with no skipped levels, and no heading inside a span`, async ({ page }) => {
    await page.goto(path);
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((els) =>
      els.map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim(), inSpan: Boolean(h.closest('span')) })));
    expect(headings[0].level).toBe(1);
    for (let i = 1; i < headings.length; i += 1) {
      expect(headings[i].level, `"${headings[i].text}" after "${headings[i - 1].text}"`)
        .toBeLessThanOrEqual(headings[i - 1].level + 1);
    }
    expect(headings.filter((h) => h.inSpan).map((h) => h.text)).toEqual([]);
  });
}
