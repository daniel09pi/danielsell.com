// Erzeugt die ausgelieferten Bildgrößen aus den Originalen in portfolio_files/.
// Liest nur die Bilder, die in content/site.json und content/projects.json stehen.
// Ausgabe: public/media/… (wird beim Build nach dist/media/ kopiert) und src/generated/media.json.
// Bereits erzeugte Dateien werden übersprungen. Ändert sich ein Original oder eine Einstellung,
// ändert sich der Fingerabdruck im Dateinamen, und die Größen werden neu erzeugt.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'generated', 'media.json');
const WIDTHS = [640, 1280, 2000];
const FORMATS = { avif: { quality: 55, effort: 4 }, webp: { quality: 78, effort: 4 } };

const isPlaceholder = (v) => typeof v === 'string' && /^\s*\[[\s\S]*\]\s*$/.test(v);
const slug = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const site = JSON.parse(await readFile(path.join(ROOT, 'content', 'site.json'), 'utf8'));
const { projects } = JSON.parse(await readFile(path.join(ROOT, 'content', 'projects.json'), 'utf8'));

const sources = new Set();
const add = (v) => {
  const src = typeof v === 'string' ? v : v?.src;
  if (typeof src === 'string' && src.trim() && !isPlaceholder(src)) sources.add(src.trim().replace(/^\.?\/+/, ''));
};
add(site.about?.photo?.src);
for (const p of projects) for (const im of p.images ?? []) add(im);

// Hinweis: Bilder ohne eigenen Alt-Text in der JSON (die Seite erzeugt dann einen aus Titel und Nummer)
const noAlt = projects.flatMap((p) => (p.images ?? []).filter((im) => typeof im === 'string' && im.trim() && !isPlaceholder(im)).map((im) => `${p.slug}: ${im}`));
if (noAlt.length) console.log(`Ohne Alt-Text in projects.json (${noAlt.length}): ${noAlt.join(', ')}`);

const manifest = {};
const keep = new Set();
let made = 0;

for (const rel of sources) {
  const file = path.join(ROOT, rel);
  if (!existsSync(file)) {
    console.error(`Bild fehlt: ${rel} (Pfad in content/*.json prüfen)`);
    process.exitCode = 1;
    continue;
  }
  const sig = createHash('sha1').update(await readFile(file)).update(JSON.stringify({ WIDTHS, FORMATS })).digest('hex').slice(0, 8);
  const img = sharp(file, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  const oriented = (meta.orientation ?? 1) >= 5;
  const W = oriented ? meta.height : meta.width;
  const H = oriented ? meta.width : meta.height;
  const max = Math.min(W, WIDTHS[WIDTHS.length - 1]);
  const widths = [...new Set([...WIDTHS.filter((w) => w < max), max])];

  const dir = path.dirname(rel).split(/[\\/]/).filter((s) => s !== 'portfolio_files').map(slug).join('/');
  const base = slug(path.basename(rel, path.extname(rel)));
  const entry = { width: max, height: Math.round((H / W) * max), variants: {} };

  for (const [fmt, opts] of Object.entries(FORMATS)) {
    entry.variants[fmt] = [];
    for (const w of widths) {
      const name = `${dir ? dir + '/' : ''}${base}-${w}-${sig}.${fmt}`;
      const out = path.join(OUT, name);
      keep.add(path.normalize(out));
      entry.variants[fmt].push({ w, url: `/media/${name}` });
      if (existsSync(out)) continue;
      await mkdir(path.dirname(out), { recursive: true });
      await sharp(file, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true })[fmt](opts).toFile(out);
      made++;
    }
  }
  manifest[rel] = entry;
}

// Alte Dateien entfernen, die keine JSON-Datei mehr nennt
async function prune(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { await prune(p); if (!(await readdir(p)).length) await rm(p, { recursive: true }); }
    else if (!keep.has(path.normalize(p))) await rm(p);
  }
}
await prune(OUT);

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Bilder: ${sources.size} Originale, ${made} Dateien neu erzeugt.`);
