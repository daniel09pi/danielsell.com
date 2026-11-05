// Laufband im Hero der Startseite: ein Band aus Projektbildern läuft endlos quer über die drei Felder. Über jedem Feld
// zeigt jede Kachel ein Bild aus dessen Bereich; an den Feldkanten ist eine Kachel geteilt.
// Umsetzung: drei deckungsgleiche Ebenen (eine pro Bereich) mit identischer Geometrie und derselben Web Animation (nur
// transform), jede per overflow: clip auf ihre Spalte zugeschnitten (CSS „Laufband“ in global.css). Stehenbleiben beim
// Scrollen per position: sticky. Daten (Bilder, Hauptfarben) aus src/lib/band.js als JSON in #lb-data.
// Sparsam: Ist der Hero nicht zu sehen (weggescrollt, Tab im Hintergrund), steht das Band und ist ausgeblendet (keine
// Animation, nichts zu zeichnen). Weiches Scrollen (Lenis) rechnet nur, solange gescrollt wird.
// Ohne JavaScript bleibt der Hero wie vorher (Felder, Name, Register), die Steuerung bleibt verborgen.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// ---------- Einstellungen ----------
const CONFIG = {
  speed: 64,          // px pro Sekunde
  direction: 1,       // 1 = nach rechts, -1 = nach links
  height: 160,        // Höhe eines Bilds in px
  aspect: 4 / 5,      // Breite : Höhe
  gap: 5,             // Abstand zwischen den Bildern und den Reihen in px
  rows: 2,            // Reihen (laufen gleich)
  position: 0.33,     // Mitte des Bands in Anteilen der Höhe des Farbfelds
  tilt: -9,           // Neigung des ganzen Bands in Grad
  fadeOnScroll: true, // Bilder werden beim Runterscrollen schwächer
  smoothScroll: 0.1,  // Lenis lerp (kleiner = weicher), 0 = normales Scrollen
  controlsWidth: 0.8, // Breite der Steuerung in der Navigation, Anteil der mittleren Spalte
  // Nur zum Testen: lädt jedes Foto erst nach einer zufälligen Wartezeit (ms), z. B. [600, 4000]; sonst null
  simulateLoading: null as [number, number] | null,
};
// Ladeanimation (ms seit Seitenaufruf): Kacheln wachsen ab tiles über tilesSpread auf, Band läuft ab bandStart über
// bandRamp an, Klasse intro fällt bei end weg. Der Rest der Ladeanimation steht im CSS („Ladeanimation“).
const INTRO = { bandStart: 700, bandRamp: 900, tiles: 700, tilesSpread: 500, end: 2000 };

type Img = { srcset: string; src: string; color: string };
type Proj = { slug: string; imgs: Img[] };
const data = document.getElementById('lb-data');
const stage = document.getElementById('lb-stage');
const lb = document.getElementById('lb');
const ctrl = document.querySelector<HTMLElement>('.lbc');

