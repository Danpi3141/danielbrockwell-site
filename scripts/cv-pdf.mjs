// Prints the built CV page (_site/cv/) to src/downloads/cv/daniel-brockwell-cv.pdf with headless Chrome or Edge.
// The print stylesheet (site.css, @media print) gives it its own heading, A4 pages and no site navigation.
// Run after `npm run build`, then build again so the CV page shows its "Download as PDF" button:
//   npm run build && npm run cv-pdf && npm run deploy
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = path.join(ROOT, '_site');
const SITE_URL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', '_data', 'site.json'), 'utf8')).url.replace(/\/$/, '');
const OUT = path.join(ROOT, 'src', 'downloads', 'cv', 'daniel-brockwell-cv.pdf');
const BROWSERS = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const browser = BROWSERS.find((b) => fs.existsSync(b));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME to its path.');
if (!fs.existsSync(path.join(SITE, 'cv', 'index.html'))) throw new Error('Build the site first: _site/cv/index.html is missing.');

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(SITE, p);
  if (!file.startsWith(SITE) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  // Links in the PDF must point at the live site, not at this temporary server.
  if (file.endsWith('.html')) res.end(fs.readFileSync(file, 'utf8').replace(/<a href="\//g, `<a href="${SITE_URL}/`));
  else fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/cv/`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-pdf-'));
const tmp = path.join(profile, 'cv.pdf');
// The analytics host is mapped away, so printing the CV never counts as a visit.
const r = await new Promise((resolve) => {
  const args = ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
    '--host-resolver-rules=MAP static.cloudflareinsights.com 0.0.0.0, MAP cloudflareinsights.com 0.0.0.0',
    '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=5000',
    `--print-to-pdf=${tmp}`, url];
  spawn(browser, args, { stdio: 'ignore' }).on('exit', resolve);
});
server.close();
if (r !== 0 || !fs.existsSync(tmp)) throw new Error(`${path.basename(browser)} did not write the PDF (exit ${r}).`);
fs.copyFileSync(tmp, OUT);
fs.rmSync(profile, { recursive: true, force: true });
const pages = (fs.readFileSync(OUT, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`Wrote ${path.relative(ROOT, OUT)}: ${fs.statSync(OUT).size} bytes, ${pages} page(s).`);
