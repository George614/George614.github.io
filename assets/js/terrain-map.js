import { SCALE, createTerrain, climb, smoothPath, toGrid } from './lib/terrain.js';

// The contour map behind the home page heading answers the pointer. Moving over it lights the
// contours near the pointer and previews, as a dotted line, the climb from there to the summit;
// a click or a tap draws that climb in gold. The map stays decoration: it is hidden from
// assistive technology, and clicks on the heading's text and links, or while selecting text, are
// left alone.

const SVG = 'http://www.w3.org/2000/svg';
// Older climbs are removed beyond this many, so the map never fills with lines.
const MAX_ROUTES = 3;

const hero = document.querySelector('.hero');
const terrain = hero?.querySelector('.terrain');
const art = terrain?.querySelector('.terrain-trail-art');
if (art) start();

function start() {
  const height = createTerrain();
  const summitDot = art.querySelector('.terrain-summit');
  const summit = [Number(summitDot.getAttribute('cx')) / SCALE, Number(summitDot.getAttribute('cy')) / SCALE];
  const shape = (name, className, attributes = {}) => {
    const el = document.createElementNS(SVG, name);
    el.setAttribute('class', className);
    for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
    return el;
  };
  const routes = shape('g', 'terrain-routes');
  const probe = shape('path', 'terrain-probe');
  const probeStart = shape('circle', 'terrain-probe-start', { r: 4 });
  // Below the summit's dot, so the dot stays on top of every line that reaches it.
  summitDot.before(routes, probe, probeStart);

  const hint = hero.querySelector('.terrain-hint');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  hint.textContent = canHover ? 'Click anywhere on the map to climb from there.' : 'Tap the map to climb from there.';
  hint.hidden = false;

  /** The grid point under the pointer, or null when the pointer is outside the map. */
  const gridAt = (event) => {
    const rect = terrain.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) return null;
    terrain.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    terrain.style.setProperty('--my', `${event.clientY - rect.top}px`);
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(art.getScreenCTM().inverse());
    return toGrid(point.x, point.y);
  };

  const hide = () => hero.classList.remove('is-pointing');

  const preview = (event) => {
    const at = gridAt(event);
    if (!at) {
      hide();
      return;
    }
    probe.setAttribute('d', smoothPath(climb(height, at, summit)));
    probeStart.setAttribute('cx', (at[0] * SCALE).toFixed(1));
    probeStart.setAttribute('cy', (at[1] * SCALE).toFixed(1));
    hero.classList.add('is-pointing');
  };

  // One preview per frame, from the latest pointer position.
  let frame = 0;
  let latest = null;
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    latest = event;
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        preview(latest);
      });
    }
  });
  hero.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    hide();
  });

  hero.addEventListener('click', (event) => {
    // The heading, lede and links keep their own clicks, such as selecting a word.
    if (event.target.closest('a, button, .hero-text > *')) return;
    if (!window.getSelection().isCollapsed) return;
    const at = gridAt(event);
    if (!at) return;
    const route = shape('g', 'terrain-route');
    route.append(
      shape('path', 'terrain-route-line', { d: smoothPath(climb(height, at, summit)), pathLength: 1 }),
      shape('circle', 'terrain-route-start', { cx: (at[0] * SCALE).toFixed(1), cy: (at[1] * SCALE).toFixed(1), r: 4.5 }),
    );
    routes.append(route);
    while (routes.children.length > MAX_ROUTES) routes.firstElementChild.remove();
  });
}
