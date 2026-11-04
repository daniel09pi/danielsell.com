# danielsell.com v5 — Arbeitsstand und Übergabe

Stand: 4. November 2026, nach Runde 8 (Projekte-Abschnitt nach Daniels Plan: State 1/2/3, Bilderbox), gepusht auf `origin/master`.
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
6. **Projekte** (`src/components/Areas.astro`, Anordnung der Bilderbox in `src/lib/collage.js`), Stand Runde 8 nach Daniels eigenem Plan. Begriffe: **State 1** = drei gleich breite Spalten, **State 2** = eine Spalte groß, **State 3** = die eingeklappten Streifen.
   - *Logik:* Inhalt einer Spalte = das **Featured Project** des Bereichs. **Wort + Projektzahl sind überall der Link zur Seite des Bereichs** (`/creative/`, `/adventure/`, `/dev/`, `categoryHref()` in `src/lib/content.js`; die Seiten kommen in Phase 2), auch im Streifen. Klick aufs Featured Project (Etikett, Titel, Bilder; ein Button liegt über der Fläche) öffnet State 2. Schließen: Kreuz oder Escape. Projekt wechseln: erst schließen. Links `#creative` usw. (Hero) öffnen weiter die Spalte. Daniel dazu: „machen wir for now so, aber langfristig vielleicht überlegen, ob man State 3 einfach entfernt.“
   - *State 1:* oben links in dieser Reihenfolge: Etikett „Featured project“, Titel, Art + Jahr. Darunter **drei gleich große Bilder untereinander** (3:2, `object-fit: cover`), leicht gedreht wie die Vorschau in v4 beim Hover über ein Projekt (−1,5°, 2°, −1°). Hover über das Featured Project: Titel unterstrichen, Bilder drehen in die Gegenrichtung und sättigen. Unten Wort + Projektzahl (Zahl auf der Grundlinie des Worts).
   - *State 2:* links die **Bilderbox** mit allen Bildern des Projekts, rechts Etikett, Titel, Art/Jahr, Text, leise Links (z. B. „Live ↗“), Kreuz oben rechts. Box und Text oben bündig, **gleicher Abstand nach allen Seiten** (`--pad`, 3cqi, ca. 43 px bei 1440). „View project“, „Also in …“ und „All … projects“ sind weg.
   - *Bilderbox:* Bilder **gerade**, eigenes Format (Zuschnitt nur wenige Prozent, damit die äußeren Bilder genau an den Kanten liegen), verschiedene Größen, Titelbild eher groß. Guillotine-Collage: viele Zufallsbäume, die besten werden lokal verbessert; fester Zufall pro Projekt (gleiche Box = gleiches Bild), bei Größenänderung neu. Optimal für 8–12 Bilder. Hover: Bild wird leicht schief (±0,8–1,2°). **Klick auf ein Bild:** es wird groß (ca. 40–60 % der Box), die anderen klein drumherum, alles in der Box, mit Bewegung; nochmal klicken oder Escape: zurück. Zweites Escape schließt die Spalte.
   - *State 3:* Streifen mit senkrechtem Wort (`writing-mode: sideways-lr`), Projektzahl wie in State 1 **auf der Grundlinie des Worts**; gilt auch für den Streifen der offenen Spalte.
   - Wechsel der Zustände wie bisher: erst ausblenden (180 ms), dann umbauen und Breite animieren, dann einblenden. Ohne JavaScript bleibt State 1 stehen (die Wörter sind Links).
   - Platzhalter-Bilder (`_beispiel` in `content/projects.json`): Argentina hat jetzt 10 Bilder (Selfie, project500 1–6, Landeshut 2/4/6), flowinsync 10 (eigener Screenshot, Stooney 1–6, Bookcover 2, Landeshut 3/5).
   - `Feature.astro` (Slideshow, Varianten `full`/`panel`) wird auf der Startseite **nicht mehr benutzt**; bleibt vorerst für die Projektseiten liegen, sonst in Phase 4 löschen (samt CSS „Kapitel und Feature“ und „Slideshow“).
   - Frühere Runden 5–7 (Slideshow mit Punkten, 4:3-Zuschnitt, Testseite `/varianten/`, archiviert in `C:\everything\portfolio\archive\varianten-projekte-2026-11-04\`, im Repo noch in Commit `4459cc8`) sind damit abgelöst. Übrig ist der Filter `!p.startsWith('varianten')` in `sitemap.xml.js` (schadet nicht, kann beim Aufräumen raus).
7. **in short:** Layout wie „how it started“ (kleines Label links, Absatz rechts), ca. 32 px. Begriffe in den Bereichsfarben markiert; in `site.json` per `{creative: brand identities}`. Die Markierungen sind **nur Verzierung**: keine Links, kein Hover (am 2026-11-04 auf Daniels Wunsch geändert, `<span class="mark">`).
8. **Platzhalter nicht hervorheben.** Fehlende Inhalte sind erfundene Beispielwerte, aufgelistet unter `_beispiel` in `content/site.json` und `content/projects.json`. Rechtliches (Impressum-Adresse, Datenschutz) ist **nicht** erfunden und bleibt Platzhalter.
9. **Favicon** (Daniels Wahl im Favicon-Regler am 2026-11-04, nach 70 % und 50 % im Ink-Quadrat): **Größe 100 %, Linie 44, Ecken 0, Grund transparent, Zeichen Violett `#8A63FF`**, also nur das Logo-Zeichen, Linien bis an den Rand (`public/favicon.svg`). `apple-touch-icon.png` liegt auf Beige, weil iOS Transparenz schwarz füllt (in `scripts/make-icons.mjs`). Das Logo in der Navigation hat dieselbe Linienstärke 44 (`<Logo stroke={44}>`, `brand/logo.svg` selbst bleibt bei 43) und ist 30 px hoch (vorher 36). Die Icon-Links in `Base.astro` tragen `?v=5`, damit Browser keine alte, randlose Fassung aus dem Cache zeigen; bei jeder Änderung am Favicon hochzählen und `node scripts/make-icons.mjs` laufen lassen.
10. **Mobile:** vorerst ignorieren, bis die Desktop-Version passt. Es gibt eine einfache mobile Fassung (Bänder untereinander), sie ist aber nicht abgestimmt.

## Farben und Schrift

Ground `#F5F2EB`, Ink `#1E0B4A`, Ink-soft `#574A78`, Ink-deep `#12062E` (Text auf Violett, 4,9 : 1), Accent/Violett `#8A63FF`, Limette `#D4F25A`, Linie `#A98DFF`. Nur Archivo. Tokens am Anfang von `src/styles/global.css`.

## Wichtige Dateien

- `content/site.json`, `content/projects.json` — alle Inhalte (Daniel pflegt sie; `_hinweis` erklärt die Felder).
- `src/pages/index.astro` — Startseite. `impressum.astro`, `datenschutz.astro`, `404.astro`, `sitemap.xml.js`.
- `src/components/` — `Areas.astro` (Projekte: State 1/2/3, Bilderbox), `Feature.astro` (Slideshow, zurzeit unbenutzt), `Closing.astro` (Kontakt/Footer), `Img.astro`, `T.astro`, `Logo.astro`, `TextPage.astro`.
- `src/lib/` — `content.js` (liest die JSON, Helfer wie `featured()`, `categoryHref()`), `images.js` (Bildpfade → erzeugte Größen), `collage.js` (Anordnung der Bilderbox; offline testbar mit Node).
- `src/layouts/Base.astro` — Kopf, Navigation (zurzeit Anker `#work`, `#about`, `#contact`), Meta.
- `src/styles/global.css` — alle Styles, in Abschnitten (Hero, Zitat, Bereiche, Feature, Currently, About, Abschluss …).
- `.htaccess` — Auslieferung aus `dist/`, Sperren, Header.

## Offen / nächste Schritte

1. Daniels Rückmeldung zu Runde 8 (Projekte, Entscheidung 6). Offen u. a.: State 3 ganz streichen? State 1 statt drei Bildern auch eine kleine Collage (Daniels zweite Idee)? Größe der drei Bilder in State 1 (bei 1440 ca. 233 × 155 px, rechts viel Luft).
2. Deploy durch Daniel, dann Live-Prüfung (siehe oben).
3. **Phase 2** laut Plan, erweitert um Daniels Wünsche:
   - **Eigene Seite pro Bereich** `/creative/`, `/adventure/`, `/dev/` (von der Startseite schon verlinkt, Runde 8) und **eigene Seiten pro Projekt** `/projects/<slug>/` (im Hero verlinkt). Ob es zusätzlich `/projects/` als Übersicht gibt, ist offen. `scripts/check-dist.mjs` führt die fehlenden Seiten nur als Hinweis.
   - `/about/` (Hero wie im Mockup, „how it started“, Eckdaten, Skills, off screen). Danach Navigation auf die neuen Seiten und `/about/` umstellen.
   - Argentinien-Bilder: `assets-raw\adventure\argentinien\` ist leer. In `C:\everything\portfolio\assets-raw\` liegen seit 2026-11-04 `IMG_0410.jpg` (Bootsfahrt, mehrere Personen) und sechs `.HEIC`. **HEIC kann hier weder sharp noch Windows lesen** (HEVC-Decoder fehlt), Daniel müsste sie als JPG exportieren. Nicht ungefragt übernehmen (öffentliches Repo, andere Personen im Bild). Screenshots der dev-Projekte (Mixer-Dashboard, Werner Gehner, danielsell.com).
   - Mobile-Fassung abstimmen.
4. **Phase 3:** Bewegung (wenig, sauber).
5. **Phase 4:** Aufräumen (`index.html`, `script.js`, `styles.css`, `send.php`, `.DS_Store` von v4 löschen), README auf Deutsch, Abschlussbericht.
