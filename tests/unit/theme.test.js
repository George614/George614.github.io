import { test } from 'node:test';
import assert from 'node:assert/strict';
import { effectiveTheme, nextTheme } from '../../assets/js/lib/theme.js';

test('without a stored choice the theme follows the system', () => {
  assert.equal(effectiveTheme(null, true), 'dark');
  assert.equal(effectiveTheme(null, false), 'light');
});

test('a stored choice wins over the system', () => {
  assert.equal(effectiveTheme('light', true), 'light');
  assert.equal(effectiveTheme('dark', false), 'dark');
});

test('an invalid stored value is ignored', () => {
  assert.equal(effectiveTheme('purple', true), 'dark');
  assert.equal(effectiveTheme('', false), 'light');
});

test('the theme button flips between the two themes', () => {
  assert.equal(nextTheme('light'), 'dark');
  assert.equal(nextTheme('dark'), 'light');
});
