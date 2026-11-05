# danielsell.com v5 — Arbeitsstand und Übergabe

Stand: 6. November 2026, gepusht auf `origin/master`. Live ist noch **v4**; v5 ist nur lokal und auf GitHub (siehe „Deploy“).
Diese Datei beschreibt nur, was **jetzt** auf der Seite ist und was als Nächstes kommt. Den Verlauf aller Feedbackrunden, verworfene Wege und Begründungen enthält `STAND-ARCHIV.md`. Auftrag, Regeln und Phasen stehen in `REDESIGN-PLAN.md`.

## Für den neuen Chat

> Lies `danielsell.com/STAND.md` und `danielsell.com/REDESIGN-PLAN.md`. Phase 2 ist gebaut (Bereichs-, Projekt- und About-Seiten, siehe „Unterseiten“); wir warten auf Daniels Rückmeldung dazu und auf seine Texte für die Platzhalter. Desktop zuerst, Mobile vorerst ignorieren.

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
- `npm run release`: Build + `scripts/check-dist.mjs` (Seiten vollständig, nichts Verbotenes, keine toten Links, jede Adresse aus `sitemap.xml` vorhanden). Seit Phase 2 ist jeder Link auf eine fehlende Seite ein Fehler.
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

**Navigation** (`src/layouts/Base.astro`): links das Logo (lose, Ink, Linienstärke 44, 30 px hoch), rechts `work` (Bereiche auf der Startseite, `/#work`), `about` (`/about/`), `contact` (Kontakt unten auf jeder Seite, `#contact`). Unterstrichen ist die aktuelle Seite bzw. auf Bereichs- und Projektseiten `work` (Prop `current`). Das Logo steht **nicht** im Hero.

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

**Weitere Seiten:** `impressum`, `datenschutz` (Inhalt aus `legal`, Adresse und Datenschutztext noch Platzhalter), `404`, `sitemap.xml` (feste Seiten + Bereiche + Projekte).

**Mobile:** vorerst ignorieren. Es gibt eine einfache Fassung (Bänder untereinander), nicht abgestimmt.

## Unterseiten (Phase 2, seit 6. November 2026)

Gebaut nach Daniels Quiz vom 6. November 2026 (alles „im möglichst gleichen Stil“ wie die Startseite, möglichst wenig eigene Texte, nur Platzhalter):

**Bereichsseite** `/creative/`, `/adventure/`, `/dev/` (`src/pages/[area].astro`; Ziel von „Explore creative →“): Kopf `PageHead` (Fläche des Bereichs, Wort in `--step-display` in der Schriftfarbe des Felds, Grundlinie = Unterkante, feine Linie), darunter klein die Kennzahlen wie im Farbfeld der Startseite (`src/lib/facts.js`, gemeinsam mit `Areas.astro`). Dann **Zeilen mit feinen Linien** wie „Currently“ (`ProjectRow.astro`): links pinned/new, Titel, Art + Datum, erster Absatz des Texts; rechts vier kleine gedrehte Bilder wie auf der Startseite; ganze Zeile ist der Link. Reihenfolge wie auf der Startseite (`ordered()` in `content.js`). Am Ende die beiden anderen Bereiche als Farbfelder (ganz anklickbar, 50/50).

**Projektseite** `/projects/<slug>/` (`src/pages/projects/[slug].astro`): Kopf `PageHead` mit dem Titel in `--step-title`. **Unterlängen** (y, g, p) reichen unter die Linie und sind dort Ink (Verlauf per `background-clip: text`, Farbwechsel genau auf der Grundlinie), sonst wären sie bei adventure (Beige auf Ink) unsichtbar; mit Unterlängen bekommt die Zeile darunter mehr Abstand (`head--desc`). Unter der Linie vier Spalten: „← creative“ (zur Bereichsseite), Art + Tags und Jahr, posted/updated, Links (↗). Dann der Text: erster Absatz groß wie das Zitat der Startseite (ab Spalte 4), weitere Absätze normal darunter. Dann **alle Bilder in Reihen gleicher Höhe, ungeschnitten** (`Gallery.astro`, Aufteilung beim Build in `src/lib/gallery.js`: Ziel 0,36 × Breite, 2–4 pro Reihe, letzte Reihe wird nicht gestreckt; Fläche in der Hauptfarbe des Fotos bis zum Laden, `src/lib/dominant.js`; gerade, volle Farbe, kein Hover, keine Vollbildansicht). Am Ende „more“: Farbfeld des Bereichs wie auf der Startseite (Wort, Kennzahlen, „Explore … →“) und daneben die nächsten zwei Projekte des Bereichs (`FeatProject` mit `level={3}`), Linien nur über den Projekten.

