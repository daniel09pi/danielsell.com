// Bilder eines Projekts in Reihen gleicher Höhe über die volle Breite, ungeschnitten (Projektseite).
// Die Aufteilung entsteht beim Build aus den Seitenverhältnissen (Breite / Höhe): Jede Reihe soll etwa `target` hoch
// sein (Anteil der Breite), höchstens `maxPerRow` Bilder. Gesucht wird die Aufteilung mit der kleinsten Abweichung
// über alle Reihen; zu hohe Reihen zählen stärker als zu niedrige (sie würden höher als der Bildschirm).
// Die letzte Reihe wird nicht gestreckt, wenn sie dadurch viel zu hoch würde (z. B. ein einzelnes Bild): Sie bleibt
// `target` hoch, rechts bleibt Platz frei (`fill`). Im CSS wächst jedes Bild mit seinem Seitenverhältnis (flex-grow),
// dadurch sind alle Bilder einer Reihe gleich hoch.

export function rows(ratios, { target = 0.36, maxPerRow = 4 } = {}) {
  const n = ratios.length;
  if (!n) return [];
  const sum = (i, j) => ratios.slice(i, j).reduce((a, b) => a + b, 0);
  const capped = (s) => 1 / s > target * 1.5;          // letzte Reihe: würde sie zu hoch?
  const cost = (i, j) => {
    const s = sum(i, j);
    if (j === n && capped(s)) return 0.25 * (1 - s * target);   // Anteil des freien Platzes
    const d = Math.log(1 / s / target);
    return d > 0 ? 3 * d * d : d * d;
  };
  const best = new Array(n + 1).fill(Infinity);
  const from = new Array(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = Math.max(0, j - maxPerRow); i < j; i++) {
      const c = best[i] + cost(i, j);
      if (c < best[j]) { best[j] = c; from[j] = i; }
    }
  }
  const spans = [];
  for (let j = n; j > 0; j = from[j]) spans.unshift([from[j], j]);
  return spans.map(([i, j]) => {
    const s = sum(i, j);
    const fill = j === n && capped(s) ? 1 / target - s : 0;
    return { items: ratios.slice(i, j).map((ratio, k) => ({ index: i + k, ratio })), sum: s, fill };
  });
}
