// Bilderbox: alle Bilder eines Projekts in einem Rechteck (Startseite, State 2 der Bereiche).
// Die Bilder werden als Baum aus waagerechten und senkrechten Teilungen angeordnet (Guillotine-Collage).
// Jeder Teilbaum hat eine lineare Form: Breite = a · Höhe + b (b sammelt die Abstände). Damit lässt sich für
// viele zufällige Bäume schnell ausrechnen, wie gut sie in die Box passen; gewählt wird der beste. Die äußeren
// Bilder liegen genau an den Kanten, was nicht exakt aufgeht, gleicht ein Zuschnitt von wenigen Prozent aus
// (object-fit: cover). Zufall mit festem Startwert: gleiche Box, gleiches Bild.
// Fokus: ein Bild etwa halb so groß wie die Box, die anderen klein drumherum (in ein bis drei Gruppen).

const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const hash = (s) => {
  let h = 2166136261;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h;
};
const shuffle = (list, r) => {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
};
const split = (r, a, b) => ({ dir: r() < 0.5 ? 'h' : 'v', kids: r() < 0.5 ? [a, b] : [b, a] });
const randTree = (items, r) => {
  if (items.length === 1) return { leaf: items[0] };
  const k = 1 + Math.floor(r() * (items.length - 1));
  return split(r, randTree(items.slice(0, k), r), randTree(items.slice(k), r));
};
// Das große Bild, nacheinander mit ein bis drei Gruppen kleiner Bilder umgeben (Spalte daneben, Reihe darunter …)
const focusTree = (s, n, r) => {
  const others = shuffle([...Array(n).keys()].filter((i) => i !== s), r);
  const groups = Math.min(others.length, 1 + Math.floor(r() * 3));
  const cuts = [0, ...shuffle([...Array(others.length - 1).keys()].map((k) => k + 1), r).slice(0, groups - 1).sort((a, b) => a - b), others.length];
  let t = { leaf: s };
  for (let g = 0; g < groups; g++) t = split(r, t, randTree(others.slice(cuts[g], cuts[g + 1]), r));
  return t;
};

// Form jedes Knotens einmal von unten nach oben ausrechnen (am Knoten gespeichert)
const form = (t, ratio, g) => {
  if ('leaf' in t) return (t.f = { a: ratio[t.leaf], b: 0 });
  const [p, q] = t.kids.map((k) => form(k, ratio, g));
  if (t.dir === 'h') return (t.f = { a: p.a + q.a, b: p.b + q.b + g });
  const a = 1 / (1 / p.a + 1 / q.a);
  return (t.f = { a, b: a * (p.b / p.a + q.b / q.a - g) });
};
const place = (t, g, box, out) => {
  if ('leaf' in t) { out[t.leaf] = box; return; }
  const [p, q] = t.kids;
  if (t.dir === 'h') {
    // nebeneinander, gleiche Höhe; die natürlichen Breiten werden auf die vorhandene Breite gestreckt
    const np = p.f.a * box.h + p.f.b, nq = q.f.a * box.h + q.f.b;
    const wp = (np / (np + nq)) * (box.w - g);
    place(p, g, { x: box.x, y: box.y, w: wp, h: box.h }, out);
    place(q, g, { x: box.x + wp + g, y: box.y, w: box.w - wp - g, h: box.h }, out);
  } else {
    const np = (box.w - p.f.b) / p.f.a, nq = (box.w - q.f.b) / q.f.a;
    const hp = (np / (np + nq)) * (box.h - g);
    place(p, g, { x: box.x, y: box.y, w: box.w, h: hp }, out);
    place(q, g, { x: box.x, y: box.y + hp + g, w: box.w, h: box.h - hp - g }, out);
  }
};
const layoutOf = (t, ratio, g, W, H) => {
  form(t, ratio, g);
  const rects = [];
  place(t, g, { x: 0, y: 0, w: W, h: H }, rects);
  return rects;
};

