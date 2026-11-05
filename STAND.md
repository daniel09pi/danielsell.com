# danielsell.com v5 — Arbeitsstand und Übergabe

Stand: 5. November 2026, gepusht auf `origin/master`. Live ist noch **v4**; v5 ist nur lokal und auf GitHub (siehe „Deploy“).
Diese Datei beschreibt nur, was **jetzt** auf der Seite ist und was als Nächstes kommt. Den Verlauf aller Feedbackrunden, verworfene Wege und Begründungen enthält `STAND-ARCHIV.md`. Auftrag, Regeln und Phasen stehen in `REDESIGN-PLAN.md`.

## Für den neuen Chat

> Lies `danielsell.com/STAND.md` und `danielsell.com/REDESIGN-PLAN.md`. Wir arbeiten an der **Desktop-Startseite** weiter (Mobile vorerst ignorieren). Danach Phase 2.

Arbeitsweise:
- Daniel gibt Feedback auf Deutsch, Antworten auf Deutsch.
- Bei Gestaltungsfragen mit mehreren Wegen: **Quiz mit Multiple Choice** (AskUserQuestion, gern mit ASCII-Vorschau), statt zu raten.
- Nach jeder Änderung: bauen, Screenshots ansehen (siehe „Prüfen“), committen und pushen. Daniel bekommt die Screenshot-Pfade.
- Gestaltung muss Sinn ergeben: keine Deko ohne Bedeutung, keine Buttons, wo ein Textlink reicht, Hover nur über Farbe/Unterstreichung (keine Verschiebungen).

## Regeln aus dem Plan

- `archive/` und `C:\everything\portfolio\backups\` nicht verändern (neue Archivordner anlegen ist in Ordnung); nichts aus V1 / `other-design-XD` verwenden.
- Nie etwas Geheimes ins Repo. `deploy.env` nicht verändern oder kopieren. Den alten Telegram-Token nirgends wieder einfügen.
- Kein Force-Push auf `master`. Kein Tracking, keine Cookies, keine Fremd-Einbindungen, keine Google Fonts.
- Wird etwas von der Rechteprüfung abgelehnt (z. B. Deploy): nicht umgehen, sondern Daniel melden.

## Stack und Befehle

- **Astro 7.3.8** (fest; 7.4+ bräuchte Node ≥ 22.23, installiert ist 22.14). Ausgabe in `dist/`, **wird mitcommittet**: Der Server liefert das Git-Arbeitsverzeichnis aus, die Root-`.htaccess` leitet alles intern nach `dist/` und sperrt Quellen, Dotfiles, `.md`, `.mjs` usw.
- Schrift: `@fontsource-variable/archivo` (selbst gehostet). Bilder: eigene Pipeline `scripts/images.mjs` (sharp; 640/1280/2000 px, AVIF + WebP, Fingerabdruck im Namen, Manifest `src/generated/media.json`).
- `npm run build`: Bilder + Astro-Build.
- `npm run release`: Build + `scripts/check-dist.mjs` (Seiten vollständig, nichts Verbotenes, keine toten Links). Links auf noch fehlende Seiten (`/projects/…`, `/about/`, `/creative/` …) meldet es nur als Hinweis.
- `node scripts/make-icons.mjs`: Favicon-PNGs und `og.png` neu erzeugen (nach Änderungen an `public/favicon.svg`, Logo oder Name).
- Vorschau: `npx astro preview --port 4321 --host 127.0.0.1` → http://127.0.0.1:4321/

## Prüfen

- **Screenshots mit Klicks/Hover:** `node scripts/shot.mjs .shots 1440 900 name='<js>' …` (Vorschau muss laufen; Hilfe im Kopf der Datei; `.shots/` ist nicht im Repo). Gibt das JS `JSON.stringify({x, y})` zurück, fährt die Maus dorthin.
- Eigene Prüfskripte per DevTools-Protokoll: vor dem Messen `document.documentElement.style.scrollBehavior = "auto"` setzen (`html` hat `scroll-behavior: smooth`).
- Arbeitsnotizen: `scripts/notes.md` (per `.gitignore` nur lokal).
- Shell-Hinweis: In Heredocs der Bash-Umgebung gehen Backslashes verloren (`\a`, `\v` …). Skripte mit Windows-Pfaden als Datei ins Scratchpad schreiben und von dort ausführen.

## Deploy (offen)

Der Aufruf `bash C:/everything/portfolio/tools/deploy.sh` wurde von der automatischen Rechteprüfung abgelehnt („Production Deploy“). **Daniel startet ihn selbst:** `! bash C:/everything/portfolio/tools/deploy.sh`.
Bis dahin ist live v4, und **`/.git/config` ist öffentlich erreichbar** (die neue `.htaccess` sperrt das erst nach dem Deploy).
Nach dem Deploy: `bash scripts/livecheck.sh` (erwartete Statuscodes, u. a. `.git/config`, `REDESIGN-PLAN.md`, `send.php` → 404; Seiten → 200). Bei 500ern: `git revert` + push + erneut deployen. Danach Screenshots der Live-Seite (`URL=https://danielsell.com/ node scripts/shot.mjs …`).

