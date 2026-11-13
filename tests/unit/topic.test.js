import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTopic } from '../../assets/js/lib/topic.js';

const keys = ['agents', 'diffusion', 'active-inference', 'eye-tracking-vr'];

test('reads a known topic from the query string', () => {
  assert.equal(parseTopic('?topic=diffusion', keys), 'diffusion');
  assert.equal(parseTopic('?x=1&topic=agents', keys), 'agents');
});

test('no topic, an empty topic or an unknown topic means all', () => {
  assert.equal(parseTopic('', keys), null);
  assert.equal(parseTopic('?topic=', keys), null);
  assert.equal(parseTopic('?topic=bogus', keys), null);
});

test('malformed encoding does not throw', () => {
  assert.equal(parseTopic('?topic=%E0%A4%A', keys), null);
});
