# danielsell.com v5 — Arbeitsstand und Übergabe

Stand: 4. November 2026, nach Runde 13 (Projekte: Kennzahlen im Farbfeld, „Pinned“ mit Nadel, Abschlusslinie), gepusht auf `origin/master`.
Diese Datei ist die Übergabe für einen neuen Chat. Sie ergänzt `REDESIGN-PLAN.md` (Auftrag, Regeln, Phasen) um alles, was seitdem entschieden wurde.
Live ist noch **v4**; der v5-Stand ist nur lokal und auf GitHub (siehe „Deploy“).

## Für den neuen Chat

> Lies `danielsell.com/STAND.md` und `danielsell.com/REDESIGN-PLAN.md`. Wir arbeiten an der **Desktop-Startseite** weiter (Mobile vorerst ignorieren). Danach Phase 2.

Arbeitsweise, die sich bewährt hat:
- Daniel gibt Feedback auf Deutsch, Antworten auf Deutsch.
- Bei Gestaltungsfragen mit mehreren Wegen: **Quiz mit Multiple Choice** (AskUserQuestion, gern mit ASCII-Vorschau), statt zu raten.
- Nach jeder Änderung: bauen, Screenshots ansehen (siehe „Prüfen“), dann committen und pushen. Daniel bekommt die Screenshot-Pfade.

## Regeln aus dem Plan, die weiter gelten

- `archive/` und `C:\everything\portfolio\backups\` nicht anfassen; nichts aus V1 / `other-design-XD` verwenden.
- Nie etwas Geheimes ins Repo. `deploy.env` nicht verändern oder kopieren. Den alten Telegram-Token nirgends wieder einfügen.
- Kein Force-Push auf `master`. Kein Tracking, keine Cookies, keine Fremd-Einbindungen, keine Google Fonts.
- Wird etwas von der Rechteprüfung abgelehnt (z. B. Deploy): nicht umgehen, sondern Daniel melden.

## Stack und Befehle

- **Astro 7.3.8** (fest; 7.4+ bräuchte Node ≥ 22.23, installiert ist 22.14). Ausgabe in `dist/`, **wird mitcommittet**: Der Server liefert das Git-Arbeitsverzeichnis aus, die Root-`.htaccess` leitet alles intern nach `dist/` und sperrt Quellen, Dotfiles, `.md`, `.mjs` usw.
- Schrift: `@fontsource-variable/archivo` (selbst gehostet). Bilder: eigene Pipeline `scripts/images.mjs` (sharp; 640/1280/2000 px, AVIF + WebP, Fingerabdruck im Namen, Manifest `src/generated/media.json`).
- `npm run build` — Bilder + Astro-Build.
- `npm run release` — Build + `scripts/check-dist.mjs` (Seiten vollständig, nichts Verbotenes, keine toten Links). Links auf noch fehlende Seiten (`/projects/…`, `/about/`) meldet es nur als Hinweis.
- `node scripts/make-icons.mjs` — Favicon-PNGs und `og.png` neu erzeugen (nach Änderungen an `public/favicon.svg`, Logo oder Name).
- Vorschau: `npx astro preview --port 4321 --host 127.0.0.1` → http://127.0.0.1:4321/

## Prüfen

- **Screenshots mit Klicks/Hover:** `node scripts/shot.mjs .shots 1440 900 name='<js>' …` (Vorschau muss laufen; Hilfe im Kopf der Datei; `.shots/` ist nicht im Repo). Normale Headless-Screenshots mit `--virtual-time-budget` zeigen nach einem Klick nachgeladene Bilder nicht; deshalb dieses Skript.
- Eigene Prüfskripte per DevTools-Protokoll: vor dem Messen `document.documentElement.style.scrollBehavior = "auto"` setzen (`html` hat `scroll-behavior: smooth`, sonst misst man mitten im Scrollen).
- Arbeitsnotizen (Inventar, Richtung, alle Feedbackrunden): `scripts/notes.md` (per `.gitignore` nicht im Repo, nur lokal).

## Deploy (offen)

Der Aufruf `bash C:/everything/portfolio/tools/deploy.sh` wurde von der automatischen Rechteprüfung abgelehnt („Production Deploy“). **Daniel startet ihn selbst:** `! bash C:/everything/portfolio/tools/deploy.sh`.
Bis dahin ist live v4, und **`/.git/config` ist öffentlich erreichbar** (die neue `.htaccess` sperrt das erst nach dem Deploy).
Nach dem Deploy: `bash scripts/livecheck.sh` (erwartete Statuscodes, u. a. `.git/config`, `REDESIGN-PLAN.md`, `send.php` → 404; Seiten → 200). Bei 500ern: `git revert` + push + erneut deployen. Danach Screenshots der Live-Seite ansehen (`URL=https://danielsell.com/ node scripts/shot.mjs …`).

