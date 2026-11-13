// Runs Lighthouse (mobile profile) against the built site and checks the thresholds in
// lighthouserc.json. The config follows the Lighthouse CI format, so `lhci autorun` would read
// it too; this script exists because @lhci/cli pulls in dependencies with known vulnerabilities.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createSecureServer } from 'node:http2';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const PORT = 4174;
const config = JSON.parse(readFileSync(new URL('../lighthouserc.json', import.meta.url), 'utf8'));
const { staticDistDir, url: urls, numberOfRuns, settings } = config.collect;
const { assertions } = config.assert;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
};
const COMPRESSED = new Set(['.html', '.css', '.js', '.json', '.xml', '.svg']);

/** A throwaway self-signed certificate, because browsers speak HTTP/2 only over TLS. */
function certificate() {
  const dir = mkdtempSync(join(tmpdir(), 'lighthouse-'));
  try {
    execFileSync('openssl', ['req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:prime256v1', '-nodes',
      '-subj', '/CN=localhost', '-days', '1', '-keyout', join(dir, 'key.pem'), '-out', join(dir, 'cert.pem')],
    { stdio: 'ignore' });
    return { key: readFileSync(join(dir, 'key.pem')), cert: readFileSync(join(dir, 'cert.pem')) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Serves the built site the way GitHub Pages does in the respects that matter to these
 * measurements: HTTP/2 over TLS, gzip-compressed text, and index.html for a directory address.
 * Lighthouse simulates a slow phone connection from the requests it sees, so an HTTP/1.1 server
 * would be measured as six separate connections instead of the one that Pages uses.
 */
function serve(root) {
  return createSecureServer({ ...certificate(), allowHTTP1: true }, async (request, response) => {
    let path = normalize(decodeURIComponent(new URL(request.url, 'https://localhost').pathname));
    if (path.endsWith('/')) path += 'index.html';
    try {
      let body = await readFile(join(root, path));
      const type = extname(path);
      const headers = { 'content-type': TYPES[type] ?? 'application/octet-stream', 'cache-control': 'no-store' };
      if (COMPRESSED.has(type) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) {
        body = gzipSync(body);
        headers['content-encoding'] = 'gzip';
      }
      response.writeHead(200, headers);
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
}

/** Median of the runs, so one slow or fast run does not decide the result. */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/** Reads the value an assertion checks from one Lighthouse result. */
function measure(lhr, key, assertion) {
  if (key.startsWith('categories:')) return lhr.categories[key.slice('categories:'.length)].score;
  const audit = lhr.audits[key];
  return 'maxNumericValue' in assertion ? audit.numericValue : audit.score;
}

async function runOnce(chrome, target) {
  const result = await lighthouse(target, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility'],
    blockedUrlPatterns: settings.blockedUrlPatterns,
  });
  if (result.lhr.runtimeError) throw new Error(`${target}: ${result.lhr.runtimeError.message}`);
  return result.lhr;
}

async function main() {
  const server = serve(staticDistDir);
  await new Promise((resolve) => server.listen(PORT, 'localhost', resolve));
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--ignore-certificate-errors'] });
  const failures = [];
  try {
    for (const address of urls) {
      const target = new URL(new URL(address).pathname, `https://localhost:${PORT}`).href;
      const runs = [];
      for (let i = 0; i < numberOfRuns; i += 1) runs.push(await runOnce(chrome, target));
      for (const [key, [, assertion]] of Object.entries(assertions)) {
        const value = median(runs.map((lhr) => measure(lhr, key, assertion)));
        const ok = 'minScore' in assertion ? value >= assertion.minScore : value <= assertion.maxNumericValue;
        const limit = 'minScore' in assertion ? `>= ${assertion.minScore}` : `<= ${assertion.maxNumericValue}`;
        console.log(`${ok ? 'pass' : 'FAIL'}  ${target}  ${key} = ${Math.round(value * 1000) / 1000} (needs ${limit})`);
        if (!ok) failures.push(key);
      }
    }
  } finally {
    await chrome.kill();
    server.close();
  }
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
