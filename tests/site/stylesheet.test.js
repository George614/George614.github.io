import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { SITE, read } from './site-files.js';

// The production build passes HTML through jekyll-minifier; its CSS compressor once turned
// calc(var(--ar)) into calc(var( -  - ar)), which silently broke the photo rows.
test('every var() in the published stylesheet names a custom property', () => {
  const css = read(join(SITE, 'assets/css/main.css'));
  const broken = css.match(/var\((?!--)[^)]*\)/g) ?? [];
  assert.deepEqual(broken, []);
  assert.match(css, /\.photo\{[^}]*flex-grow:calc\(var\(--ar\)\)/);
});