## Was entschieden ist (Daniels Feedback, in Reihenfolge)

1. **Logo im Hero abgelehnt** („design muss sinn machen“). Das Logo steht nur in der Navigation (lose, Ink), im Favicon und im Teilen-Bild.
2. **Hero:** drei Farbspalten creative (Limette) / adventure (Ink) / dev (Violett). Der Name `daniel sell` läuft riesig darüber, **ganz in Beige** (ausgespart wie das Logo-Negativ; Farbsplit im Namen abgelehnt). Grundlinie des Namens = Unterkante der Flächen (`text-box: trim-end cap alphabetic`), darunter eine **feine Linie** `#A98DFF`. Unter der Kante pro Spalte das Wort (Link zur Projektspalte) und die Projekttitel (Links auf `/projects/<slug>/`). Kein Erklärsatz, kein Button (abgelehnt als generisch).
3. **Flächenfarben pro Kategorie:** gefallen.
4. **Bilder** nur subtil schief: ±0,4–0,7°, Hover dreht ca. 1° zurück und sättigt. **Seit Runde 7 nur noch beim About-Selfie;** Projektbilder stehen gerade.
5. **Reihenfolge der Startseite:** Hero → About („hi, i’m daniel.“ verlinkt auf `/about/`) → Currently working on → Projekte → in short → Kontakt/Footer.
6. **Projekte** (`src/components/Areas.astro`), Stand Runde 13. Statisch, **kein JavaScript, kein Aufklappen** (Runde 11, Daniel: „die Leute sollen die drei Bilder sehen und wenn es sie interessiert auf das Projekt klicken“). Runde 12: Runde 11 war ihm „unübersichtlich und voll“, das Etikett „Featured projects“ „komisch“; per Quiz entschieden: Etikett weg, nur die Tab-Leiste farbig, mehr Abstand, klare Hierarchie und Hilfslinien. Wichtig für ihn: **Zugehörigkeit muss klar und logisch erkennbar bleiben.** Runde 13 (Quiz): Kennzahlen ins Farbfeld, „Pinned“ mit Nadel über jedem Projekt, feine Linie als Abschluss.
   - *Tab-Leiste:* drei gleich breite **Farbfelder** (creative Limette, adventure Ink, dev Violett) mit viel Luft; das ganze Feld ist ein **Link zur Seite des Bereichs** (über das Wort gespannt, `/creative/`, `/adventure/`, `/dev/`, `categoryHref()` in `src/lib/content.js`; Seiten kommen in Phase 2). Hover: Wort unterstrichen. Unter dem Wort **Kennzahlen** (Zahl über Bezeichnung, nebeneinander): Projekte, Jahre (Spanne aus `year`), Bilder, Wörter (alle `text` der Projekte des Bereichs; wächst mit, wenn Daniel später blogartig über die Projekte schreibt) werden aus `projects.json` berechnet; dazu eigene Zahlen pro Bereich in `site.json` → `areas.<bereich>.stats` (zurzeit 2 publishers, 4,000 m highest point, 2 live sites; Beispielwerte). Daniel will gern weitere „coole Zahlen“.
   - *Darunter auf Beige:* pro Spalte **zwei Featured Projects** (`featured: true` in `content/projects.json`, `featuredProjects()` in `src/lib/content.js`, höchstens zwei; ohne Markierung die ersten beiden). Je Projekt: Zeile **„Pinned“ mit kleiner Nadel** (wie angepinnte Chats bei WhatsApp, eigenes SVG, um 40° gedreht, Ink-soft), Titel (ca. 32 px), Art + Jahr (klein, Ink-soft), **drei kleine Bilder nebeneinander** (3:2, `object-fit: cover`, Breite `clamp(5.75rem, 7.4vw, 8.5rem)`, ca. 107 px bei 1440), leicht gedreht wie die Vorschau in v4; **Hover je Bild** (dreht in die Gegenrichtung, sättigt), Titel unterstrichen. **Titel, Art/Jahr und Bilder sind ein Link zur Projektseite** `/projects/<slug>/` (Phase 2).
   - *Am Fuß jeder Spalte:* **„All 5 projects →“** (Link zur Seite des Bereichs; bei einem Projekt „1 project →“). Zwei gezeigt, dahinter alle; das ersetzt das Etikett.
   - *Zugehörigkeit und Abschluss:* feine **senkrechte Linien** (`--line`, 1 px) zwischen den Spalten setzen die Kanten der Tabs nach unten fort, eine **waagerechte Linie** unter allen Spalten schließt den Abschnitt zum nächsten („in short“) ab; Titel, Bilder und Link stehen bündig mit dem Wort im Tab. Die Zeilen (Tab, Projekt 1, Projekt 2, Link) stehen über alle drei Spalten auf gleicher Höhe (CSS-Subgrid). Höhe aus dem Inhalt. Handy: Spalten untereinander, ohne senkrechte Linien (nicht abgestimmt).
   - Featured: creative ALUKEKU + Bookcovers, adventure Argentina + **Iguazú** (Runde 11 neu, erfunden), dev flowinsync + danielsell.com.
   - Bilder (Runde 11): Argentina und Iguazú haben **echte Fotos aus `assets-raw`**. Die HEIC-Dateien wurden außerhalb des Repos mit dem npm-Paket `heic-convert` umgewandelt, dann ohne Metadaten (kein GPS) auf höchstens 2000 px als AVIF nach `portfolio_files/argentinien/` und `portfolio_files/iguazu/` gelegt. Welches Foto zu welchem Projekt gehört, ist geraten. danielsell.com hat drei Screenshots dieser Seite (Hero, About, Kontakt) in `portfolio_files/danielsell-com/`. flowinsync hat weiter Platzhalter (Stooney u. a.).
   - Nicht mehr benutzt: `src/lib/collage.js` (Bilderbox aus Runde 9/10; könnte auf den Projektseiten wiederkommen) und `Feature.astro` (Slideshow). Beide bleiben vorerst liegen, sonst in Phase 4 löschen (samt CSS „Kapitel und Feature“ und „Slideshow“). Die Tab-/Aufklapp-Fassung steht in Commit `3e4055f`.
   - Verlauf: Runden 5–7 Slideshow mit Punkten, 4:3-Zuschnitt, Testseite `/varianten/` (archiviert in `C:\everything\portfolio\archive\varianten-projekte-2026-11-04\`, im Repo noch in Commit `4459cc8`); Runde 8 Spalten mit senkrechten Streifen und Collage; Runde 9 kleine Vorschaubilder, Bilderbox mit zwei Zuständen; Runde 10 Tabs mit Aufklappen in voller Breite; Runde 11 statisch, ganz farbige Spalten, zwei Featured Projects mit Etikett; Runde 12 nur Tabs farbig, Linien, „All … projects →“; Runde 13 Kennzahlen, „Pinned“, Abschlusslinie. Übrig ist der Filter `!p.startsWith('varianten')` in `sitemap.xml.js` (schadet nicht, kann beim Aufräumen raus).
7. **in short:** Layout wie „how it started“ (kleines Label links, Absatz rechts), ca. 32 px. Begriffe in den Bereichsfarben markiert; in `site.json` per `{creative: brand identities}`. Die Markierungen sind **nur Verzierung**: keine Links, kein Hover (am 2026-11-04 auf Daniels Wunsch geändert, `<span class="mark">`).
8. **Platzhalter nicht hervorheben.** Fehlende Inhalte sind erfundene Beispielwerte, aufgelistet unter `_beispiel` in `content/site.json` und `content/projects.json`. Rechtliches (Impressum-Adresse, Datenschutz) ist **nicht** erfunden und bleibt Platzhalter.
9. **Favicon** (Daniels Wahl im Favicon-Regler am 2026-11-04, nach 70 % und 50 % im Ink-Quadrat): **Größe 100 %, Linie 44, Ecken 0, Grund transparent, Zeichen Violett `#8A63FF`**, also nur das Logo-Zeichen, Linien bis an den Rand (`public/favicon.svg`). `apple-touch-icon.png` liegt auf Beige, weil iOS Transparenz schwarz füllt (in `scripts/make-icons.mjs`). Das Logo in der Navigation hat dieselbe Linienstärke 44 (`<Logo stroke={44}>`, `brand/logo.svg` selbst bleibt bei 43) und ist 30 px hoch (vorher 36). Die Icon-Links in `Base.astro` tragen `?v=5`, damit Browser keine alte, randlose Fassung aus dem Cache zeigen; bei jeder Änderung am Favicon hochzählen und `node scripts/make-icons.mjs` laufen lassen.
10. **Mobile:** vorerst ignorieren, bis die Desktop-Version passt. Es gibt eine einfache mobile Fassung (Bänder untereinander), sie ist aber nicht abgestimmt.

## Farben und Schrift

Ground `#F5F2EB`, Ink `#1E0B4A`, Ink-soft `#574A78`, Ink-deep `#12062E` (Text auf Violett, 4,9 : 1), Accent/Violett `#8A63FF`, Limette `#D4F25A`, Linie `#A98DFF`. Nur Archivo. Tokens am Anfang von `src/styles/global.css`.

## Wichtige Dateien

- `content/site.json`, `content/projects.json` — alle Inhalte (Daniel pflegt sie; `_hinweis` erklärt die Felder).
- `src/pages/index.astro` — Startseite. `impressum.astro`, `datenschutz.astro`, `404.astro`, `sitemap.xml.js`.
- `src/components/` — `Areas.astro` (Projekte: farbige Tab-Leiste, je zwei Featured Projects, Link zu allen), `Feature.astro` (Slideshow, zurzeit unbenutzt), `Closing.astro` (Kontakt/Footer), `Img.astro`, `T.astro`, `Logo.astro`, `TextPage.astro`.
- `src/lib/` — `content.js` (liest die JSON, Helfer wie `featuredProjects()`, `categoryHref()`, `projectHref()`), `images.js` (Bildpfade → erzeugte Größen), `collage.js` (Bilderbox, zurzeit unbenutzt).
- `src/layouts/Base.astro` — Kopf, Navigation (zurzeit Anker `#work`, `#about`, `#contact`), Meta.
- `src/styles/global.css` — alle Styles, in Abschnitten (Hero, Zitat, Bereiche, Feature, Currently, About, Abschluss …).
- `.htaccess` — Auslieferung aus `dist/`, Sperren, Header.

## Offen / nächste Schritte

1. Daniels Rückmeldung zu Runde 13 (Projekte, Entscheidung 6). Ideen von ihm: weitere Kennzahlen; später Texte zu den Projekten (blogartig).
2. Deploy durch Daniel, dann Live-Prüfung (siehe oben).
3. **Phase 2** laut Plan, erweitert um Daniels Wünsche:
   - **Eigene Seite pro Bereich** `/creative/`, `/adventure/`, `/dev/` (von der Startseite schon verlinkt, Runde 8) und **eigene Seiten pro Projekt** `/projects/<slug>/` (im Hero verlinkt). Ob es zusätzlich `/projects/` als Übersicht gibt, ist offen. `scripts/check-dist.mjs` führt die fehlenden Seiten nur als Hinweis.
   - `/about/` (Hero wie im Mockup, „how it started“, Eckdaten, Skills, off screen). Danach Navigation auf die neuen Seiten und `/about/` umstellen.
   - Argentinien-/Iguazú-Fotos: übernommen (Runde 11, siehe Entscheidung 6). Screenshots der dev-Projekte fehlen noch (flowinsync, Mixer-Dashboard, Werner Gehner).
   - Mobile-Fassung abstimmen.
4. **Phase 3:** Bewegung (wenig, sauber).
5. **Phase 4:** Aufräumen (`index.html`, `script.js`, `styles.css`, `send.php`, `.DS_Store` von v4 löschen), README auf Deutsch, Abschlussbericht.
