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

// Google's documented policy for Google Analytics 4 without Ads features:
// https://developers.google.com/tag-platform/security/guides/csp
test('the Content Security Policy allows every host Google Analytics 4 uses, and no inline script', () => {
  const policy = attr(tags(read('_site/index.html'), 'meta')
    .find((t) => attr(t, 'http-equiv') === 'Content-Security-Policy'), 'content');
  const directive = (name) => (policy.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]*)`)) ?? [])[1]?.split(/\s+/) ?? [];
  for (const host of ['https://www.googletagmanager.com']) assert.ok(directive('script-src').includes(host), host);
  assert.ok(!directive('script-src').includes("'unsafe-inline'"));
  for (const host of ['https://www.googletagmanager.com', 'https://*.google-analytics.com'])
    assert.ok(directive('img-src').includes(host), `img-src ${host}`);
  for (const host of ['https://www.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.google.com'])
    assert.ok(directive('connect-src').includes(host), `connect-src ${host}`);
});
