# danielsell.com v5 — Arbeitsstand und Übergabe

Stand: 3. November 2026, nach Feedbackrunde 6 (Projekte-Abschnitt), gepusht auf `origin/master`.
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

- **Screenshots mit Klicks/Hover:** `node scripts/shot.mjs .taste-skill/shots 1440 900 name='<js>' …` (Vorschau muss laufen; Hilfe im Kopf der Datei). Normale Headless-Screenshots mit `--virtual-time-budget` zeigen nach einem Klick nachgeladene Bilder nicht; deshalb dieses Skript.
- **taste-skill** (`C:\Users\daniel\.claude\plugins\cache\taste-skill\taste-skill\2.1.5\skills\taste-skill`):
  - `node <skill>/scripts/lint.mjs src` → zurzeit 0 FAIL, 0 WARN.
  - `node <skill>/scripts/inspect.mjs http://127.0.0.1:4321/ --allow palette-purple,palette-cream` → Screenshots in `.taste-skill/inspect/`. Bekannte, begründete Meldungen: `still-page` (Bewegung kommt in Phase 3), Kontrast des Namens (misst gegen Beige statt gegen die Flächen), Zitat als „Headline“, wenige Bilder (geschlossene Spalten zählen nicht), Video fehlt, Slideshow scrollt seitlich.
- Eigene Prüfskripte per DevTools-Protokoll: vor dem Messen `document.documentElement.style.scrollBehavior = "auto"` setzen (`html` hat `scroll-behavior: smooth`, sonst misst man mitten im Scrollen).
- Arbeitsnotizen des Skills (Inventar, Richtung, alle Feedbackrunden): `.taste-skill/notes.md` (nicht im Repo, nur lokal).

## Deploy (offen)

Der Aufruf `bash C:/everything/portfolio/tools/deploy.sh` wurde von der automatischen Rechteprüfung abgelehnt („Production Deploy“). **Daniel startet ihn selbst:** `! bash C:/everything/portfolio/tools/deploy.sh`.
Bis dahin ist live v4, und **`/.git/config` ist öffentlich erreichbar** (die neue `.htaccess` sperrt das erst nach dem Deploy).
Nach dem Deploy: `bash .taste-skill/livecheck.sh` (erwartete Statuscodes, u. a. `.git/config`, `REDESIGN-PLAN.md`, `send.php` → 404; Seiten → 200). Bei 500ern: `git revert` + push + erneut deployen. Danach `inspect.mjs https://danielsell.com/ …`.

## Was entschieden ist (Daniels Feedback, in Reihenfolge)

