// Hauptfarbe eines Bilds (häufigste Farbe, per sharp beim Build), aus der kleinsten erzeugten Größe (640 px).
// Die Fläche eines Bilds zeigt sie, bis das Foto geladen ist (wie die Kacheln im Laufband, src/lib/band.js).
import sharp from 'sharp';

const cache = new Map();

/** meta: Eintrag aus src/generated/media.json (resolveImage). Ergebnis z. B. "rgb(212 200 180)". */
export function dominant(meta) {
  const small = `public${meta.variants.webp[0].url}`;
  if (!cache.has(small)) {
    cache.set(small, sharp(small, { failOn: 'none' }).stats().then(({ dominant: d }) => `rgb(${d.r} ${d.g} ${d.b})`));
  }
  return cache.get(small);
}
