import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allHtmlFiles, attr, read, tags, visibleText } from './site-files.js';

const ANALYTICS = 'https://www.googletagmanager.com/';

test('no em dash and no emoji in any page', () => {
  for (const html of allHtmlFiles()) {
    assert.doesNotMatch(read(html), /—/, html);
    assert.doesNotMatch(visibleText(html), /\p{Extended_Pictographic}/u, html);
  }
});

test('every img has width, height and alt', () => {
  for (const html of allHtmlFiles()) {
    for (const img of tags(read(html), 'img')) {
      for (const name of ['width', 'height', 'alt']) {
        assert.notEqual(attr(img, name), null, `${html}: ${img} lacks ${name}`);
      }
    }
  }
});

function isLocal(address) {
  return !/^(https?:)?\/\//i.test(address) || address.startsWith(ANALYTICS);
}

test('only Google Analytics is loaded from another domain', () => {
  for (const html of allHtmlFiles()) {
    const page = read(html);
    const addresses = [
      ...tags(page, 'script').map((t) => attr(t, 'src')),
      ...tags(page, 'link')
        .filter((t) => /stylesheet|preload|icon|modulepreload/i.test(attr(t, 'rel') ?? ''))
        .map((t) => attr(t, 'href')),
      ...[...tags(page, 'img'), ...tags(page, 'source')].flatMap((t) => [
        attr(t, 'src'),
        ...(attr(t, 'srcset') ?? '').split(',').map((part) => part.trim().split(/\s+/)[0]),
      ]),
    ].filter(Boolean);
    for (const address of addresses) {
      assert.ok(isLocal(address), `${html} loads ${address}`);
    }
  }
});
