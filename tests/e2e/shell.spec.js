import { test, expect } from '@playwright/test';

const LIGHT_PAPER = 'rgb(247, 249, 250)';
const DARK_PAPER = 'rgb(17, 26, 34)';
const background = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test('header links and current page', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  await expect(nav.getByRole('link')).toHaveText(['Home', 'Research', 'Publications', 'CV', 'Photography']);
  await expect(nav.locator('[aria-current="page"]')).toHaveText('Home');
  await expect(page.locator('header.site-header a').first()).toHaveAttribute('href', '/');
  await page.goto('/publications/');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('Publications');
});

test('footer repeats the contact links', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('footer.site-footer').getByRole('link');
  await expect(links).toHaveText(['Email', 'Google Scholar', 'GitHub', 'LinkedIn']);
  await expect(links.nth(0)).toHaveAttribute('href', 'mailto:yangzhizhuo@gmail.com');
  await expect(links.nth(1)).toHaveAttribute('href', 'https://scholar.google.com/citations?user=OA2-BIsAAAAJ');
  await expect(links.nth(2)).toHaveAttribute('href', 'https://github.com/George614');
  await expect(links.nth(3)).toHaveAttribute('href', 'https://www.linkedin.com/in/zhizhuo-yang');
});

test('theme follows the system, then remembers a manual choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');
  expect(await background(page)).toBe(DARK_PAPER);

  const toggle = page.locator('button[data-theme-toggle]');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');
  await toggle.click();
  await expect.poll(() => background(page)).toBe(LIGHT_PAPER);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');

  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      window.__themeAtReady = document.documentElement.dataset.theme;
    });
  });
  await page.reload();
  expect(await page.evaluate(() => window.__themeAtReady)).toBe('light');
  expect(await background(page)).toBe(LIGHT_PAPER);
  await context.close();
});

test('theme works when localStorage is blocked', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.addInitScript(() => {
    const deny = () => { throw new DOMException('blocked', 'SecurityError'); };
    Storage.prototype.getItem = deny;
    Storage.prototype.setItem = deny;
  });
  await page.goto('/');
  expect(await background(page)).toBe(DARK_PAPER);
  await page.locator('button[data-theme-toggle]').click();
  await expect.poll(() => background(page)).toBe(LIGHT_PAPER);
  expect(errors).toEqual([]);
  await context.close();
});

test('header stays on top and gains a rule after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.goto('/');
  const header = page.locator('header.site-header');
  await expect(header).not.toHaveAttribute('data-scrolled', /.*/);
  await page.evaluate(() => {
    document.body.style.minHeight = '3000px';
    window.scrollTo(0, 400);
  });
  await expect(header).toHaveAttribute('data-scrolled', /.*/);
  expect((await header.boundingBox()).y).toBe(0);
});

test('phone menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const button = page.locator('button[data-menu-toggle]');
  const links = page.locator('nav[aria-label="Main"] a');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(links.first()).toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  for (const link of await links.all()) {
    await expect(link).toBeVisible();
    expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }

  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(button).toBeHidden();
  await expect(links.first()).toBeVisible();
});

test('without JavaScript the phone navigation is reachable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  const links = page.locator('nav[aria-label="Main"] a');
  await expect(links).toHaveCount(5);
  for (const link of await links.all()) await expect(link).toBeVisible();
  await context.close();
});

test('keyboard focus is visible and a skip link comes first', async ({ page, browserName }) => {
  await page.goto('/');
  // WebKit only moves focus to links with Tab when the platform setting asks for it, so use Alt+Tab there.
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(tab);
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#content');
  await expect(skip).toBeVisible();
  for (let i = 0; i < 7; i += 1) {
    await page.keyboard.press(tab);
    const style = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    expect(style).not.toBe('none');
  }
});

test('reduced motion removes transitions', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const durations = await page.evaluate(() =>
    ['body', 'header.site-header', 'button[data-theme-toggle]', 'nav[aria-label="Main"] a']
      .map((sel) => getComputedStyle(document.querySelector(sel)).transitionDuration));
  for (const d of durations) expect(d.split(',').every((x) => parseFloat(x) === 0)).toBe(true);
  await context.close();
});

test('fonts are self-hosted', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('1em Newsreader'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('1em "Hanken Grotesk"'))).toBe(true);
  const families = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
  expect(families).toEqual(expect.arrayContaining(['Newsreader', 'Hanken Grotesk']));
});
