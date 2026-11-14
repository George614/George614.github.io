// Draws the home page artwork, deterministically, so the committed files can be checked. The
// terrain itself, and the climb, are in assets/js/lib/terrain.js, which the page also uses.
//   assets/img/terrain.svg       contour lines of an imaginary mountain, used as a CSS mask
//   _includes/terrain-trail.svg  the path that climbs it, drawn over the same view box
//   _data/ridge.json             the ridge behind the career path, one 200-unit column per step
//                                in _data/path.yml, sampled every 5 units
// Run with `npm run art` after changing anything here.
import { contours } from 'd3-contour';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GRID_W, GRID_H, SCALE, createTerrain, findSummit, climb, smoothPath } from '../assets/js/lib/terrain.js';

const LEVELS = 22;
// Each career step gets a column 200 units wide, sampled every 5 units, so the centre of every
// column (100, 300, 500, ...) is a sample and each waypoint sits exactly on the ridge line.
const RIDGE_COLUMN = 200;
const RIDGE_STEP = 5;

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

function trailSvg(points) {
  const [start, summit] = [points[0], points.at(-1)];
  return '<svg class="terrain-trail-art" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">'
    + `<path class="terrain-trail" pathLength="1" d="${smoothPath(points)}"/>`
    + `<circle class="terrain-start" cx="${round(start[0])}" cy="${round(start[1])}" r="5"/>`
    + `<circle class="terrain-summit" cx="${round(summit[0])}" cy="${round(summit[1])}" r="7"/>`
    + '</svg>\n';
}

/** The number of steps in the career path, one list item per step. */
function careerSteps() {
  return readFileSync(new URL('../_data/path.yml', import.meta.url), 'utf8').match(/^- /gm).length;
}

/** The ridge behind the career path: rising left to right, jagged, 240 units tall. */
function ridge(steps) {
  const width = RIDGE_COLUMN * steps, height = 240;
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
  const height = createTerrain();
  const values = new Float64Array(GRID_W * GRID_H);
  for (let j = 0; j < GRID_H; j += 1) for (let i = 0; i < GRID_W; i += 1) values[j * GRID_W + i] = height(i, j);
  // The drawn trail starts in the foothills below the summit, heading uphill.
  const trail = climb(height, [158, 146], findSummit(height), [0, -0.3]);
  return {
    'assets/img/terrain.svg': contourSvg(values),
    '_includes/terrain-trail.svg': trailSvg(trail),
    '_data/ridge.json': `${JSON.stringify(ridge(careerSteps()))}\n`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [path, content] of Object.entries(render())) {
    writeFileSync(path, content);
    console.log(`${path}: ${content.length} bytes`);
  }
}
