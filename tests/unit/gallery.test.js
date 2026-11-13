import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapIndex } from '../../assets/js/lib/gallery.js';

test('keeps an index that is already in range', () => {
  assert.equal(wrapIndex(0, 31), 0);
  assert.equal(wrapIndex(30, 31), 30);
});

test('wraps past the last photograph to the first', () => {
  assert.equal(wrapIndex(31, 31), 0);
});

test('wraps before the first photograph to the last', () => {
  assert.equal(wrapIndex(-1, 31), 30);
});

test('a single photograph always wraps to itself', () => {
  assert.equal(wrapIndex(5, 1), 0);
  assert.equal(wrapIndex(-3, 1), 0);
});