**About** `/about/` (`src/pages/about.astro`): „hi, i’m daniel.“ groß (`--step-title`) auf einer feinen Linie über die volle Breite, darunter Foto (gedreht) + Einleitung + Eckdaten wie auf der Startseite (`.letter--page`). Dann **schlichte Listen** wie „Currently“ (links das Wort, rechts Zeilen mit Linien): CV (`about.cv`), Skills (`about.skills`, aus v4), Socials (alle aus `site.socials`). Daniel: **nichts Privates** (kein „off screen“), kleiner Lebenslauf, alle Socials, „und das wars“ (darum auch kein „how it started“).

## Inhalte

- `content/site.json` und `content/projects.json` enthalten **nur Felder, die die Seite zeigt**. `_hinweis` in jeder Datei erklärt die Felder, `_beispiel` listet erfundene Werte und Platzhalter.
- Phase 2 (6. November 2026): Projekttexte (`text`), Tags und Links aus v4 bzw. dem Archiv zurückgeholt (`text` bei pitrack: „mixing desk“ statt „mix-pult“). `text`: erster Absatz = Einstieg (auch auf der Bereichsseite), weitere Absätze nach einer Leerzeile nur auf der Projektseite (blogartig). Neu in `site.json`: `about.cv`, `about.skills` (aus v4), `about.socialsTitle`. `about.offScreen` und `howItStarted` bleiben im Archiv (Daniel will nichts Privates).
- **Neue Regel seit Phase 2 (Daniel):** möglichst **keine eigenen Texte** schreiben; wo Text fehlt, ein klarer Platzhalter in `[eckigen Klammern]` (nicht hervorgehoben) und Daniel genau sagen, wo. Platzhalter zurzeit: `text` bei argentinien und iguazu, zweiter Absatz bei alukeku (nur Beispiel für den langen Text), `about.cv` (Jahre, Schule), `legal` (Impressum-Adresse, Telefon, Datenschutz). Erfundene Beispielwerte aus früheren Runden (Daten posted/updated u. a.) stehen weiter in `_beispiel`.
- Slugs passen nicht mehr überall zu den Titeln: `iguazu` → „Argentina xSamu“, `mixer-dashboard` → „pitrack“, `argentinien` → „1 year in Argentina“. Sie bestimmen jetzt die echten Adressen `/projects/<slug>/` (die Bildpfade stehen einzeln in der JSON, hängen also nicht am Slug). Daniel gefragt (6. November), ob sie vor dem Livegang umbenannt werden; Antwort offen.

## Farben, Schrift, Favicon

Ground `#F5F2EB`, Ink `#1E0B4A`, Ink-soft `#574A78`, Ink-deep `#12062E` (Text auf Violett, 4,9 : 1), Accent/Violett `#8A63FF`, Limette `#D4F25A`, Linie `#A98DFF`. Nur Archivo. Tokens am Anfang von `src/styles/global.css`.
Favicon (`public/favicon.svg`): nur das Logo-Zeichen in Violett `#8A63FF`, Linie 44, Grund transparent, Linien bis an den Rand; `apple-touch-icon.png` auf Beige. Icon-Links in `Base.astro` tragen `?v=5`; bei jeder Änderung hochzählen und `node scripts/make-icons.mjs` laufen lassen.

## Dateien

