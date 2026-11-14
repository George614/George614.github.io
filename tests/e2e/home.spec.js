import { test, expect } from '@playwright/test';

const workSection = (page) => page.locator('section', { has: page.getByRole('heading', { name: 'Selected work' }) });

test('hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('I train large language models to act, not only to answer.');
  await expect(page.locator('.hero')).toContainText('AI Research Scientist at WRITER, working on reinforcement learning and post-training for agents. I also go by George.');
  const links = page.locator('.hero').getByRole('link');
  await expect(links).toHaveText(['Email', 'Google Scholar', 'GitHub', 'LinkedIn', 'CV as PDF']);
  await expect(links.last()).toHaveAttribute('href', '/assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf');
});

test('the hero map is decoration that fills the window width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const map = page.locator('.hero .terrain');
  await expect(map).toHaveAttribute('aria-hidden', 'true');
  const box = await map.boundingBox();
  expect(box.x).toBe(0);
  expect(box.width).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  const mask = await map.evaluate((el) => getComputedStyle(el, '::before').maskImage);
  expect(mask).toContain('/assets/img/terrain.svg');
});

test('the path climbs to the summit once, then rests there', async ({ page }) => {
  await page.goto('/');
  const trail = page.locator('.terrain-trail');
  await trail.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  expect(await trail.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBe(0);
  const summit = page.locator('.terrain-summit');
  await summit.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  expect(await summit.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('with reduced motion the path is drawn from the start', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const trail = page.locator('.terrain-trail');
  expect(await trail.evaluate((el) => el.getAnimations().length)).toBe(0);
  expect(await trail.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBe(0);
  expect(await page.locator('.terrain-summit').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('the bio keeps to the CV: primary builder at WRITER, eye tracking before active inference', async ({ page }) => {
  await page.goto('/');
  const bio = page.locator('.home-bio');
  await expect(bio).toContainText('primary builder of the agentic reinforcement learning stack');
  await expect(bio).toContainText('744-billion-parameter mixture-of-experts model');
  await expect(bio).toContainText('from 2020 I worked on active inference');
  await expect(bio).not.toContainText('uncertainty');
});

test('the portrait sits beside the bio and loads with the page', async ({ page }) => {
  await page.goto('/');
  const portrait = page.locator('.home-notes .notes-portrait img');
  await expect(portrait).toHaveAttribute('alt', /Zhizhuo Yang/);
  await expect(portrait).toHaveAttribute('loading', 'eager');
  const box = await portrait.boundingBox();
  expect(box.width / box.height).toBeCloseTo(0.8, 1);
});

test('margin facts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.facts dt')).toHaveText(['Now', 'Built', 'Under review', 'Ph.D.']);
  await expect(page.locator('.facts dd')).toHaveText(['AI Research Scientist, WRITER, San Francisco',
    'Synthetic tool-use data pipeline behind Palmyra x6', 'Two papers on diffusion language models',
    'Rochester Institute of Technology, 2024']);
});

test('the career path lists each step in order, ending at WRITER', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'The way here' }) });
  await expect(section).toHaveAttribute('data-source', 'cv');
  const steps = section.locator('ol.ridge-stops > li');
  await expect(steps.locator('.label')).toHaveText(['2010', '2014', '2017', '2019', '2020', '2023', '2025']);
  await expect(steps.locator('strong')).toHaveText(['Optical information science', 'Virtual and augmented reality',
    'Eye tracking and gaze', 'Rendering for VR headsets', 'Active inference', 'Sensor fusion for tracking',
    'Reinforcement learning for LLM agents']);
  await expect(steps.last()).toContainText('AI Research Scientist, WRITER');
  await expect(steps.last()).toHaveAttribute('aria-current', 'step');
  await expect(section.locator('[aria-current]')).toHaveCount(1);
});

test('on a wide screen the ridge rises from the first step to the last', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const ys = await page.locator('ol.ridge-stops > li').evaluateAll((els) =>
    els.map((el) => parseFloat(el.style.getPropertyValue('--y'))));
  expect(ys).toHaveLength(7);
  for (let i = 1; i < ys.length; i += 1) expect(ys[i]).toBeLessThan(ys[i - 1]);
  await expect(page.locator('.ridge-art')).toBeVisible();
});

test('each waypoint sits on its dashed line, at the centre of its step', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const ticks = await page.locator('.ridge-tick').evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return r.x + r.width / 2;
  }));
  const steps = await page.locator('ol.ridge-stops > li').evaluateAll((els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return r.x + r.width / 2;
  }));
  expect(ticks).toHaveLength(steps.length);
  ticks.forEach((x, i) => expect(Math.abs(x - steps[i])).toBeLessThan(1));
});

test('on a phone the career path is a vertical list without the ridge drawing', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await expect(page.locator('.ridge-art')).toBeHidden();
  const xs = await page.locator('ol.ridge-stops > li').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().x));
  expect(new Set(xs).size).toBe(1);
});

test('selected work is a set of cards, each named by a link to its project', async ({ page }) => {
  await page.goto('/');
  const section = workSection(page);
  const cards = section.locator('.work-card');
  await expect(cards).toHaveCount(3);
  const titles = cards.locator('h3 a');
  expect(await titles.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
    .toEqual(['/research/agentic-rl-744b/', '/research/palmyra-x6/', '/research/sr-aif/']);
  await expect(cards.first()).toHaveClass(/is-lead/);
  await expect(section.getByRole('link', { name: 'All research' })).toHaveAttribute('href', '/research/');
});

test('a click anywhere on a card opens its project', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const card = workSection(page).locator('.work-card').nth(1);
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  await page.mouse.click(box.x + 20, box.y + 20);
  await expect(page).toHaveURL(/\/research\/palmyra-x6\/$/);
});

test('the lead card shows the training loop and its chosen result', async ({ page }) => {
  await page.goto('/');
  const lead = workSection(page).locator('.work-card.is-lead');
  await expect(lead.getByRole('img', { name: /GRPO update improves the policy/ })).toBeVisible();
  await expect(lead.locator('.work-result')).toHaveText(
    'Asynchronous one-step off-policy training cut per-step non-generation time from 170 seconds to 24 seconds.');
});

test('recent news', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('section#news li');
  await expect(items).toHaveCount(4);
  await expect(items.locator('time')).toHaveText(['Aug 2026', 'Feb 2025', 'Jan 2025', 'Dec 2024']);
  await expect(items.first().getByRole('link')).toHaveAttribute('href', '/research/palmyra-x6/');
});

test('outside work shows five photographs, each linking to its album', async ({ page }) => {
  await page.goto('/');
  const note = page.locator('section.personal');
  for (const hobby of ['photograph', 'saxophone', 'basketball', 'badminton', 'hike']) await expect(note).toContainText(hobby);
  const photos = note.locator('.mosaic a');
  await expect(photos).toHaveCount(5);
  for (const href of await photos.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
    expect(href).toMatch(/^\/photography\/#album-[a-z-]+$/);
  for (const img of await photos.locator('img').all()) {
    await expect(img).toHaveAttribute('loading', 'lazy');
    await expect(img).toHaveAttribute('alt', /^.{12,}$/);
  }
  await expect(note.getByRole('link', { name: 'All photographs' })).toHaveAttribute('href', '/photography/');
});

test('every album a photograph links to exists on the photography page', async ({ page }) => {
  await page.goto('/');
  const targets = await page.locator('.mosaic a').evaluateAll((els) => els.map((e) => e.hash.slice(1)));
  expect(targets).toHaveLength(5);
  await page.goto('/photography/');
  for (const id of targets) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});
