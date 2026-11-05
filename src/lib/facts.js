// Kennzahlen eines Bereichs, für alle gleich: „5 projects, 2024–2026, 35 images“ (aus projects.json).
// Stehen im Farbfeld der Startseite und unter dem Kopf der Bereichsseite.
import { byCategory, has } from './content.js';
import { projectImages } from './images.js';

const number = (n) => n.toLocaleString('en-US');

export function areaFacts(cat) {
  const list = byCategory(cat).filter((p) => has(p.title));
  const years = list.flatMap((p) => String(p.year ?? '').match(/\d{4}/g) ?? []).map(Number);
  const images = list.reduce((n, p) => n + projectImages(p).filter((im) => !im.placeholder).length, 0);
  const [from, to] = [Math.min(...years), Math.max(...years)];
  return [
    `${number(list.length)} ${list.length === 1 ? 'project' : 'projects'}`,
    ...(years.length ? [from === to ? String(from) : `${from}–${to}`] : []),
    `${number(images)} ${images === 1 ? 'image' : 'images'}`,
  ].join(', ');
}