if (data && stage && lb && ctrl) {
  const pools: Record<string, Proj[]> = JSON.parse(data.textContent || '{}');
  const CATS = ['creative', 'adventure', 'dev'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.documentElement.classList.contains('intro');
  const bar = document.getElementById('lbc-bar')!;
  const playBtn = document.getElementById('lbc-play')!;
  const colorBtn = document.getElementById('lbc-color')!;
  ctrl.hidden = false;

  // Projekte im Wechsel: erst je das erste Bild jedes Projekts, dann je das zweite …
  const sequence = (cat: string): Img[] => {
    const projs = pools[cat] ?? [];
    const out: Img[] = [];
    const max = Math.max(0, ...projs.map((p) => p.imgs.length));
    for (let n = 0; n < max; n++) for (const p of projs) if (p.imgs[n]) out.push(p.imgs[n]);
    return out;
  };

  let anims: Animation[] = [];
  let duration = 1;
  let playing = !reduce;  // Wunsch des Besuchers (Start/Stopp)
  let onScreen = true;    // Hero zu sehen und Tab im Vordergrund
  let rampDone = false;   // Anlaufen der Ladeanimation vorbei (oder abgebrochen)
  let rampId = 0;

  // ---------- Fotos laden: alle Kacheln mit derselben Datei gemeinsam; geladen = Foto blendet über die Farbe ----------
  const loaded = new Set<string>();
  function load(src: string, imgs: HTMLImageElement[]) {
    const go = () => imgs.forEach((img) => {
      img.srcset = img.dataset.srcset!;
      img.src = src;
      img.decode().catch(() => {}).then(() => { loaded.add(src); img.parentElement!.classList.add('is-loaded'); });
    });
    const sim = CONFIG.simulateLoading;
    if (sim && !loaded.has(src)) setTimeout(go, sim[0] + Math.random() * (sim[1] - sim[0])); else go();
  }

  // ---------- Band bauen ----------
  function build() {
    const keep = anims.length ? progress() : null; // Stand behalten, wenn neu gebaut wird (Fensterbreite)
    anims.forEach((a) => a.cancel());
    anims = [];
    lb!.textContent = '';
    const { height: h, gap: g } = CONFIG;
    const w = Math.round(h * CONFIG.aspect);
    const step = w + g;
    const stageW = stage!.clientWidth;
    let n = Math.max(2, Math.ceil((stageW * 1.5) / step));
    if (n % 2) n++;
    const loop = n * step;
    lb!.style.setProperty('--w', `${w}px`);
    lb!.style.setProperty('--h', `${h}px`);
    lb!.style.setProperty('--g', `${g}px`);
    lb!.style.setProperty('--tilt', `${CONFIG.tilt}deg`);
    duration = (loop / CONFIG.speed) * 1000;
    const frames = CONFIG.direction > 0
      ? [{ transform: `translateX(${-loop}px)` }, { transform: 'translateX(0)' }]
      : [{ transform: 'translateX(0)' }, { transform: `translateX(${-loop}px)` }];

    const reveal = intro && !rampDone; // Kacheln wachsen nur beim ersten Aufbau mit Ladeanimation auf
    const waiting = new Map<string, HTMLImageElement[]>();
    for (const cat of CATS) {
      const seq = sequence(cat);
      const layer = document.createElement('div');
      layer.className = 'lb__layer';
      layer.dataset.cat = cat;
      const pin = document.createElement('div');
      pin.className = 'lb__pin';
      const stick = document.createElement('div');
      stick.className = 'lb__stick';
      const band = document.createElement('div');
      band.className = 'lb__band';
      for (let r = 0; r < CONFIG.rows; r++) {
        const track = document.createElement('div');
        track.className = 'lb__track';
        for (let i = 0; i < n * 2; i++) {
          const tile = document.createElement('div');
          tile.className = 'lb__tile';
          const item = seq.length ? seq[((i % n) + r * 3) % seq.length] : null; // zweite Reihe beginnt mit anderen Bildern
          if (reveal) {
            // Startlage der Kachel in der Bühne (Band beginnt bei -loop, zweite Reihe eine halbe Kachel versetzt)
            const x = -0.25 * stageW + i * step - (CONFIG.direction > 0 ? loop : 0) + (r * step) / 2;
            const d = INTRO.tiles + Math.min(1, Math.max(0, x / stageW)) * INTRO.tilesSpread + r * 60;
            tile.style.setProperty('--d', `${Math.round(d)}ms`);
          }
          if (item) {
            tile.style.setProperty('--c', item.color);
            const img = document.createElement('img');
            img.alt = '';
            img.decoding = 'async';
            img.sizes = `${w}px`;
            img.dataset.srcset = item.srcset;
            tile.append(img);
            if (!waiting.has(item.src)) waiting.set(item.src, []);
            waiting.get(item.src)!.push(img);
          }
          track.append(tile);
        }
        band.append(track);
        const anim = track.animate(frames, { duration, iterations: Infinity, easing: 'linear' });
        (anim as any)._off = (r * duration * (step / 2)) / loop; // jede weitere Reihe eine halbe Kachel versetzt
        anims.push(anim);
      }
      stick.append(band);
      pin.append(stick);
      layer.append(pin);
      lb!.append(layer);
    }
    // Positionsleiste in der Navigation läuft mit: Füllung und Punkt, gleiche Dauer
    ctrl!.style.setProperty('--lbc-w', `${(stageW / 3) * CONFIG.controlsWidth}px`);
    const opts = { duration, iterations: Infinity, easing: 'linear' };
    const fill = document.getElementById('lbc-fill')!.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], opts);
    const knob = document.getElementById('lbc-knob')!.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${bar.clientWidth}px)` }], opts);
    (fill as any)._off = 0;
    (knob as any)._off = 0;
    anims.push(fill, knob);
    // Alle Ebenen auf exakt dieselbe Zeit (sonst stimmen die geteilten Kacheln nicht überein)
    const t0 = (anims[0].currentTime as number) ?? 0;
    for (const a of anims) a.currentTime = t0 + (a as any)._off;
    if (keep !== null) seek(keep);
    waiting.forEach((imgs, src) => load(src, imgs));
    if (!playing || !onScreen) anims.forEach((a) => a.pause());
    else if (intro && !rampDone) rampIn();
    place();
  }

  // ---------- Tempo ----------
  // Ladeanimation: das Band steht zuerst und läuft dann wie eine Maschine an (0 → volles Tempo, weich)
  function rampIn() {
    anims.forEach((a) => { a.playbackRate = 0; });
    const tick = () => {
      if (rampDone) return; // inzwischen angehalten, verschoben oder weggescrollt
      const t = Math.min(1, Math.max(0, (performance.now() - INTRO.bandStart) / INTRO.bandRamp));
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      anims.forEach((a) => { a.playbackRate = e; });
      if (t < 1) requestAnimationFrame(tick); else rampDone = true;
    };
    requestAnimationFrame(tick);
  }
  if (intro) setTimeout(() => document.documentElement.classList.remove('intro'), Math.max(0, INTRO.end - performance.now()));

  // Weich auf ein Tempo (Faktor 0…1) bremsen oder anfahren; nur während des Übergangs ein paar Frames
  function rampTo(target: number, ms: number, done?: () => void) {
    cancelAnimationFrame(rampId);
    const from = anims[0]?.playbackRate ?? 1, start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const r = from + (target - from) * (1 - Math.pow(1 - t, 3));
      anims.forEach((a) => { a.playbackRate = r; });
      if (t < 1) rampId = requestAnimationFrame(tick); else done?.();
    };
    rampId = requestAnimationFrame(tick);
  }

  // ---------- Steuerung: Start/Stopp, Position, Farbe ----------
  // Stand 0…1 innerhalb einer Runde (an der ersten Reihe gemessen)
  function progress() {
    const t = (anims[0]?.currentTime as number) ?? 0;
    return (((t / duration) % 1) + 1) % 1;
  }
  // Alle Ebenen, Reihen und die Leiste gemeinsam auf einen Stand setzen
  function seek(p: number) {
    const base = Math.floor(((anims[0]?.currentTime as number) ?? 0) / duration) * duration + p * duration;
    for (const a of anims) a.currentTime = base + (a as any)._off;
    bar.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }
  function setPlaying(on: boolean) {
    playing = on;
    rampDone = true;
    ctrl!.classList.toggle('is-paused', !on);
    playBtn.setAttribute('aria-label', on ? 'Pause the image band' : 'Play the image band');
    if (!onScreen) return; // läuft beim nächsten Sichtbarwerden an (oder nicht)
    if (on) {
      anims.forEach((a) => { a.playbackRate = 0; a.play(); });
      rampTo(1, 500);
    } else {
      rampTo(0, 400, () => { if (!playing) anims.forEach((a) => a.pause()); });
    }
  }
  playBtn.addEventListener('click', () => setPlaying(!playing));
  ctrl.classList.toggle('is-paused', !playing);
  if (!playing) playBtn.setAttribute('aria-label', 'Play the image band');

  // Position: ziehen oder klicken (läuft es, hält es dabei an und läuft danach weiter), Pfeiltasten
  let dragging = false, resume = false;
  const pAt = (x: number) => { const r = bar.getBoundingClientRect(); return Math.min(0.9999, Math.max(0, (x - r.left) / r.width)); };
  bar.addEventListener('pointerdown', (e) => {
    dragging = true;
    resume = playing;
    rampDone = true;
    bar.setPointerCapture(e.pointerId);
    ctrl.classList.add('is-dragging');
    cancelAnimationFrame(rampId);
    anims.forEach((a) => { a.playbackRate = 1; a.pause(); });
    seek(pAt(e.clientX));
  });
  bar.addEventListener('pointermove', (e) => { if (dragging) seek(pAt(e.clientX)); });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    ctrl.classList.remove('is-dragging');
    if (resume && onScreen) { anims.forEach((a) => { a.playbackRate = 0; a.play(); }); rampTo(1, 500); }
  };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 0.02 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -0.02 : 0;
    if (!d) return;
    e.preventDefault();
    seek((progress() + d + 1) % 1);
  });

  // Farbe: alle Bilder ohne Schwarzweiß
  colorBtn.addEventListener('click', () => {
    const on = colorBtn.getAttribute('aria-pressed') !== 'true';
    colorBtn.setAttribute('aria-pressed', String(on));
    colorBtn.setAttribute('aria-label', on ? 'Show images in black and white' : 'Show images in colour');
    lb.classList.toggle('lb--color', on);
  });

  // ---------- Nicht zu sehen = nichts rechnen ----------
  // Hero weggescrollt oder Tab im Hintergrund: Band anhalten und ausblenden (display: none, der Browser zeichnet und
  // hält dann nichts davon). Wieder zu sehen: einblenden und, wenn gewünscht, weiterlaufen lassen.
  let stageVisible = true;
  function updateOnScreen() {
    const now = stageVisible && !document.hidden;
    if (now === onScreen) return;
    onScreen = now;
    if (!now) {
      cancelAnimationFrame(rampId);
      rampDone = true;
      anims.forEach((a) => a.pause());
      lb!.hidden = true;
    } else {
      lb!.hidden = false;
      if (playing && !dragging) anims.forEach((a) => { a.playbackRate = 1; a.play(); });
      fade();
    }
  }
  new IntersectionObserver(([e]) => { stageVisible = e.isIntersecting; updateOnScreen(); }).observe(stage);
  document.addEventListener('visibilitychange', updateOnScreen);

  // ---------- Lage, Stehenbleiben, Ausblenden ----------
  function place() {
    const top = stage!.getBoundingClientRect().top + scrollY;
    const y = stage!.offsetHeight * CONFIG.position;
    lb!.style.setProperty('--y', `${y}px`);
    lb!.style.setProperty('--stick-top', `${top + y}px`);
    lb!.style.setProperty('--pin-end', `${Math.round(top + stage!.offsetHeight)}px`);
    fade();
  }
  // Deckkraft nach 1 − t²: anfangs kaum, gegen Ende schneller; 0 erst, wenn das gekippte Band ganz hinter der
  // Unterkante der Bühne verschwunden ist. Direkt auf den drei .lb__pin, damit nicht alle Kacheln neu rechnen.
  function fade() {
    if (!CONFIG.fadeOnScroll || !onScreen) return;
    const stickTop = parseFloat(lb!.style.getPropertyValue('--stick-top')) || 0;
    const r = stage!.getBoundingClientRect();
    const band = lb!.querySelector<HTMLElement>('.lb__band');
    const a = (Math.abs(CONFIG.tilt) * Math.PI) / 180;
    const half = band ? (band.offsetHeight * Math.cos(a) + r.width * Math.sin(a)) / 2 : 0;
    const range = r.bottom + scrollY - stickTop + half;
    const t = Math.min(1, Math.max(0, scrollY / Math.max(1, range)));
    const o = String(Math.round((1 - t * t) * 1000) / 1000);
    lb!.querySelectorAll<HTMLElement>('.lb__pin').forEach((p) => { p.style.opacity = o; });
  }

  // ---------- Farbe unter der Maus ----------
  // Nur über den Feldern (bis zur Linie unter dem Namen), nach x-Position (Drittel); sonst alles schwarzweiß.
  const setCol = (c: string | null) => { if (c) lb.dataset.col = c; else delete lb.dataset.col; };
  let px = -1, py = -1;
  function checkCol() {
    const r = stage!.getBoundingClientRect();
    const inside = px >= r.left && px < r.right && py >= r.top && py < r.bottom;
    setCol(inside ? CATS[Math.min(2, Math.floor(((px - r.left) / r.width) * 3))] : null);
  }
  addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (onScreen) checkCol(); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { px = py = -1; checkCol(); });

  // Beim Scrollen höchstens einmal pro Frame, und nur solange der Hero zu sehen ist
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf || !onScreen) return;
    raf = requestAnimationFrame(() => { raf = 0; fade(); if (px >= 0) checkCol(); });
  }, { passive: true });

  let rz = 0;
  let lastW = stage.clientWidth;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = window.setTimeout(() => { if (stage.clientWidth !== lastW) { lastW = stage.clientWidth; build(); } else place(); }, 200);
  });
  build();
}

// ---------- Weiches Scrollen (Lenis, im Bundle) ----------
// Kein Dauer-Loop: Lenis rechnet nur, solange es etwas zu scrollen gibt. Eine Eingabe (Rad, Klick auf einen Anker …)
// startet die Schleife, sie endet, sobald Lenis zur Ruhe gekommen ist. Lenis bekommt eine eigene, lückenlose Uhr, damit
// nach einer Pause kein großer Zeitsprung entsteht.
if (CONFIG.smoothScroll > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ autoRaf: false, lerp: CONFIG.smoothScroll, anchors: true });
  let id = 0, clock = 0, last = 0, kicked = 0;
  const loop = (now: number) => {
    clock += Math.min(now - last, 34);
    last = now;
    lenis.raf(clock);
    id = lenis.isScrolling || now - kicked < 120 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => {
    kicked = performance.now();
    if (id) return;
    last = kicked;
    id = requestAnimationFrame(loop);
  };
  for (const t of ['wheel', 'click', 'keydown', 'touchstart']) addEventListener(t, kick, { passive: true });
}
