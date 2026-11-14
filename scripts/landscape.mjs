// Draws the home page artwork, deterministically, so the committed files can be checked:
//   assets/img/terrain.svg       contour lines of an imaginary mountain, used as a CSS mask
//   _includes/terrain-trail.svg  the path that climbs it, drawn over the same view box
//   _data/ridge.json             the ridge behind the career path, sampled every 5 units across its width
// Run with `npm run art` after changing anything here.
import { contours } from 'd3-contour';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const GRID_W = 300;
const GRID_H = 150;
const SCALE = 4; // grid cells to view box units: the view box is 1200 by 600
const LEVELS = 22;
const SEED = 614;
// The ridge is sampled every 5 units, so the centre of each of six columns (100, 300, ... 1100) is a sample.
const RIDGE_STEP = 5;

/** A seeded pseudo-random generator (Park and Miller). */
function random(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

/** Smooth value noise over a 32-cell lattice, summed over three octaves. */
function noiseField(seed) {
  const size = 32;
  const next = random(seed);
  const lattice = Array.from({ length: (size + 1) ** 2 }, next);
  const at = (i, j) => lattice[(j % (size + 1)) * (size + 1) + (i % (size + 1))];
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    const xi = Math.floor(x) % size;
    const yi = Math.floor(y) % size;
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

function terrain() {
  const fbm = noiseField(SEED);
  return (gx, gy) => {
    const x = (gx / GRID_W) * 2;
    const y = gy / GRID_H;
    let h = 0;
    for (const p of PEAKS) h += p.h * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / (2 * p.s * p.s));
    return h + 0.3 * fbm(gx / 20, gy / 20);
  };
}

const round = (n) => Math.round(n * SCALE);

function contourSvg(values) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) { min = Math.min(min, v); max = Math.max(max, v); }
  const thresholds = Array.from({ length: LEVELS }, (_, k) => min + ((max - min) * (k + 1)) / (LEVELS + 1));
  const rings = contours().size([GRID_W, GRID_H]).thresholds(thresholds)(values);
  // d3-contour closes a contour that leaves the grid by running it along the grid's edge.
  // Those runs are not contours, so a ring is drawn as open runs that skip them.
  const onSameEdge = ([x1, y1], [x2, y2]) => (x1 === x2 && (x1 === 0 || x1 === GRID_W))
    || (y1 === y2 && (y1 === 0 || y1 === GRID_H));
  const ringPath = (ring) => {
    const at = ([x, y]) => `${round(x)} ${round(y)}`;
    const edges = ring.slice(1).map((q, k) => !onSameEdge(ring[k], q));
    if (edges.every(Boolean)) return `M${ring.slice(0, -1).map(at).join('L')}Z`;
    // Start just after an edge run, so every open run is drawn in one piece.
    const start = edges.indexOf(false) + 1;
    const points = [...ring.slice(start, -1), ...ring.slice(0, start)];
    let d = '';
    let drawing = false;
    for (let k = 1; k < points.length; k += 1) {
      if (onSameEdge(points[k - 1], points[k])) { drawing = false; continue; }
      d += drawing ? `L${at(points[k])}` : `M${at(points[k - 1])}L${at(points[k])}`;
      drawing = true;
    }
    return d;
  };
  const layer = (index) => rings
    .filter((_, k) => (k % 5 === 4) === index)
    .flatMap((geo) => geo.coordinates.flatMap((poly) => poly.map(ringPath)))
    .join('');
  // Every fifth line is an index contour, drawn stronger, as on a printed map.
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" fill="none" stroke="#000" stroke-linejoin="round">'
    + `<path stroke-opacity=".5" stroke-width=".9" d="${layer(false)}"/>`
    + `<path stroke-width="1.2" d="${layer(true)}"/>`
    + '</svg>\n';
}

/** Climbs from a start in the foothills to the highest cell: it follows the slope, with a pull
 * toward the summit that grows as it goes, so it wanders like an optimiser but cannot stall. */
function climb(height, values) {
  let top = 0;
  for (let k = 1; k < values.length; k += 1) if (values[k] > values[top]) top = k;
  const sx = top % GRID_W;
  const sy = Math.floor(top / GRID_W);
  const grad = (x, y) => [(height(x + 0.5, y) - height(x - 0.5, y)), (height(x, y + 0.5) - height(x, y - 0.5))];
  let x = 158, y = 146, vx = 0, vy = -0.3;
  const points = [[x, y]];
  for (let step = 0; step < 4000; step += 1) {
    const [gx, gy] = grad(x, y);
    const gn = Math.hypot(gx, gy) || 1;
    const dx = sx - x, dy = sy - y, dist = Math.hypot(dx, dy);
    if (dist < 1.5) break;
    const pull = 0.35 + 0.65 * Math.min(1, step / 900);
    vx = vx * 0.92 + ((gx / gn) * (1 - pull) + (dx / dist) * pull) * 0.09;
    vy = vy * 0.92 + ((gy / gn) * (1 - pull) + (dy / dist) * pull) * 0.09;
    x += vx;
    y += vy;
    if (step % 18 === 0) points.push([x, y]);
  }
  while (points.length > 2 && Math.hypot(points.at(-1)[0] - sx, points.at(-1)[1] - sy) < 6) points.pop();
  points.push([sx, sy]);
  return points;
}

/** A smooth curve through the points (Catmull-Rom, written as cubic Béziers). */
function smoothPath(points) {
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}

function trailSvg(points) {
  const [start, summit] = [points[0], points.at(-1)];
  return '<svg class="terrain-trail-art" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">'
    + `<path class="terrain-trail" pathLength="1" d="${smoothPath(points)}"/>`
    + `<circle class="terrain-start" cx="${round(start[0])}" cy="${round(start[1])}" r="5"/>`
    + `<circle class="terrain-summit" cx="${round(summit[0])}" cy="${round(summit[1])}" r="7"/>`
    + '</svg>\n';
}

/** The ridge behind the career path: rising left to right, jagged, in a 1200 by 240 view box. */
function ridge() {
  const width = 1200, height = 240;
  const at = (x) => {
    const t = x / width;
    const jag = 14 * Math.sin(x / 37) + 9 * Math.sin(x / 13 + 1.3) + 5 * Math.sin(x / 5.3 + 0.4);
    return 200 - 150 * t ** 1.15 + jag * (0.5 + 0.5 * t);
  };
  const samples = Array.from({ length: width / RIDGE_STEP + 1 }, (_, i) => Math.round(at(i * RIDGE_STEP) * 10) / 10);
  const line = `M${samples.map((y, i) => `${i * RIDGE_STEP} ${y}`).join('L')}`;
  return { width, height, line, fill: `${line}L${width} ${height}L0 ${height}Z`, samples };
}

/** Returns every generated file, keyed by its path in the repository. */
export function render() {
  const height = terrain();
  const values = new Float64Array(GRID_W * GRID_H);
  for (let j = 0; j < GRID_H; j += 1) for (let i = 0; i < GRID_W; i += 1) values[j * GRID_W + i] = height(i, j);
  return {
    'assets/img/terrain.svg': contourSvg(values),
    '_includes/terrain-trail.svg': trailSvg(climb(height, values)),
    '_data/ridge.json': `${JSON.stringify(ridge())}\n`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [path, content] of Object.entries(render())) {
    writeFileSync(path, content);
    console.log(`${path}: ${content.length} bytes`);
  }
}
