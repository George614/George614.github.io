import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = '_site';

export function read(path) {
  return readFileSync(path, 'utf8');
}

/** Lists every HTML file under the built site. */
export function allHtmlFiles(dir = SITE) {
  return readdirSync(dir, { recursive: true })
    .filter((name) => name.endsWith('.html'))
    .map((name) => join(dir, name));
}

/** Returns the text a reader sees: no tags, scripts, styles or BibTeX source. */
export function visibleText(path) {
  return read(path)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

/** Returns every opening tag with the given name. */
export function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
}

export function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}
