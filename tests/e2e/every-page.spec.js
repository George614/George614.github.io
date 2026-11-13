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
