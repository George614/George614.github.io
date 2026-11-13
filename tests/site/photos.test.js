import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { SITE } from './site-files.js';

const files = readdirSync(SITE, { recursive: true }).map((name) => join(SITE, name));

test('the built site serves no original images, only their resized copies', () => {
  assert.deepEqual(files.filter((path) => /\.(jpe?g|png|gif|tiff?|heic)$/i.test(path)), []);
});

// `identify` exists in ImageMagick 6 (Ubuntu's package) and 7, unlike the `magick` command.
test('no served image carries a GPS location', () => {
  const webps = files.filter((path) => path.endsWith('.webp'));
  assert.ok(webps.length >= 31 * 4, `expected resized copies, found ${webps.length}`);
  for (const path of webps) {
    const gps = execFileSync('identify', ['-format', '%[EXIF:GPSLatitude]', path]).toString().trim();
    assert.equal(gps, '', `${path} has a GPS latitude`);
  }
});
