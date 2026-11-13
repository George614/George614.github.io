import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { PAGES } from './helpers.js';

const NUMBER = /\d+(?:\.\d+)?/g;
const numbers = (text) => text.replace(/(\d),(\d{3})/g, '$1$2').match(NUMBER) ?? [];
const cvText = execFileSync('pdftotext', ['-layout', 'assets/pdf/Academic_CV_Zhizhuo_Yang_Nov2026.pdf', '-']).toString();
const cvNumbers = new Set(numbers(cvText));

test('every number on a page sourced from the CV appears in the CV', async ({ page }) => {
  let checked = 0;
  for (const path of PAGES) {
    await page.goto(path);
    for (const text of await page.locator('[data-source="cv"]').allInnerTexts()) {
      checked += 1;
      for (const n of numbers(text)) expect(cvNumbers.has(n), `${n} on ${path}`).toBe(true);
    }
  }
  expect(checked).toBeGreaterThan(0);
});
