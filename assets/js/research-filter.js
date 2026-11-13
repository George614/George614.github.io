import { parseTopic } from './lib/topic.js';

const nav = document.querySelector('[data-topic-filter]');
const links = [...nav.querySelectorAll('a[data-topic]')];
const rows = [...document.querySelectorAll('[data-filtered-list] li[data-topic]')];
const status = document.querySelector('[data-filter-status]');
const keys = links.map((link) => link.dataset.topic).filter(Boolean);

// On a phone the topics scroll sideways; bring the active one into view without scrolling the page.
function revealInRow(link) {
  const row = link.closest('ul');
  const rowBox = row.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();
  if (linkBox.left < rowBox.left || linkBox.right > rowBox.right) {
    row.scrollLeft += linkBox.left - rowBox.left - parseFloat(getComputedStyle(row).paddingLeft);
  }
}

function apply(topic) {
  for (const link of links) {
    if ((link.dataset.topic || null) === topic) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
  let shown = 0;
  for (const row of rows) {
    row.hidden = topic !== null && row.dataset.topic !== topic;
    if (!row.hidden) shown += 1;
  }
  const active = links.find((link) => link.getAttribute('aria-current') === 'true');
  revealInRow(active);
  status.textContent = topic ? `Showing ${shown} entries in ${active.textContent}` : `Showing all ${shown} entries`;
}

nav.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-topic]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (link.href !== window.location.href) window.history.pushState(null, '', link.href);
  apply(link.dataset.topic || null);
});

window.addEventListener('popstate', () => apply(parseTopic(window.location.search, keys)));
apply(parseTopic(window.location.search, keys));
// Transitions start only after the first paint, so opening a filtered address does not animate the filter.
window.requestAnimationFrame(() => window.requestAnimationFrame(() => nav.setAttribute('data-ready', '')));
