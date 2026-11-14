import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '../../scripts/landscape.mjs';
import { SITE, read } from './site-files.js';

test('the committed artwork is exactly what scripts/landscape.mjs draws', () => {
  for (const [path, content] of Object.entries(render())) {
    assert.equal(read(path), content, `${path} is stale: run npm run art`);
  }
});

test('the contour map is published and small enough to load with the page', () => {
  const published = join(SITE, 'assets/img/terrain.svg');
  assert.ok(existsSync(published));
  assert.ok(statSync(published).size < 150_000, `${statSync(published).size} bytes`);
});

test('the ridge rises from left to right, so the career path climbs', () => {
  const { samples } = JSON.parse(read('_data/ridge.json'));
  assert.equal(samples.length, 241);
  const third = (k) => samples.slice(k * 80, k * 80 + 80).reduce((a, b) => a + b) / 80;
  assert.ok(third(0) > third(1) && third(1) > third(2));
});