## Die Startseite jetzt (von oben nach unten)

**Navigation** (`src/layouts/Base.astro`): links das Logo (lose, Ink, Linienstärke 44, 30 px hoch), rechts `work`, `about`, `contact` (zurzeit Anker auf der Startseite). Das Logo steht **nicht** im Hero.

**Hero** (`index.astro`, CSS-Abschnitt „Hero“): drei gleich breite Farbspalten creative (Limette) / adventure (Ink) / dev (Violett). Darüber riesig `daniel sell`, ganz in Beige (ausgespart). Grundlinie des Namens = Unterkante der Flächen (`text-box: trim-end cap alphabetic`), darunter eine feine Linie `#A98DFF`. Unter der Kante pro Spalte das Wort (Anker zum Projektbereich) und die Titel aller Projekte des Bereichs (Links auf `/projects/<slug>/`). Kein Erklärsatz, kein Button.

**Laufband im Hero** (seit 6. November 2026 auf der Startseite; Skript `src/scripts/band.ts`, Bilder `src/lib/band.js`, CSS-Abschnitt „Laufband im Hero“ in `global.css`): Ein Band aus Projektbildern läuft endlos quer über die Felder (64 px/s nach rechts, zwei Reihen, Bild 160 px 4:5, Abstand 5 px, Band −9°, Mitte bei 33 % der Höhe des Farbfelds; alle Werte in `CONFIG` oben in `band.ts`, Daniel ändert sie selbst). Über jedem Feld Bilder des jeweiligen Bereichs, an den Feldkanten ist eine Kachel geteilt.
- Technik: drei deckungsgleiche Ebenen (eine pro Bereich), je per `overflow: clip` auf ihre Spalte zugeschnitten, innen bühnenbreit versetzt; gleiche Web Animation (nur `transform`, alle auf dieselbe Zeit). Bühne hat `overflow: clip` (nicht `hidden`), sonst ginge sticky nicht.
- Beim Scrollen bleibt das Band per `position: sticky` stehen und verschwindet hinter Name und Grund; die Bilder werden dabei schwächer (Deckkraft 1 − t², 0 erst, wenn das Band ganz weg ist).
- Schwarzweiß; farbig nur die Spalte, über deren Farbfeld die Maus ist (unter der Linie alles schwarzweiß). Bilder und Name reagieren sonst nicht auf die Maus (Name nicht markierbar).
- Laden: jede Kachel zeigt zuerst die Hauptfarbe ihres Fotos (sharp `stats().dominant` aus der 640-px-Fassung beim Build), das Foto blendet darüber ein. `CONFIG.simulateLoading` (z. B. `[600, 4000]`) simuliert lokal langsames Laden, steht auf `null`.
- Ladeanimation einmal pro Besuch (`sessionStorage['ds-intro']`, `?intro` erzwingt, nicht bei reduzierter Bewegung, ohne JS nie), ca. 1,2 s, alles aus der Linie: Linie zeichnet sich, Felder wachsen hoch, Name steigt auf, Kacheln wachsen von links nach rechts auf, Band läuft aus dem Stand an, Register blendet ein.
- Steuerung mittig in der Navigation (Slot `nav-center` in `Base.astro`, absolut zentriert, 80 % der mittleren Spalte, ab 60rem abwärts ausgeblendet, ohne JS verborgen): Start/Stopp (weich), Positionsleiste (läuft per eigener Web Animation mit; ziehen/klicken/Pfeiltasten), Farb-Knopf (alle Bilder farbig).
- Sparsam: Ist der Hero nicht zu sehen (IntersectionObserver) oder der Tab im Hintergrund, sind alle Animationen pausiert und das Band ist `hidden` (nichts zu zeichnen); Scroll- und Maus-Handler rechnen dann nicht. Bei reduzierter Bewegung startet das Band angehalten.
- Weiches Scrollen mit **Lenis 1.3.26** (npm, gepinnt, im Bundle) auf der Startseite, ohne Dauer-Loop: Eingabe (Rad, Klick, Taste, Touch) startet die Schleife, sie endet, wenn Lenis zur Ruhe kommt (eigene lückenlose Uhr gegen Zeitsprünge). Bei reduzierter Bewegung aus.
- Ohne JavaScript: Hero wie vorher (Felder, Name, Register), kein Band, keine Steuerung.