1. **Logo im Hero abgelehnt** („design muss sinn machen“). Das Logo steht nur in der Navigation (lose, Ink), im Favicon und im Teilen-Bild.
2. **Hero:** drei Farbspalten creative (Limette) / adventure (Ink) / dev (Violett). Der Name `daniel sell` läuft riesig darüber, **ganz in Beige** (ausgespart wie das Logo-Negativ; Farbsplit im Namen abgelehnt). Grundlinie des Namens = Unterkante der Flächen (`text-box: trim-end cap alphabetic`), darunter eine **feine Linie** `#A98DFF`. Unter der Kante pro Spalte das Wort (Link zur Projektspalte) und die Projekttitel (Links auf `/projects/<slug>/`). Kein Erklärsatz, kein Button (abgelehnt als generisch).
3. **Flächenfarben pro Kategorie:** gefallen.
4. **Bilder** nur subtil schief: ±0,4–0,7°, Hover dreht ca. 1° zurück und sättigt. **Seit Runde 7 nur noch beim About-Selfie;** Projektbilder stehen gerade.
5. **Reihenfolge der Startseite:** Hero → About („hi, i’m daniel.“ verlinkt auf `/about/`) → Currently working on → Projekte → in short → Kontakt/Footer.
6. **Projekte** (`src/components/Areas.astro`, `Feature.astro` Variante `panel`), Stand Runde 6:
   - *Ausgangszustand:* drei gleich breite Farbspalten. Oben links der Hinweis **„Featured project: <Titel>“** (kleines Etikett, Hintergrund in Schriftfarbe der Spalte). Darunter **ein** Bild (kein Stapel mehr, „messy“ abgelehnt) in festem 4:3-Rahmen, Bild unten bündig, direkt darunter **Pfeile und Punkte** (Punkte: Ring, aktueller gefüllt). Unten Wort + Projektzahl. Klick aufs Wort oder aufs Bild öffnet die Spalte; Hover aufs Bild unterstreicht das Wort.
   - *Offen:* Streifen links (senkrechtes Wort), **Bild links, Text rechts**, Bild nicht mehr randlos (ca. 650 px breit bei 1440), Punkte/Pfeile direkt darunter. Oben links „Featured project“, oben rechts ein **Kreuz** zum Schließen. Rangfolge im Text: Titel (groß) → Art/Jahr → Beschreibung → **ein Hauptlink „View project →“** → leise daneben „Live ↗“ (falls vorhanden) → leise am Fuß „Also in <bereich>: …“ und „All <bereich> projects“ (nur wenn der Bereich mehr als ein Projekt hat). Tags sind ausgeblendet.
   - Die Slideshow ist in beiden Zuständen **dieselbe** (gleiches Bild). Wechsel: erst ausblenden (180 ms), dann umbauen und Breite animieren, dann einblenden; nichts springt sichtbar.
   - *Streifen:* die anderen beiden schmal, senkrechtes Wort mit Projektzahl. Hover **nur Unterstreichung, keine Verschiebung**.
   - Schließen: Kreuz, Escape (überall), Klick auf den Streifen der offenen Spalte. Links `#creative` usw. öffnen die Spalte.
   - Bilder werden in der Spalte auf **4:3 zugeschnitten** (`object-fit: cover`, Daniels Wahl), damit die Kanten beim Blättern ruhig bleiben; ungeschnitten zeigt sie später die Projektseite.
   - Platzhalter-Bilder: adventure (Argentina) Bilder 2–7 von project500, dev (flowinsync) Bilder 2–7 von Stooney, vermerkt in `_beispiel` von `content/projects.json`.
   - In der Spalte zeigen **Punkte statt Zähler** „3 / 9“ die Position (Daniels Wunsch); für Screenreader sagt `aria-live` weiter „image 3 of 9“. Die Punkte sind nur für die Maus (`aria-hidden`), Tastatur nutzt Pfeil-Buttons und Pfeiltasten.
   - **Runde 7 (Daniels Feedback auf Runde 6, gilt ab jetzt, noch nicht in Areas/Feature umgesetzt):** keine Slideshow mehr; Projektbilder **gerade**, kein Dreh- und kein Hover-Dreh-Effekt (der passt nur beim About-Selfie). Zuschnitt mag er nicht, ist aber nötig, wo Bilder in feste Rahmen müssen. Der Hinweis „Featured project“ muss **direkt am Projekt** stehen (Titel/Bilder), nicht als Etikett oben in der Ecke. **Mehr Bilder auf einmal** zeigen, dazu eine **Vollbild-Ansicht wie v4** (Overlay, alle Bilder groß untereinander, × und Escape). „View project“ war zu groß → normale Textgröße. Die „Also in …“-Liste fällt weg; der Link zu allen Projekten eines Bereichs bleibt, aber nicht am Fuß des Textes.
   - Dafür gibt es die **Testseite `/varianten/`** (noindex, nicht verlinkt, nicht in der Sitemap) mit fünf statischen Layouts: A Kontaktbogen (4:3-Raster), B Ungeschnitten (Blocksatz-Reihen), C Bänder (drei Bänder untereinander, nichts klappt auf), D Leitbild mit Index (großes Bild + kleine Quadrate), E Magazin (großes + kleines Bild, offen als Doppelseite). **Am 2026-11-04 aus der Seite genommen** (auf Daniels Wunsch, ohne Wahl): die Dateien liegen jetzt außerhalb des Repos in `C:\everything\portfolio\archive\varianten-projekte-2026-11-04\src\` (`pages/varianten/`, `components/varianten/`, Galerie.astro = Vollbild-Ansicht), `dist/` ist ohne sie neu gebaut. Im Repo stehen sie noch in Commit `4459cc8`. Dort laufen sie nicht, weil sie `Base.astro` und die Inhalte über relative Pfade laden; zum Ansehen zurück nach `src/` kopieren. Übrig ist der Filter `!p.startsWith('varianten')` in `sitemap.xml.js` (schadet nicht, kann beim Aufräumen raus).
7. **in short:** Layout wie „how it started“ (kleines Label links, Absatz rechts), ca. 32 px. Begriffe in den Bereichsfarben markiert und verlinkt; in `site.json` per `{creative: brand identities}`. **Kein Hover-Effekt** auf den Markierungen (am 2026-11-04 entfernt, Daniels Wunsch); nur der Fokusrahmen für die Tastatur bleibt.
8. **Platzhalter nicht hervorheben.** Fehlende Inhalte sind erfundene Beispielwerte, aufgelistet unter `_beispiel` in `content/site.json` und `content/projects.json`. Rechtliches (Impressum-Adresse, Datenschutz) ist **nicht** erfunden und bleibt Platzhalter.
9. **Favicon:** Ink-Quadrat, beiges Logo-Zeichen auf **70 %** der Breite verkleinert und mittig (`public/favicon.svg`, seit 2026-11-04). Die Icon-Links in `Base.astro` tragen `?v=3`, damit Browser keine alte, randlose Fassung aus dem Cache zeigen; bei jeder Änderung am Favicon hochzählen und `node scripts/make-icons.mjs` laufen lassen.
10. **Mobile:** vorerst ignorieren, bis die Desktop-Version passt. Es gibt eine einfache mobile Fassung (Bänder untereinander), sie ist aber nicht abgestimmt.

## Farben und Schrift

Ground `#F5F2EB`, Ink `#1E0B4A`, Ink-soft `#574A78`, Ink-deep `#12062E` (Text auf Violett, 4,9 : 1), Accent/Violett `#8A63FF`, Limette `#D4F25A`, Linie `#A98DFF`. Nur Archivo. Tokens am Anfang von `src/styles/global.css`.

