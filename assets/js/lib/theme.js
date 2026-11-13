/** The two themes the site supports. */
export const THEMES = ['light', 'dark'];

/** Returns the theme to show: a valid stored choice wins, otherwise the system setting. */
export function effectiveTheme(stored, prefersDark) {
  if (THEMES.includes(stored)) return stored;
  return prefersDark ? 'dark' : 'light';
}

/** Returns the theme the theme button switches to. */
export function nextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}
