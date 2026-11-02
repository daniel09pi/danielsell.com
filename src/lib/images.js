// Ordnet die Bildpfade aus der JSON (relativ zum Repo) den erzeugten Größen zu.
// Die Größen erzeugt scripts/images.mjs vor jedem Build; die Originale werden nie ausgeliefert.
import { isPlaceholder } from './content.js';
import media from '../generated/media.json';

export function resolveImage(path) {
  if (typeof path !== 'string' || !path.trim()) return null;
  const key = path.trim().replace(/^\.?\/+/, '');
  const entry = media[key];
  if (!entry) {
    throw new Error(`Bild nicht gefunden: "${path}". Pfade in content/*.json sind relativ zum Repo, z. B. "portfolio_files/alukeku/1.avif". Danach "npm run build".`);
  }
  return entry;
}

/**
 * Bilder eines Projekts: Einträge sind ein Pfad ("portfolio_files/…") oder { "src": "…", "alt": "…" }.
 * Platzhalter in [eckigen Klammern] werden als Platzhalter-Fläche gezeigt, "" wird übersprungen.
 */
export function projectImages(project) {
  const list = (project.images ?? []).filter((e) => (typeof e === 'string' ? e.trim() !== '' : e && e.src));
  const total = list.length;
  return list.map((entry, i) => {
    const src = typeof entry === 'string' ? entry : entry.src;
    const alt = typeof entry === 'object' && entry.alt ? entry.alt : `${project.title}, ${project.kind || 'project'}: image ${i + 1} of ${total}`;
    if (isPlaceholder(src)) return { placeholder: true, label: src, alt };
    return { placeholder: false, meta: resolveImage(src), alt };
  });
}