// Bewertung (kleiner ist besser): Zuschnitt bis 3 % fast frei, darüber teuer; kein Bild winzig; normal das
// Titelbild unter den größeren und verschiedene Größen, im Fokus das gewählte Bild etwa halb so groß wie die Box.
export const measure = (rects, ratio, W, H, focus) => {
  let crop = 0, min = 1, max = 0;
  const area = rects.map((r) => (r.w * r.h) / (W * H));
  rects.forEach((r, i) => {
    crop = r.w > 0 && r.h > 0 ? Math.max(crop, Math.abs(Math.log(r.w / r.h / ratio[i]))) : Infinity;
    if (i !== focus) { min = Math.min(min, area[i]); max = Math.max(max, area[i]); }
  });
  return { crop, min, max, area };
};
const score = (rects, ratio, W, H, focus) => {
  const n = rects.length;
  const { crop, min, max, area } = measure(rects, ratio, W, H, focus);
  let s = crop * 2 + Math.max(0, crop - 0.03) * 30;
  if (focus < 0) {
    s += Math.max(0, 0.5 / n - min) * 80;           // kein Bild kleiner als die Hälfte des Durchschnitts
    s += Math.max(0, max - 2.8 / n) * 8;             // keins dominiert
    s += area[0] < max * 0.8 ? 0.3 : 0;              // das Titelbild gehört zu den großen
    s += max / Math.max(min, 1e-6) < 2.2 ? 0.05 : 0; // verschiedene Größen, nicht alle gleich
  } else {
    s += Math.max(0, Math.abs(area[focus] - 0.5) - 0.06) * 10;
    s += Math.max(0, 0.32 / n - min) * 100;          // die kleinen nicht winzig
    s += Math.max(0, max - area[focus] * 0.4) * 6;   // keins fast so groß wie das gewählte
  }
  return s;
};

// Kleine Änderung an einer Kopie: eine Teilung kippen, zwei Bilder tauschen oder einen Teilbaum neu würfeln.
// Das große Bild (Fokus) bleibt dabei, wo es ist.
const clone = (t) => ('leaf' in t ? { leaf: t.leaf } : { dir: t.dir, kids: [clone(t.kids[0]), clone(t.kids[1])] });
const leavesOf = (t) => ('leaf' in t ? [t.leaf] : [...leavesOf(t.kids[0]), ...leavesOf(t.kids[1])]);
const mutate = (t, r, focus) => {
  const c = clone(t), nodes = [], leaves = [];
  const walk = (x) => { if ('leaf' in x) { if (x.leaf !== focus) leaves.push(x); } else { nodes.push(x); x.kids.forEach(walk); } };
  walk(c);
  const m = r();
  if (m < 0.4 && nodes.length) {
    const x = nodes[Math.floor(r() * nodes.length)];
    x.dir = x.dir === 'h' ? 'v' : 'h';
  } else if (m < 0.8 && leaves.length > 1) {
    const a = leaves[Math.floor(r() * leaves.length)], b = leaves[Math.floor(r() * leaves.length)];
    [a.leaf, b.leaf] = [b.leaf, a.leaf];
  } else {
    const free = nodes.filter((x) => !leavesOf(x).includes(focus));
    if (free.length) {
      const x = free[Math.floor(r() * free.length)];
      const y = randTree(shuffle(leavesOf(x), r), r);
      x.dir = y.dir; x.kids = y.kids;
    }
  }
  return c;
};

/** ratio: Seitenverhältnisse (Breite/Höhe), W × H: Box, g: Abstand, focus: Index des großen Bildes oder -1.
 *  Erst viele zufällige Bäume, dann werden die besten Schritt für Schritt verbessert. */
export const collage = (ratio, W, H, g, seed, focus = -1, samples = 1200, keep = 6, steps = 250) => {
  const n = ratio.length;
  if (n === 1) return [{ x: 0, y: 0, w: W, h: H }];
  const r = rng(seed + (focus + 1) * 7919);
  const items = [...Array(n).keys()];
  const fresh = () => (focus < 0 || n < 3 ? randTree(shuffle(items, r), r) : focusTree(focus, n, r));
  const rate = (t) => { const rects = layoutOf(t, ratio, g, W, H); return { t, rects, s: score(rects, ratio, W, H, focus) }; };
  const pool = [];
  for (let k = 0; k < samples; k++) pool.push(rate(fresh()));
  pool.sort((a, b) => a.s - b.s);
  let best = pool[0];
  for (const start of pool.slice(0, keep)) {
    let cur = start;
    for (let i = 0; i < steps; i++) {
      const next = rate(mutate(cur.t, r, focus));
      if (next.s <= cur.s) cur = next;
    }
    if (cur.s < best.s) best = cur;
  }
  return best.rects;
};