**About** (`#about`): Selfie mit Lama (leicht gedreht, ±0,4–0,7°, Hover dreht zurück und sättigt; das einzige gedrehte Bild), Bildunterschrift, „hi, i’m daniel.“ als Link auf `/about/`, Einleitung, Eckdaten (`about.facts`).

**Currently working on/at**: links „Updated …“, rechts eine Liste mit feinen Linien (`--line`). Pro Zeile links der Name als externer Link (↗, neuer Tab), darunter klein die Rolle, rechts was es ist. Vor der Rolle ein Quadrat in den Farben der Bereiche, zu denen sie gehört (aus `{creative: …}`/`{dev: …}` in `role`; bei zwei Bereichen links/rechts geteilt), ohne Rand. Ohne markierten Bereich kein Quadrat (Pomfort).

**Projekte** (`src/components/Areas.astro`, ein Projekt: `FeatProject.astro`):
- Oben drei Farbfelder (Tab-Leiste): Wort groß, darunter leise „5 projects, 2024–2026, 35 images“ (aus `projects.json` berechnet, gedämpft so weit WCAG AA erlaubt; bei dev voll) und der Textlink „Explore creative →“ (`areas.<bereich>.cta`) zur Seite des Bereichs (`/creative/` …, Phase 2).
- Darunter auf Beige pro Spalte zwei Projekte (`spotlight()` in `src/lib/content.js`): zuerst das angepinnte (`featured: true`, klein „pinned“ mit Nadel), dann das neueste (nach `updated`, sonst `posted`; klein „new“ mit Punkt). Je Projekt: Titel, Art + Datum („Brand Identity, updated 3 September 2026“; ohne Datum das Jahr), drei kleine Bilder (3:2), alles ein Link auf `/projects/<slug>/`.
- „Show all N projects ↓“ klappt die übrigen auf (neueste zuerst), „Show less ↑“ zu. Gibt es nichts aufzuklappen, fehlt der Knopf; ohne JavaScript auch.
- Feine senkrechte Linien zwischen den Spalten, waagerechte Abschlusslinie; Zeilen über alle Spalten auf gleicher Höhe (Subgrid).
- Zurzeit angepinnt: ALUKEKU, 1 year in Argentina, flowinsync. Neueste: Bookcovers, Argentina xSamu, danielsell.com.

**Zitat** (`quote`): kleines Label links („some recent thoughts:“), großer Absatz rechts; Begriffe in Bereichsfarben markiert, **nur Verzierung** (kein Link, kein Hover). Der Text ist zurzeit Daniels Platzhalter für einen Blog-/Artikelanfang.

**Kontakt/Footer** (`Closing.astro`): „Say hello“, E-Mail, Socials, Name und Ort; Links auf Impressum und Datenschutz.

**Weitere Seiten:** `impressum`, `datenschutz` (Inhalt aus `legal`, Adresse und Datenschutztext noch Platzhalter), `404`, `sitemap.xml`.

**Mobile:** vorerst ignorieren. Es gibt eine einfache Fassung (Bänder untereinander), nicht abgestimmt.

## Inhalte

- `content/site.json` und `content/projects.json` enthalten **nur Felder, die die Seite zeigt** (aufgeräumt am 5. November 2026). `_hinweis` in jeder Datei erklärt die Felder, `_beispiel` listet erfundene Werte.
- Entfernt und archiviert in `C:\everything\portfolio\archive\inhalte-vor-aufraeumen-2026-11-05\`: Projekttexte, Tags und Links (für die Projektseiten in Phase 2), `about.howItStarted`, `about.skills`, `about.offScreen`, `person.languages` (für `/about/`), Bild-Platzhalter bei pitrack und Werner Gehner.
- **Platzhalter nicht hervorheben.** Fehlende Inhalte sind erfundene Beispielwerte (in `_beispiel`). Rechtliches (Impressum-Adresse, Datenschutz) wird **nicht** erfunden und bleibt `[Platzhalter]`.
- Slugs passen nicht mehr überall zu den Titeln, die Daniel geändert hat: `iguazu` → „Argentina xSamu“, `mixer-dashboard` → „pitrack“, `argentinien` → „1 year in Argentina“. Die Slugs bestimmen die Adressen `/projects/<slug>/` und die Bildordner; vor Phase 2 mit Daniel klären, ob sie umbenannt werden.

## Farben, Schrift, Favicon

Ground `#F5F2EB`, Ink `#1E0B4A`, Ink-soft `#574A78`, Ink-deep `#12062E` (Text auf Violett, 4,9 : 1), Accent/Violett `#8A63FF`, Limette `#D4F25A`, Linie `#A98DFF`. Nur Archivo. Tokens am Anfang von `src/styles/global.css`.
Favicon (`public/favicon.svg`): nur das Logo-Zeichen in Violett `#8A63FF`, Linie 44, Grund transparent, Linien bis an den Rand; `apple-touch-icon.png` auf Beige. Icon-Links in `Base.astro` tragen `?v=5`; bei jeder Änderung hochzählen und `node scripts/make-icons.mjs` laufen lassen.

