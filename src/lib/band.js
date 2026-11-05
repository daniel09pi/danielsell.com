// Bilder für das Laufband im Hero: pro Bereich die Projekte mit ihren Bildern (AVIF-Größen) und der Hauptfarbe jedes
// Bilds (häufigste Farbe, per sharp beim Build). Die Kachel zeigt die Farbe, bis das Foto geladen ist.
// Ein Bild, das schon in einem früheren Bereich vorkommt (flowinsync zeigt vorläufig Bilder aus creative), gehört dem
// ersten Bereich; sonst stünde ein creative-Bild über dem dev-Feld.
import sharp from 'sharp';
import { has, isPlaceholder, CATEGORIES, byCategory } from './content.js';
import { resolveImage } from './images.js';

export async function bandPools() {
  const owner = new Map();
  const pools = {};
  for (const cat of CATEGORIES) {
    pools[cat] = [];
    for (const p of byCategory(cat).filter((x) => has(x.title))) {
      const imgs = [];
      for (const src of (p.images ?? []).map((e) => (typeof e === 'string' ? e : e?.src))) {
        if (!has(src) || isPlaceholder(src)) continue;
        if (owner.has(src) && owner.get(src) !== cat) continue;
        owner.set(src, cat);
        const m = resolveImage(src);
        // aus der kleinsten erzeugten Größe (public/media/…, 640 px), nicht aus dem Original: gleiches Ergebnis, viel schneller
        const small = `public${m.variants.webp[0].url}`;
        const { dominant: d } = await sharp(small, { failOn: 'none' }).stats();
        imgs.push({
          srcset: m.variants.avif.map((v) => `${encodeURI(v.url)} ${v.w}w`).join(', '),
          src: encodeURI(m.variants.avif[0].url),
          color: `rgb(${d.r} ${d.g} ${d.b})`,
        });
      }
      if (imgs.length) pools[cat].push({ slug: p.slug, imgs });
    }
  }
  return pools;
}
