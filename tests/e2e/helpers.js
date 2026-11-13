import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Every page that the shared checks visit. Later tasks append to this list. */
export const PAGES = ['/'];

export const VIEWPORTS = [320, 768, 1024, 1440];
export const THEMES = ['light', 'dark'];

/** Shows the page in the given theme by emulating the system colour scheme. */
export async function setTheme(page, theme) {
  await page.emulateMedia({ colorScheme: theme });
}

export async function expectNoOverflow(page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, 'page scrolls horizontally').toBeLessThanOrEqual(innerWidth);
}

export async function expectNoAxeViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
  expect(summary).toEqual([]);
}
