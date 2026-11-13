import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, read } from './site-files.js';

const paths = [...read(join(SITE, 'sitemap.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, loc]) => new URL(loc).pathname);

test('the sitemap lists every page', () => {
  const slugs = readdirSync('_research').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  assert.ok(slugs.length >= 12);
  for (const path of ['/', '/research/', '/publications/', '/cv/', '/photography/', ...slugs.map((s) => `/research/${s}/`)]) {
    assert.ok(paths.includes(path), `${path} missing from sitemap.xml`);
  }
});

test('the sitemap lists no redirect or error page', () => {
  for (const path of ['/teaching/', '/portfolio/', '/projects/', '/news/', '/404.html']) {
    assert.ok(!paths.includes(path), `${path} is in sitemap.xml`);
  }
});