## Dateien

- `src/pages/index.astro` (Startseite), `impressum.astro`, `datenschutz.astro`, `404.astro`, `sitemap.xml.js`.
- `src/scripts/band.ts` (Laufband im Hero, Einstellungen in `CONFIG`), `src/lib/band.js` (Bilder und Hauptfarben fürs Band).
- `src/components/`: `Areas.astro`, `FeatProject.astro`, `Closing.astro`, `Img.astro`, `T.astro`, `Logo.astro`, `TextPage.astro`.
- `src/lib/content.js` (liest die JSON; `spotlight()`, `byNewest()`, `categoryHref()`, `projectHref()`, `parseMarks()` …), `src/lib/images.js` (Bildpfade → erzeugte Größen).
- `src/layouts/Base.astro` (Kopf, Navigation, Meta), `src/styles/global.css` (alle Styles in Abschnitten), `.htaccess`.
- **Übrig, nicht benutzt** (Phase 4 löschen oder für die Projektseiten wiederverwenden): `src/components/Feature.astro` (Slideshow; liest Felder, die es in `projects.json` nicht mehr gibt) und `src/lib/collage.js` (Bilderbox), samt CSS „Kapitel und Feature“ und „Slideshow“; die alte Hero-Testseite `src/pages/varianten/hero.astro` (`/varianten/hero/`, noindex, Runde 25, nie entschieden) und der Filter `!p.startsWith('varianten')` in `sitemap.xml.js`.

## Offen / nächste Schritte

1. **Laufband** ist auf der Startseite (siehe oben). Die Testseite `/varianten/laufband/` ist gelöscht (letzter Stand Commit `5bbb7d0`; dort auch der Verlauf aller ausprobierten Optionen: Panel, Kontur, Titel, Rahmen, eingefärbte Bilder, weiche Kanten, Skeleton-Glanz). Offen: Mobile-Fassung des Bands und der Steuerung; ob Lenis auf allen Seiten laufen soll (zurzeit nur Startseite).
2. **Hero aufpeppen (geparkt).** Zuletzt ausprobiert und von Daniel gemocht, aber geparkt: das **„Verlaufsspielchen“** (Felder verschwimmen nach oben mit Korn und Fasern in die Navigation, Linien „Ton der Fläche“, Hover-Kreis zeigt die Volltonflächen). Liegt mit README und Screenshots in `C:\everything\portfolio\archive\verlaufsspielchen-2026-11-05\` (im Repo Commit `31185dc`). Bei Übernahme: Skript als eigene Datei, Rückfall ohne JS, `prefers-reduced-motion` beachten.
3. Deploy durch Daniel, dann Live-Prüfung (siehe oben).
4. **Phase 2:** eigene Seite pro Bereich (`/creative/`, `/adventure/`, `/dev/`, schon verlinkt) und pro Projekt (`/projects/<slug>/`, schon verlinkt; dafür Texte, Tags, Links aus dem Archiv zurückholen, Daniel denkt an blogartige Texte); `/about/` (how it started, Eckdaten, Skills, off screen, ebenfalls aus dem Archiv); danach Navigation umstellen. Screenshots der dev-Projekte fehlen (flowinsync zeigt vorläufig Bilder anderer Projekte, pitrack und Werner Gehner haben keine). Mobile abstimmen.
5. **Phase 3:** Bewegung (wenig, sauber).
6. **Phase 4:** Aufräumen (v4-Reste `index.html`, `script.js`, `styles.css`, `send.php`, `.DS_Store`; unbenutzte Dateien oben), README auf Deutsch, Abschlussbericht.