## Wichtige Dateien

- `content/site.json`, `content/projects.json` — alle Inhalte (Daniel pflegt sie; `_hinweis` erklärt die Felder).
- `src/pages/index.astro` — Startseite. `impressum.astro`, `datenschutz.astro`, `404.astro`, `sitemap.xml.js`.
- `src/components/` — `Areas.astro` (Projekte), `Feature.astro` (Projekt mit Slideshow; Varianten `full` und `panel`), `Closing.astro` (Kontakt/Footer), `Img.astro`, `T.astro`, `Logo.astro`, `TextPage.astro`.
- `src/layouts/Base.astro` — Kopf, Navigation (zurzeit Anker `#work`, `#about`, `#contact`), Meta.
- `src/styles/global.css` — alle Styles, in Abschnitten (Hero, Zitat, Bereiche, Feature, Currently, About, Abschluss …).
- `.htaccess` — Auslieferung aus `dist/`, Sperren, Header.

## Offen / nächste Schritte

1. Projekte-Abschnitt nach Runde 7 umsetzen (Entscheidung 6). Die Testseite `/varianten/` ist archiviert (siehe dort); welche Variante es wird, ist offen.
2. Deploy durch Daniel, dann Live-Prüfung (siehe oben).
3. **Phase 2** laut Plan, erweitert um Daniels Wünsche:
   - `/projects/` (alle Projekte nach Bereich, Sprungmarken `#creative` usw.) und **eigene Seiten pro Projekt** `/projects/<slug>/` (sind auf der Startseite schon verlinkt).
   - `/about/` (Hero wie im Mockup, „how it started“, Eckdaten, Skills, off screen). Danach Navigation auf `/projects/` und `/about/` umstellen.
   - Argentinien-Bilder aus `C:\everything\portfolio\assets-raw\adventure\argentinien\` übernehmen (lag bisher noch nichts drin; vorerst steht das Lama-Foto als Bild). Screenshots der dev-Projekte (Mixer-Dashboard, Werner Gehner, danielsell.com).
   - Mobile-Fassung abstimmen.
4. **Phase 3:** Bewegung (wenig, sauber; Inspector-FAIL `still-page`).
5. **Phase 4:** Aufräumen (`index.html`, `script.js`, `styles.css`, `send.php`, `.DS_Store` von v4 löschen), README auf Deutsch, Abschlussbericht.
