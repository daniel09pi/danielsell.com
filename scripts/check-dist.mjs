// Prüft nach dem Build, ob dist/ vollständig und aktuell ist. Teil von "npm run release".
import { readdir, stat, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = path.join(ROOT, 'dist');
const problems = [];

async function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// 1. Jede Seite in src/pages hat eine fertige HTML-Datei.
for (const f of (await walk(path.join(ROOT, 'src', 'pages'))).filter((x) => x.endsWith('.astro'))) {
  const rel = path.relative(path.join(ROOT, 'src', 'pages'), f).replace(/\\/g, '/').replace(/\.astro$/, '');
  const target = rel === 'index' ? 'index.html' : rel === '404' ? '404.html' : `${rel.replace(/\/index$/, '')}/index.html`;
  if (!existsSync(path.join(DIST, target))) problems.push(`Seite fehlt in dist/: ${target}`);
}

// 2. dist/ ist neuer als alle Quellen.
const distTime = existsSync(path.join(DIST, 'index.html')) ? (await stat(path.join(DIST, 'index.html'))).mtimeMs : 0;
for (const dir of ['src', 'content', 'brand', 'public']) {
  for (const f of await walk(path.join(ROOT, dir))) {
    if (f.includes(`${path.sep}generated${path.sep}`) || f.includes(`${path.sep}media${path.sep}`)) continue;
    if ((await stat(f)).mtimeMs > distTime + 1000) problems.push(`Neuer als der Build: ${path.relative(ROOT, f)} (npm run build)`);
  }
}

// 3. Nichts Verbotenes ausgeliefert.
const files = await walk(DIST);
for (const f of files) {
  const rel = path.relative(DIST, f).replace(/\\/g, '/');
  const size = (await stat(f)).size;
  if (size > 1024 * 1024) problems.push(`Datei über 1 MB: dist/${rel}`);
  if (/\.html$/.test(rel)) {
    const html = await readFile(f, 'utf8');
    if (/fonts\.(googleapis|gstatic)\.com/.test(html)) problems.push(`Google Fonts in dist/${rel}`);
    if (/portfolio_files\//.test(html)) problems.push(`Original-Bildpfad in dist/${rel}`);
    for (const m of html.matchAll(/(?:src|href)="(https?:)?\/\/(?!danielsell\.com)([^"/]+)[^"]*\.(js|css|woff2?)"/g)) problems.push(`Fremde Einbindung in dist/${rel}: ${m[2]}`);
  }
}

// 4. Jeder interne Link und jede interne Datei existiert in dist/ (auch die Sitemap aus robots.txt).
const inDist = (u) => {
  const clean = decodeURIComponent(u.split(/[?#]/)[0]);
  const f = path.join(DIST, clean);
  if (!clean.endsWith('/') && existsSync(f)) return true;
  return existsSync(path.join(f, 'index.html'));
};
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const html = await readFile(f, 'utf8');
  const rel = path.relative(DIST, f).split(path.sep).join('/');
  const refs = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
  ];
  for (const u of refs) if (u.startsWith('/') && !u.startsWith('//') && !inDist(u)) problems.push(`Toter interner Link in dist/${rel}: ${u}`);
}
const robotsFile = path.join(DIST, 'robots.txt');
if (existsSync(robotsFile)) {
  for (const m of (await readFile(robotsFile, 'utf8')).matchAll(/Sitemap:\s*https?:\/\/[^/\s]+(\/\S*)/g)) {
    if (!inDist(m[1])) problems.push(`robots.txt nennt eine fehlende Datei: ${m[1]}`);
  }
}

if (problems.length) {
  console.error('dist/ ist NICHT bereit:\n- ' + [...new Set(problems)].join('\n- '));
  process.exit(1);
}
let status = '';
try { status = execSync('git status --porcelain -- dist', { cwd: ROOT, encoding: 'utf8' }).trim(); } catch {}
console.log(`dist/ ist vollständig und aktuell (${files.length} Dateien).`);
console.log(status ? `Geänderte Dateien in dist/: ${status.split('\n').length}. Jetzt committen: git add -A && git commit` : 'dist/ entspricht dem letzten Commit.');
