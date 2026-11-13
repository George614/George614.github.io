import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, allHtmlFiles, read } from './site-files.js';

test('template content is gone', () => {
  for (const path of ['blog', 'projects/1_project', 'docs', 'tests', 'fixtures', 'node_modules',
                      'package.json', 'README.md', 'CLAUDE.md', 'assets/json']) {
    assert.equal(existsSync(join(SITE, path)), false, path);
  }
  for (const html of allHtmlFiles()) {
    assert.doesNotMatch(read(html), /Einstein|al-folio|polyfill\.io|particles|mathjax|bootstrap|jquery|font-?awesome/i, html);
  }
});
