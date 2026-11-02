// Erzeugt Favicon-PNGs und das Teilen-Bild (public/og.png) aus brand/. Nur nötig, wenn sich Logo oder Name ändern.
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const fav = await readFile(path.join(ROOT, 'public', 'favicon.svg'));
await sharp(fav, { density: 300 }).resize(32, 32).png().toFile(path.join(ROOT, 'public', 'favicon-32.png'));
await sharp(fav, { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, 'public', 'apple-touch-icon.png'));

const knock = (await readFile(path.join(ROOT, 'brand', 'logo-knockout.svg'), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
const tpl = await readFile(path.join(ROOT, 'brand', 'og.html'), 'utf8');
const tmp = path.join(ROOT, 'brand', '.og-render.html');
const site = JSON.parse(await readFile(path.join(ROOT, 'content', 'site.json'), 'utf8'));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
await writeFile(tmp, tpl
  .replace('MARK', knock)
  .replace('NAME', esc(String(site.person?.name ?? '').toLowerCase()))
  .replace('WORDS', esc((site.hero?.subtitle ?? []).join(' — '))));
const chrome = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', `--screenshot=${path.join(ROOT, 'public', 'og.png')}`, 'file:///' + tmp.split(path.sep).join('/')], { stdio: 'ignore' });
await (await import('node:fs/promises')).rm(tmp);
console.log('favicon-32.png, apple-touch-icon.png, og.png erzeugt.');