- `src/pages/index.astro` (Startseite), `[area].astro` (Bereichsseiten), `projects/[slug].astro` (Projektseiten), `about.astro`, `impressum.astro`, `datenschutz.astro`, `404.astro`, `sitemap.xml.js`.
- `src/scripts/band.ts` (Laufband im Hero, Einstellungen in `CONFIG`), `src/lib/band.js` (Bilder und Hauptfarben fürs Band).
- `src/components/`: `Areas.astro`, `FeatProject.astro` (Prop `level` für die Überschrift), `PageHead.astro` (Kopf der Unterseiten), `ProjectRow.astro` (Zeile der Bereichsseite), `Gallery.astro` (Bildreihen der Projektseite), `Closing.astro`, `Img.astro`, `T.astro`, `Logo.astro`, `TextPage.astro`.
- `src/lib/content.js` (liest die JSON; `spotlight()`, `ordered()`, `byNewest()`, `categoryHref()`, `projectHref()`, `projectDate()`, `paragraphs()`, `kindAndTags()`, `parseMarks()` …), `src/lib/facts.js` (Kennzahlen eines Bereichs), `src/lib/gallery.js` (Aufteilung der Bildreihen), `src/lib/dominant.js` (Hauptfarbe eines Bilds), `src/lib/images.js` (Bildpfade → erzeugte Größen).
- `src/layouts/Base.astro` (Kopf, Navigation, Meta), `src/styles/global.css` (alle Styles in Abschnitten), `.htaccess`.
- **Übrig, nicht benutzt** (Phase 4 löschen oder für die Projektseiten wiederverwenden): `src/components/Feature.astro` (Slideshow; liest Felder, die es in `projects.json` nicht mehr gibt) und `src/lib/collage.js` (Bilderbox), samt CSS „Kapitel und Feature“ und „Slideshow“; die alte Hero-Testseite `src/pages/varianten/hero.astro` (`/varianten/hero/`, noindex, Runde 25, nie entschieden) und der Filter `!p.startsWith('varianten')` in `sitemap.xml.js`.

## Offen / nächste Schritte

1. **Laufband** ist auf der Startseite (siehe oben). Die Testseite `/varianten/laufband/` ist gelöscht (letzter Stand Commit `5bbb7d0`; dort auch der Verlauf aller ausprobierten Optionen: Panel, Kontur, Titel, Rahmen, eingefärbte Bilder, weiche Kanten, Skeleton-Glanz). Offen: Mobile-Fassung des Bands und der Steuerung; ob Lenis auf allen Seiten laufen soll (zurzeit nur Startseite).
2. **Hero aufpeppen (geparkt).** Zuletzt ausprobiert und von Daniel gemocht, aber geparkt: das **„Verlaufsspielchen“** (Felder verschwimmen nach oben mit Korn und Fasern in die Navigation, Linien „Ton der Fläche“, Hover-Kreis zeigt die Volltonflächen). Liegt mit README und Screenshots in `C:\everything\portfolio\archive\verlaufsspielchen-2026-11-05\` (im Repo Commit `31185dc`). Bei Übernahme: Skript als eigene Datei, Rückfall ohne JS, `prefers-reduced-motion` beachten.
3. Deploy durch Daniel, dann Live-Prüfung (siehe oben; `scripts/livecheck.sh` prüft jetzt auch `/about/`, die Bereiche und zwei Projektseiten).
4. **Phase 2 (gebaut, wartet auf Feedback):** Bereichs-, Projekt- und About-Seiten, Navigation umgestellt (siehe „Unterseiten“). Offen: Daniels Rückmeldung zum Aussehen; seine Texte für die Platzhalter; Slugs umbenennen ja/nein; Screenshots der dev-Projekte (flowinsync zeigt vorläufig Bilder anderer Projekte, pitrack und Werner Gehner haben keine); optional Vollbildansicht der Bilder (Plan 5.2) und `/projects/` als Adresse (zeigt zurzeit die 404-Seite); Mobile abstimmen.
5. **Phase 3:** Bewegung (wenig, sauber).
6. **Phase 4:** Aufräumen (v4-Reste `index.html`, `script.js`, `styles.css`, `send.php`, `.DS_Store`; unbenutzte Dateien oben), README auf Deutsch, Abschlussbericht.
