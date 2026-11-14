import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRID_W, GRID_H, SCALE, createTerrain, findSummit, climb, smoothPath, toGrid } from '../../assets/js/lib/terrain.js';

const height = createTerrain();
const summit = findSummit(height);

test('the same seed draws the same terrain, and another seed a different one', () => {
  assert.equal(createTerrain()(120, 60), height(120, 60));
  assert.notEqual(createTerrain(7)(120, 60), height(120, 60));
});

test('the summit is the highest point on the grid, on the main peak', () => {
  const [sx, sy] = summit;
  assert.ok(Math.abs(sx - 225) < 15 && Math.abs(sy - 48) < 15, `summit at ${summit}`);
  for (let j = 0; j < GRID_H; j += 3) for (let i = 0; i < GRID_W; i += 3) assert.ok(height(i, j) <= height(sx, sy));
});

test('a climb from anywhere on the map starts there and ends on the summit', () => {
  for (const start of [[0, 0], [GRID_W - 1, GRID_H - 1], [10, 140], [158, 146], [280, 10], [150, 75]]) {
    const points = climb(height, start, summit);
    assert.deepEqual(points[0], start);
    assert.deepEqual(points.at(-1), summit);
    assert.ok(points.length >= 2);
  }
});

test('a climb stays on the map', () => {
  for (const start of [[0, 0], [GRID_W - 1, 0], [0, GRID_H - 1], [GRID_W - 1, GRID_H - 1]]) {
    for (const [x, y] of climb(height, start, summit)) {
      assert.ok(x >= 0 && x <= GRID_W && y >= 0 && y <= GRID_H, `${start} left the map at ${x}, ${y}`);
    }
  }
});

test('a climb from anywhere on the map never doubles back, even over a few samples', () => {
  const angle = (a, b, c) => {
    const turn = Math.abs(Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]));
    return Math.min(turn, 2 * Math.PI - turn);
  };
  for (let gy = 5; gy < GRID_H; gy += 20) {
    for (let gx = 5; gx < GRID_W; gx += 20) {
      const points = climb(height, [gx, gy], summit);
      for (let span = 1; span <= 3; span += 1) {
        for (let i = span; i < points.length - span; i += 1) {
          const turn = angle(points[i - span], points[i], points[i + span]);
          assert.ok(turn < (Math.PI * 2) / 3, `${gx},${gy} turns by ${(turn * 180 / Math.PI).toFixed(0)} degrees over ${span} at ${i}`);
        }
      }
    }
  }
});

test('a climb that starts on the summit is one step long', () => {
  assert.deepEqual(climb(height, summit, summit), [summit, summit]);
});

test('the drawn path runs from the start to the summit in view box units', () => {
  const d = smoothPath([[10, 20], [30, 25], [40, 40]]);
  assert.ok(d.startsWith(`M${10 * SCALE} ${20 * SCALE}C`));
  assert.ok(d.endsWith(` ${40 * SCALE} ${40 * SCALE}`));
  assert.equal(d.match(/C/g).length, 2);
});

test('view box points become grid points, clamped to the map', () => {
  assert.deepEqual(toGrid(400, 200), [100, 50]);
  assert.deepEqual(toGrid(-30, 9000), [0, GRID_H - 1]);
  assert.deepEqual(toGrid(5000, -1), [GRID_W - 1, 0]);
});
