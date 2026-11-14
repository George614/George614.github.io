// The imaginary mountain behind the home page heading, shared by scripts/landscape.mjs, which
// draws its contour lines, and assets/js/terrain-map.js, which climbs it from the pointer.
// Heights live on a grid of GRID_W by GRID_H cells; one cell is SCALE units of the 1200 by 600
// view box that the artwork is drawn in.

export const GRID_W = 300;
export const GRID_H = 150;
export const SCALE = 4;

/**
 * A seeded pseudo-random generator (Park and Miller).
 * @param {number} seed
 * @returns {() => number}
 */
function random(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

/**
 * Smooth value noise over a 32-cell lattice, summed over three octaves.
 * @param {number} seed
 * @returns {(x: number, y: number) => number}
 */
function noiseField(seed) {
  const size = 32;
  const next = random(seed);
  const lattice = Array.from({ length: (size + 1) ** 2 }, next);
  const at = (i, j) => lattice[(j % (size + 1)) * (size + 1) + (i % (size + 1))];
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    // Wrapped into 0..size-1, so points just off the map, where a slope is sampled, still have a height.
    const xi = ((Math.floor(x) % size) + size) % size;
    const yi = ((Math.floor(y) % size) + size) % size;
    const xf = smooth(x - Math.floor(x));
    const yf = smooth(y - Math.floor(y));
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x, y) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.27 + noise(x * 4.3, y * 4.3) * 0.13;
}

// Peaks in a coordinate space two units wide and one unit tall. The first is the summit.
const PEAKS = [
  { x: 1.5, y: 0.32, h: 1.0, s: 0.26 },
  { x: 1.05, y: 0.7, h: 0.42, s: 0.18 },
  { x: 1.85, y: 0.82, h: 0.38, s: 0.14 },
  { x: 0.45, y: 0.4, h: 0.4, s: 0.22 },
];

/**
 * Returns the height of the terrain at a grid point: four peaks roughened by noise.
 * @param {number} [seed]
 * @returns {(gx: number, gy: number) => number}
 */
export function createTerrain(seed = 614) {
  const fbm = noiseField(seed);
  return (gx, gy) => {
    const x = (gx / GRID_W) * 2;
    const y = gy / GRID_H;
    let h = 0;
    for (const p of PEAKS) h += p.h * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / (2 * p.s * p.s));
    return h + 0.3 * fbm(gx / 20, gy / 20);
  };
}

/**
 * Returns the highest whole grid point, scanning rows from the top.
 * @param {(gx: number, gy: number) => number} height
 * @returns {[number, number]}
 */
export function findSummit(height) {
  let best = [0, 0];
  let top = -Infinity;
  for (let j = 0; j < GRID_H; j += 1) {
    for (let i = 0; i < GRID_W; i += 1) {
      const h = height(i, j);
      if (h > top) { top = h; best = [i, j]; }
    }
  }
  return best;
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const unit = ([x, y]) => {
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n];
};

// A line that turns by more than this, in radians, between samples is doubling back on itself.
const HAIRPIN = (Math.PI * 2) / 3;

/** The angle, in radians from 0 to pi, by which a line through a, b and c turns at b. */
function turnAt(a, b, c) {
  const turn = Math.abs(Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]));
  return Math.min(turn, 2 * Math.PI - turn);
}

// A spur can turn over several samples, so turns are measured between points up to this far apart.
const SPUR_SPAN = 3;

/**
 * Removes the spurs where a climb overshoots and comes back: while the line doubles back at a
 * point, measured against its neighbours up to SPUR_SPAN samples away, that point is dropped,
 * so the spur folds away one point at a time.
 * @param {Array<[number, number]>} points
 * @returns {Array<[number, number]>}
 */
function trimSpurs(points) {
  const result = [...points];
  const doublesBack = (i) => {
    for (let span = 1; span <= SPUR_SPAN; span += 1) {
      if (i - span < 0 || i + span > result.length - 1) break;
      if (turnAt(result[i - span], result[i], result[i + span]) > HAIRPIN) return true;
    }
    return false;
  };
  for (let i = 1; i < result.length - 1;) {
    if (doublesBack(i)) {
      result.splice(i, 1);
      i = Math.max(1, i - SPUR_SPAN);
    } else {
      i += 1;
    }
  }
  return result;
}

