import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { SITE } from './site-files.js';

const PHOTOS = join(SITE, 'assets/photography');
const files = readdirSync(PHOTOS, { recursive: true }).map((name) => join(PHOTOS, name));

test('the built site serves no original photographs', () => {
  assert.deepEqual(files.filter((path) => /\.jpe?g$/i.test(path)), []);
});

test('no served photograph carries a GPS location', () => {
  const webps = files.filter((path) => path.endsWith('.webp'));
  assert.ok(webps.length >= 31 * 4, `expected resized copies, found ${webps.length}`);
  for (const path of webps) {
    const gps = execFileSync('magick', ['identify', '-format', '%[EXIF:GPSLatitude]', path]).toString().trim();
    assert.equal(gps, '', `${path} has a GPS latitude`);
  }
});
