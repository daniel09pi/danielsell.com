// Bilderbox: alle Bilder eines Projekts in einem Rechteck (Startseite, State 2 der Bereiche). Zwei klar
// getrennte Zustände (Daniel, Runde 9):
// - Allgemein (gridLayout): alle Bilder gleich groß (gleiche Fläche, eigenes Format, kein Zuschnitt) und eher
//   klein, in Reihen über die Box verteilt; die äußeren liegen an den Kanten, dazwischen bleibt Luft.
// - Fokus (focusLayout): ein Bild sehr groß oben links, die anderen sehr klein als Reihe darunter oder als
//   Spalte daneben, je nachdem, wo das große Bild größer wird. Lücken sind erlaubt.
// Zufall mit festem Startwert pro Projekt: gleiche Box, gleiches Bild.

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
// Breite und Höhe eines Bildes mit Seitenverhältnis q und Fläche A
const sized = (q, A) => ({ w: Math.sqrt(A * q), h: Math.sqrt(A / q) });

/** Allgemein. ratio: Seitenverhältnisse (Breite/Höhe), W × H: Box, g: Abstand, fill: Größe relativ zum Maximum.
 *  Reihen mit gleich großen Bildern (gleiche Fläche); in jeder Reihe das erste Bild an der linken, das letzte an
 *  der rechten Kante, dazwischen gleichmäßig verteilt. Die Reihen verteilen sich über die Höhe (erste oben,
 *  letzte unten). Die Zahl der Bilder pro Reihe wechselt, darum stehen die Bilder nicht in Spalten übereinander. */
export const gridLayout = (ratio, W, H, g, seed, fill = 0.86) => {
  const n = ratio.length, r = rng(seed), gap = 2 * g;
  const sq = ratio.map(Math.sqrt);   // Breite = s · √q, Höhe = s / √q (s = Wurzel der Fläche)
  const split = (counts) => { let i = 0; return counts.map((k) => { const row = [...Array(k).keys()].map((j) => i + j); i += k; return row; }); };
  // größtes s, bei dem jede Reihe in die Breite und alle Reihen in die Höhe passen
  const fit = (rows) => {
    let sx = Infinity, sumH = 0;
    for (const row of rows) {
      sx = Math.min(sx, (W - (row.length - 1) * gap) / row.reduce((t, i) => t + sq[i], 0));
      sumH += Math.max(...row.map((i) => 1 / sq[i]));
    }
    return Math.min(sx, (H - (rows.length - 1) * gap) / sumH);
  };
  const options = [];
  for (let R = 1; R <= n; R++) {
    for (let t = 0; t < 24; t++) {
      const counts = Array(R).fill(Math.floor(n / R));
      shuffle([...Array(R).keys()], r).slice(0, n % R).forEach((j) => counts[j]++);
      // etwas Abwechslung: ein Bild wandert in eine andere Reihe
      const x = Math.floor(r() * R), y = Math.floor(r() * R);
      if (t > 0 && x !== y && counts[x] > 2) { counts[x]--; counts[y]++; }
      if (n >= 4 && counts.some((k) => k < 2)) continue;
      const rows = split(counts);
      options.push({ rows, s: fit(rows) });
    }
  }
  const top = Math.max(...options.map((o) => o.s));
  const good = options.filter((o) => o.s >= top * 0.94);
  const { rows } = good[Math.floor(r() * good.length)];
  const side = top * fill;
  const pick = () => [0, 0.5, 1][Math.floor(r() * 3)];
  const rowH = rows.map((row) => Math.max(...row.map((i) => side / sq[i])));
  const gy = rows.length > 1 ? (H - rowH.reduce((t, h) => t + h, 0)) / (rows.length - 1) : 0;
  const out = [];
  let y = 0;
  rows.forEach((row, ri) => {
    const ws = row.map((i) => side * sq[i]);
    const gx = row.length > 1 ? (W - ws.reduce((t, w) => t + w, 0)) / (row.length - 1) : 0;
    // senkrecht in der Reihe: erste oben, letzte unten, dazwischen je Reihe oben, mittig oder unten
    const ay = ri === 0 ? 0 : ri === rows.length - 1 ? 1 : pick();
    let x = row.length > 1 ? 0 : (W - ws[0]) * pick();
    row.forEach((i, j) => {
      const h = side / sq[i];
      out[i] = { x, y: y + (rowH[ri] - h) * ay, w: ws[j], h };
      x += ws[j] + gx;
    });
    y += rowH[ri] + gy;
  });
  return out;
};

/** Fokus: Bild `focus` sehr groß, die anderen sehr klein (Kantenlänge etwa k · √(W·H)). */
export const focusLayout = (ratio, W, H, g, focus, k = 0.11) => {
  const n = ratio.length;
  const others = [...Array(n).keys()].filter((i) => i !== focus);
  const q = ratio[focus];
  if (!others.length) { const w = Math.min(W, H * q); return [{ x: 0, y: 0, w, h: w / q }]; }
  for (let kk = k; kk > 0.03; kk *= 0.85) {
    const A = kk * kk * W * H;
    const small = ratio.map((x) => sized(x, A));
    // Kleine Bilder in Linien packen: entlang x (Reihen unter dem großen Bild) oder y (Spalten daneben)
    const pack = (along, room) => {
      const lines = [];
      let line = [], len = 0;
      for (const i of others) {
        const l = along === 'x' ? small[i].w : small[i].h;
        if (line.length && len + g + l > room) { lines.push(line); line = []; len = 0; }
        len += (line.length ? g : 0) + l;
        line.push(i);
      }
      if (line.length) lines.push(line);
      const thick = lines.map((L) => Math.max(...L.map((i) => (along === 'x' ? small[i].h : small[i].w))));
      return { lines, thick, T: thick.reduce((a, b) => a + b, 0) + (lines.length - 1) * g };
    };
    const configs = [];
    const below = pack('x', W);
    { const room = H - below.T - g; const w = Math.min(W, room * q); configs.push({ side: 'below', ...below, w, h: w / q }); }
    const beside = pack('y', H);
    { const room = W - beside.T - g; const w = Math.min(room, H * q); configs.push({ side: 'beside', ...beside, w, h: w / q }); }
    const ok = configs.filter((c) => c.w > 0 && c.h > 0);
    if (!ok.length) continue;
    const c = ok.reduce((a, b) => (b.w * b.h > a.w * a.h * 1.02 ? b : a));
    const out = [];
    out[focus] = { x: 0, y: 0, w: c.w, h: c.h };
    if (c.side === 'below') {
      let y = c.h + g;
      c.lines.forEach((L, li) => {
        let x = 0;
        for (const i of L) { out[i] = { x, y, ...small[i] }; x += small[i].w + g; }
        y += c.thick[li] + g;
      });
    } else {
      let x = c.w + g;
      c.lines.forEach((L, li) => {
        let y = 0;
        for (const i of L) { out[i] = { x, y, ...small[i] }; y += small[i].h + g; }
        x += c.thick[li] + g;
      });
    }
    return out;
  }
  return gridLayout(ratio, W, H, g, 0);
};
