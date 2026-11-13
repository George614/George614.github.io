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

function setupMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById(button?.getAttribute('aria-controls'));
  if (!button || !menu) return;
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', () => setOpen(false));
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
