import { effectiveTheme, nextTheme } from './lib/theme.js';

const root = document.documentElement;
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return effectiveTheme(root.dataset.theme ?? null, darkQuery.matches);
}

function setupThemeButton() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  const label = () => button.setAttribute('aria-label', `Switch to ${nextTheme(currentTheme())} theme`);
  button.addEventListener('click', () => {
    const theme = nextTheme(currentTheme());
    root.dataset.theme = theme;
    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      // Storage is blocked: the choice applies to this page only.
    }
    label();
  });
  darkQuery.addEventListener('change', label);
  label();
}

// The menu is a native popover, so it opens, closes on Escape or an outside click, and comes
// next in the Tab order without this script. The script reports its state on the button, closes
// it when a link is chosen, when focus leaves it or when the window widens past it, and returns
// focus to the button on Escape.
function setupMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById(button?.getAttribute('popovertarget'));
  if (!button || !menu || typeof menu.hidePopover !== 'function') return;
  const close = () => {
    if (menu.matches(':popover-open')) menu.hidePopover();
  };
  button.setAttribute('aria-expanded', 'false');
  menu.addEventListener('toggle', (event) => {
    button.setAttribute('aria-expanded', String(event.newState === 'open'));
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  menu.addEventListener('focusout', (event) => {
    const next = event.relatedTarget;
    if (next && !menu.contains(next) && next !== button) close();
  });
  // Escape returns focus to the button even where clicking the button did not focus it (Safari).
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.matches(':popover-open')) return;
    close();
    button.focus();
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', close);
}

function setupHeaderRule() {
  const header = document.querySelector('.site-header');
  const sentinel = document.querySelector('.scroll-sentinel');
  if (!header || !sentinel) return;
  new IntersectionObserver(([entry]) => {
    header.toggleAttribute('data-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

setupThemeButton();
setupMenu();
setupHeaderRule();