/**
 * Evens out the small twists in a run of points with a weighted moving average over five points,
 * three times over. The first and last points stay where they are.
 * @param {Array<[number, number]>} points
 * @returns {Array<[number, number]>}
 */
function soften(points) {
  const weights = [1, 2, 3, 2, 1];
  let result = points;
  for (let pass = 0; pass < 3; pass += 1) {
    const from = result;
    result = from.map((point, i) => {
      if (i === 0 || i === from.length - 1) return point;
      let x = 0, y = 0, total = 0;
      weights.forEach((w, k) => {
        const [px, py] = from[clamp(i + k - 2, 0, from.length - 1)];
        x += px * w;
        y += py * w;
        total += w;
      });
      return [x / total, y / total];
    });
  }
  return result;
}

/**
 * Climbs from a start to the summit: it follows the slope, with a pull toward the summit that
 * grows as it goes, so it wanders like an optimiser but cannot stall. Returns grid points from
 * the start to the summit, sampled every 9 steps, with any spur where it doubled back removed,
 * and softened so the line turns gently.
 * @param {(gx: number, gy: number) => number} height
 * @param {[number, number]} start
 * @param {[number, number]} summit
 * @param {[number, number]} [velocity] the initial velocity in cells per step; by default the
 *   climb is already moving, halfway between uphill and the summit, so it does not dither at the start
 * @returns {Array<[number, number]>}
 */
export function climb(height, start, summit, velocity) {
  const [sx, sy] = summit;
  const grad = (x, y) => [(height(x + 0.5, y) - height(x - 0.5, y)), (height(x, y + 0.5) - height(x, y - 0.5))];
  let [x, y] = start;
  let [vx, vy] = velocity ?? (() => {
    const uphill = unit(grad(x, y));
    const ahead = unit([sx - x, sy - y]);
    const heading = unit([uphill[0] + ahead[0], uphill[1] + ahead[1]]);
    return [heading[0] * 0.6, heading[1] * 0.6];
  })();
  const points = [[x, y]];
  for (let step = 0; step < 4000; step += 1) {
    const [gx, gy] = grad(x, y);
    const gn = Math.hypot(gx, gy) || 1;
    const dx = sx - x, dy = sy - y, dist = Math.hypot(dx, dy);
    if (dist < 1.5) break;
    const pull = 0.35 + 0.65 * Math.min(1, step / 900);
    vx = vx * 0.92 + ((gx / gn) * (1 - pull) + (dx / dist) * pull) * 0.09;
    vy = vy * 0.92 + ((gy / gn) * (1 - pull) + (dy / dist) * pull) * 0.09;
    x = clamp(x + vx, 0, GRID_W);
    y = clamp(y + vy, 0, GRID_H);
    if (step % 9 === 0) points.push([x, y]);
  }
  while (points.length > 2 && Math.hypot(points.at(-1)[0] - sx, points.at(-1)[1] - sy) < 6) points.pop();
  points.push([sx, sy]);
  // Softening can leave a tiny reversal where the climb nearly stopped, so spurs are trimmed again.
  return trimSpurs(soften(trimSpurs(points)));
}

const toView = (n) => Math.round(n * SCALE);

/**
 * A smooth curve through grid points (Catmull-Rom, written as cubic Béziers), in view box units.
 * @param {Array<[number, number]>} points at least two
 * @returns {string} SVG path data
 */
export function smoothPath(points) {
  let d = `M${toView(points[0][0])} ${toView(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${toView(c1[0])} ${toView(c1[1])} ${toView(c2[0])} ${toView(c2[1])} ${toView(p2[0])} ${toView(p2[1])}`;
  }
  return d;
}

/**
 * Converts a point in view box units to the grid, clamped to the map.
 * @param {number} vx
 * @param {number} vy
 * @returns {[number, number]}
 */
export function toGrid(vx, vy) {
  return [clamp(vx / SCALE, 0, GRID_W - 1), clamp(vy / SCALE, 0, GRID_H - 1)];
}
