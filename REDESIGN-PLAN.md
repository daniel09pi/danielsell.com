# danielsell.com v5 — Redesign-Plan

Arbeitsauftrag für den Agenten, der das Redesign umsetzt. Lies dieses Dokument **ganz**, bevor du irgendetwas änderst. Es enthält feste Vorgaben (Abschnitt 3), Freiheiten (Abschnitt 4), die Seitenstruktur (Abschnitt 5) und einen Ablauf mit Stopps, an denen du auf Daniels Feedback wartest (Abschnitt 7).

Stand: 02.11.2026. Abgestimmt mit Daniel (Besitzer der Seite, Designer und Entwickler).

---

## 1. Ziel

Die persönliche Portfolio-Seite von Daniel Sell bekommt die neue Identität seiner Visitenkarte (Farben, Logo, Schrift) und eine neue Struktur:

- Projekte in drei Kategorien: **creative**, **adventure**, **dev**.
- Jedes Projekt ist ein **Feature**: eine Bild-Slideshow mit Text daneben.
- Startseite: schlichter Hero, je ein Feature pro Kategorie, „currently working on“, Kontakt und Socials.
- Eigene Seiten: **Projekte** (alle Features), **About**, **Impressum**, **Datenschutz**.
- Alle Texte, Links und Projekte kommen aus **JSON-Dateien**, die Daniel selbst pflegt.

Gestaltung: **luftig, clean, ruhig**, mit wenigen genauen Details. Design und Komposition entwirft der Agent innerhalb der Vorgaben unten.

---

## 2. Ausgangslage (schon erledigt)

- Repo: `C:\everything\portfolio\danielsell.com` (GitHub `daniel09pi/danielsell.com`, **öffentlich**, Branch `master`; Daniel nennt ihn „main“).
- **So läuft der Server** (geprüft am 02.11.2026): Ein Apache-Webspace (PHP vorhanden, `.htaccess` wird ausgewertet) liefert **das Arbeitsverzeichnis eines Git-Klons direkt aus**, Branch `master`. Was in `master` auf GitHub liegt, ist nach dem Deploy (Abschnitt 9) sofort live; die live `index.html` ist identisch mit der im Repo.
  - Folge 1: Jede Datei im Repo ist öffentlich abrufbar, auch `REDESIGN-PLAN.md` und `content/*.json`. **Nie etwas Geheimes ins Repo.**
  - Folge 2: **`/.git/` ist zurzeit öffentlich abrufbar** (z. B. `https://danielsell.com/.git/config`). Zugangsdaten stehen dort keine, das Repo ist ohnehin öffentlich. Trotzdem muss das gesperrt werden (siehe 3.7).
  - Folge 3: Auf dem Server läuft kein Build. Was ausgeliefert wird, muss fertig im Repo liegen (siehe 8).
- Tag `v4-final` markiert die letzte Version vor dem Redesign (lokal; in Phase 0 pushen).
- **Backup** von v4: `C:\everything\portfolio\backups\2026-11-02_v4-final\` (komplettes Git-Bundle und ZIP der Live-Dateien, mit Anleitung zur Wiederherstellung). Nicht verändern.
- Bereits **gestaged, nicht committed**: `other-design-XD/`, `archive/` und `logs/` sind aus dem Repo entfernt. Kopien liegen in `C:\everything\portfolio\archive\`. **Diesen Ordner nicht anfassen und seine Inhalte nicht verwenden** (ausdrücklicher Wunsch: nichts aus V1 / `other-design-XD` übernehmen).
- Neu im Repo:
  - `brand/logo.svg`: Logo „lose“ (Linien und Kreis), Farbe über `currentColor`.
  - `brand/logo-knockout.svg`: Logo „negativ“, ein Rechteck im Kartenformat 85:55, aus dem das Logo herausgeschnitten ist. Farbe über `currentColor`.
  - `content/site.json`: Person, Hero-Untertitel, SEO, Socials, „currently“, About-Texte, Impressum.
  - `content/projects.json`: alle Projekte mit Kategorie, `featured`, Texten, Links und Bildern.
- Bestehende Bilder: `portfolio_files/<projekt>/*.avif` (große Originale, bis 4000 px breit), `portfolio_files/_assets/selfie daniel lama.avif` (About-Foto).
- Rohbilder für das Adventure-Projekt Argentinien legt Daniel in `C:\everything\portfolio\assets-raw\adventure\argentinien\` ab (außerhalb des Repos). Du übernimmst sie optimiert ins Repo und trägst die Pfade in `content/projects.json` ein.
- Referenzen:
  - Visitenkarte: `C:\everything\visitenkarte\visitenkarte-final.svg` und `visitenkarte-druck.svg`
  - Mockups: https://claude.ai/artifact/TyiB3iUs8Toyq1qkzfVh7w (privat; Daniel kann Screenshots geben). Was davon gilt, steht in Abschnitt 6.

---

## 3. Feste Vorgaben

### 3.1 Farben (Marke)

| Rolle | Hex | Hinweise |
|---|---|---|
| Grund (Ground) | `#F5F2EB` Beige | Das Beige der bisherigen Seite. Daniel mag ausdrücklich, wie es mit den neuen Farben zusammenspielt. |
| Text (Ink) | `#1E0B4A` Dunkelviolett | Für allen Fließtext. Auf Beige ca. 15 : 1. |
| Akzent | `#8A63FF` Violett | Logo-Farbe der Karte. Auf Beige ca. 3,5 : 1, also **nur für große Schrift ab 24 px, für Flächen und Grafik**, nie für kleinen Text. |
| Fläche | `#D4F25A` Limette | Flächen und Markierungen. **Nie als Textfarbe auf Hell.** Ink auf Limette ca. 14 : 1. |
| Linien | `#A98DFF` Hellviolett | Für die dünnen Strukturlinien (3.4). |

Ein dunkler Bereich (Ink als Fläche, Limette oder Beige als Schrift) ist erlaubt, wenn er der Komposition dient. Kontraste immer nachrechnen (WCAG AA: 4,5 : 1 für Text, 3 : 1 ab 24 px).

### 3.2 Schrift

- **Archivo** (Google Font, SIL OFL, variable Achsen für Stärke und Breite). Die Schrift der Visitenkarte, Daniel mag sie. Eine Familie reicht; die Breitenachse darf für Display-Größen genutzt werden.
- **Selbst hosten** (z. B. `@fontsource-variable/archivo` oder woff2 aus dem offiziellen Repo). **Keine** Einbindung über `fonts.googleapis.com`, da das in Deutschland abmahnbar ist.
- Ob es eine zweite Schrift (z. B. Mono für Code-Details) braucht, entscheidet der Agent. Standard ist nur Archivo.

### 3.3 Logo

- Dateien: `brand/logo.svg` (lose) und `brand/logo-knockout.svg` (negativ: Rechteck mit ausgeschnittenem Logo). Das Negativ hat Daniel ausdrücklich als „könnte cool aussehen“ genannt.
- **Nicht** auf einer Limetten-Fläche bzw. in einem limettenfarbenen Kärtchen. Das wurde im Mockup abgelehnt.
- Violett auf Beige in der Navigation wirkte im Mockup unpassend. Wähle die Logofarbe bewusst (z. B. Ink) und zeig Daniel die Wirkung im ersten Stopp.
- Geometrie nie verzerren oder neu zeichnen; nur skalieren und färben.

### 3.4 Dünne Linien aus der Visitenkarte

Die Karte hat ein feines Raster aus Linien entlang der Grundlinien und Satzkanten. Das darf auf der Website **Struktur und Layout sichtbar machen**, mit 1 px in `#A98DFF` entlang echter Kanten (Spaltengrenzen, Grundlinien, Sektionsränder).

- **Sparsam und mit Absicht** einsetzen: wenige Linien, die etwas zeigen, nie ein dekoratives Gitter über allem.
- Negativbeispiel: Der Karten-Hero im Mockup hat die Linien zu wörtlich und zu dicht übernommen. So nicht.

### 3.5 Das Detail mit den schiefen Bildern

Ein Markenzeichen der bisherigen Seite, das bleiben soll:

- Bilder (Vorschauen, Slides, About-Foto) liegen **leicht schief**, etwa −1,5° bis +2°, abwechselnd, und **leicht entsättigt** (`saturate(0.7)`).
- **Bei Hover oder Fokus** drehen sie sich ein Stück in die Gegenrichtung (ca. 1°) und werden voll gesättigt. Übergang 0,4 bis 0,5 s ease.
- Auf Touch-Geräten darf nichts von Hover abhängen; dort volle Sättigung oder ein Tap-Zustand.
- Bei `prefers-reduced-motion` keine Drehbewegung, nur der Farbwechsel.

### 3.6 Inhalte nur aus JSON

- `content/site.json` und `content/projects.json` sind die **einzige Quelle** für Texte, Links und Projekte. Kein Text, den Daniel ändern will, steht hart im Markup (außer Interface-Wörtern wie „next“ oder „close“).
- Die **Struktur der JSON-Dateien beibehalten**. Erweitern ist erlaubt; jede neue Eigenschaft im `_hinweis` der Datei erklären.
- Regeln für Platzhalter:
  - Werte in `[eckigen Klammern]` sind Platzhalter. Während der Entwicklung werden sie angezeigt, damit das Layout mit Inhalt geprüft wird. Im Abschlussbericht listest du jeden Platzhalter auf.
  - Ein leerer String `""` oder eine leere Liste blendet das Element sauber aus, ohne Lücke.
- `featured: true` pro Kategorie bestimmt das Feature auf der Startseite. Gibt es kein featured-Projekt in einer Kategorie, nimm das erste der Liste.
- Inhalte werden **beim Build** eingelesen, nicht per `fetch` im Browser. Die Seite muss ohne JavaScript lesbar sein und von Suchmaschinen erfasst werden.
- Englisch ist die Sprache der Seite.

### 3.7 Technik und Datenschutz

- Statische Ausgabe, die Apache **direkt aus dem Repo** ausliefert (siehe 8). Saubere URLs (`/projects/`, `/about/`) und eine 404-Seite.
- **`.htaccess` im Repo-Root ist Pflicht** und sperrt alles, was nicht zur ausgelieferten Seite gehört, mit 403/404:
  - `/.git/` und Dotfiles
  - Quellordner (z. B. `src/`, `content/`, `brand/`, `scripts/`) und `node_modules/`
  - `*.md`, `package*.json` und Konfigurationsdateien
  Prüfe nach dem ersten Deploy live mit `curl`, dass `https://danielsell.com/.git/config` und `/REDESIGN-PLAN.md` nicht mehr ausgeliefert werden.
- **Kein Kontaktformular.** `send.php` wird gelöscht. (Der Telegram-Token darin ist öffentlich in der Git-Historie; Daniel sperrt ihn selbst. Den Token nirgends wieder einfügen.)
- **Kein Tracking**, kein Besucher-Logging, keine Cookies, keine Einbindungen von Dritten (keine CDNs, keine Google Fonts, keine eingebetteten Videos von Dritten). Abhängigkeiten über npm mit festen Versionen.
- Bilder: responsive Größen erzeugen (z. B. 640, 1280, 2000 px Breite) als AVIF/WebP mit sinnvollem Fallback, `width`/`height` gegen Layout-Sprünge, `loading="lazy"` außer beim ersten sichtbaren Bild. Die 4000-px-Originale nie direkt ausliefern.
- Favicon und Teilen-Bild (Open-Graph-Bild, 1200 × 630) aus dem Logo bzw. dem Namen, in Markenfarben.

### 3.8 Barrierefreiheit (Pflicht)

- Echte `<a>` und `<button>`, sichtbarer Fokus, vollständige Bedienung per Tastatur, Alt-Texte aus der JSON.
- Die Slideshow ist eine ordentliche Komponente:
  - Pfeiltasten wechseln die Bilder, Wischen auf Touch.
  - Buttons mit `aria-label`, Zähler „3 / 9“, `aria-live` für den Wechsel.
  - Kein Autoplay, oder Autoplay mit Pause und standardmäßig aus.
- `prefers-reduced-motion` wird überall respektiert. Ohne JavaScript sind alle Inhalte sichtbar (die Slideshow fällt dann z. B. auf eine scrollbare Bildreihe zurück).

### 3.9 Was ausdrücklich nicht gewünscht ist

- Kein Hero, der die Visitenkarte 1:1 nachbaut, weder hell noch dunkel (beide abgelehnt).
- Kein limettenfarbenes Kärtchen hinter dem Logo.
- Nichts aus `other-design-XD` bzw. V1 übernehmen und keinen „V1“-Umschalter mehr in der Navigation.
- Keine Ladeanimation, die die Seite blockiert, bis Bilder geladen sind (die bisherige wartet auf 17 Bilder).
- Keine Animation, die ruckelt, springt oder Inhalte versteckt, wenn das Skript fehlschlägt.

---

## 4. Freiheiten (entscheidet der Agent)

- **Hero:** Daniel hat zwei Mockup-Heros abgelehnt. Vorgabe ist nur: **schlicht**, der **Name groß**, darunter der Untertitel **„creative — adventure — dev“** (aus `site.json`, die drei Wörter verlinken auf die drei Kategorien), **optional das Logo** (lose oder negativ). Alles Weitere (Komposition, Größen, Position, Mobile-Version) entwirft der Agent. Mobile ist eine eigene Komposition, keine verkleinerte Desktop-Version.
- Komposition und Reihenfolge der Sektionen, Ausführung der Features, Gestaltung der Projekt- und About-Seite (innerhalb Abschnitt 5 und 6).
- **Motion:** **wenig**, und alles muss **immer und sehr sauber** funktionieren. Lieber zwei perfekte Bewegungen als zehn mittelmäßige.
- Ob Monospace, Nummerierungen oder kleine Labels vorkommen, entscheidet der Agent (Daniel hat dazu keine Vorgabe).
- **Stack** (siehe 8).

---

## 5. Seiten und Inhalte

### 5.1 Startseite `/`
1. **Hero** (siehe 4).
2. **Drei Features**, eines pro Kategorie (creative, adventure, dev), jeweils das `featured`-Projekt: Slideshow und Text daneben (Desktop) bzw. darunter (Handy). Text: Titel, Art und Jahr, Tags, Beschreibung, Links. Jedes Feature hat einen Link „alle creative-Projekte“ o. ä. auf die Projektseite mit Sprungmarke zur Kategorie. Die Kategorien dürfen sich visuell unterscheiden (z. B. eigene Flächenfarbe pro Kategorie), müssen aber nicht.
3. **Currently working on** aus `site.currently`: Einträge mit Status und Datum der letzten Aktualisierung.
4. **About-Vorschau** (kurz, mit Link auf `/about`). Optional, wenn es der Komposition dient.
5. **Kontakt und Footer:** E-Mail (`mailto:`), Socials aus `site.socials`, Links zu Impressum und Datenschutz, © Jahr.

### 5.2 Projektseite `/projects/`
- Alle Projekte, gruppiert nach creative, adventure, dev, in der Reihenfolge der JSON.
- Jedes Projekt als Feature (Slideshow und Text), gleiche Komponente wie auf der Startseite.
- Sprungmarken pro Kategorie (`#creative` …) und pro Projekt (`#alukeku`), damit Projekte direkt verlinkbar sind. Eine kleine Kategorie-Navigation oben ist erwünscht.
- Optional: Vollbild-Ansicht der Bilder (gibt es auf der aktuellen Seite und funktioniert gut), mit Esc und Fokusfalle.

### 5.3 About `/about/`
- **Hero wie im Mockup „About-Seite“**, den Daniel gut findet: großes „hi, i'm daniel.“, Intro-Absatz, Foto daneben (leicht schief, siehe 3.5). **Das Foto im Originalformat zeigen**; im Mockup war es auf 4:5 beschnitten, das war falsch.
- **„How it started“ im Layout des Mockups**: links ein kleines Label, rechts ein großer Absatz über mehrere Spalten. Daniel mag das Layout, aber nicht den Text. Der Text kommt aus `site.about.howItStarted` (zurzeit ein Platzhalter).
- Danach Eckdaten, Skills (design und dev), „off screen“, alles aus `site.about`. Gestaltung frei, aber im gleichen luftigen Stil.

### 5.4 Impressum `/impressum/` und Datenschutz `/datenschutz/`
Schlichte Textseiten aus `site.legal`. Platzhalter sichtbar lassen, bis Daniel sie füllt.

### 5.5 404
Kurz, in Markenfarben, mit Link zurück.

---

## 6. Was aus den Mockups gilt

| Mockup | Status | Was daraus folgt |
|---|---|---|
| Farbkombination (alle) | **gefällt** | Palette aus 3.1 |
| About-Seite: Hero | **gefällt** | Layout übernehmen, Foto im Originalformat |
| About-Seite: „how it started“ | **Layout gefällt, Text nicht** | Layout übernehmen, Text aus JSON |
| Startseite: Hero hell (Karten-Kopie) | abgelehnt | nicht verwenden |
| Hero dunkel | abgelehnt | nicht verwenden |
| Hero schlicht (Name über volle Breite, Logo im Limetten-Kärtchen) | abgelehnt | Hero neu entwerfen |
| Startseite Mobil | abgelehnt (vor allem der Hero) | Mobile als eigene Komposition |
| Projektseite ALUKEKU, Code-Bereich, Footer | kein Feedback | frei; Struktur jetzt nach Abschnitt 5 |

Allgemein: Daniel mag es **luftig und clean**, so wie der About-Hero und „how it started“.

---

## 7. Ablauf und Stopps

Arbeite **direkt auf `master`**. Committen, pushen und deployen (Abschnitt 9) ist ausdrücklich erlaubt, auch für Zwischenstände. Die Seite hat keinen Traffic, und Daniel schaut sich die Zwischenstände live an. Die Stopps unten gelten trotzdem: Nach einem Stopp wird erst weitergebaut, wenn Daniel Feedback gegeben hat.

### Phase 0: Vorbereitung
1. `git push origin v4-final` (das Backup auf GitHub). Der erste Commit auf `master` enthält die schon gestagten Löschungen sowie `brand/`, `content/` und diesen Plan. Noch **nicht** deployen, solange `.htaccess` (3.7) fehlt: Erst mit der Sperre live gehen, damit Plan und Quellen nicht ausgeliefert werden.
2. Screenshots der aktuellen Seite (`v4-final`) aufnehmen.
3. Stack entscheiden (Abschnitt 8) und das Projekt aufsetzen. Fonts lokal einbinden, JSON einlesen, eine leere Seite baut fehlerfrei.

### Phase 1: Richtung, Tokens, Startseite → **STOPP**
1. Konzept: Inventar, Argument, Richtung (eine wählen und begründen), die Kernidee, Texte.
2. Tokens (Farben, Typo-Skala, Abstände) als CSS-Variablen.
3. Hero (Desktop und Mobile) und die Startseite komplett mit der Feature-Komponente.
4. Screenshots bei 1440, 768 und 390 px ansehen, eine Kritik-Runde.
5. Committen, pushen, deployen (Abschnitt 9) und live prüfen: Screenshots der Live-Seite und die `.htaccess`-Sperren (`scripts/livecheck.sh`).
6. **STOPP:** Daniel den Live-Link und die Screenshots bei 1440, 768 und 390 px zeigen, dazu die gewählte Richtung, die Kernidee und die Logo-Variante. **Auf Feedback warten**, bevor es weitergeht.

### Phase 2: Restliche Seiten
Projektseite, About, Impressum, Datenschutz, 404. Argentinien-Bilder aus `assets-raw` übernehmen, falls vorhanden (sonst Platzhalter). Screenshots der Dev-Projekte: die öffentlichen Live-Seiten (flowinsync, Werner Gehner) dürfen per Browser fotografiert werden; für das Mixer-Dashboard bleibt ein Platzhalter.

### Phase 3: Motion und Abnahme
1. Motion, mit den Grenzen aus Abschnitt 4.
2. Screenshot-Kritik bei 1440, 768 und 390 px, bis zu drei Runden.
3. Zusätzlich prüfen:
   - alle Links (intern und extern)
   - Tastatur-Durchgang auf jeder Seite
   - `prefers-reduced-motion`
   - Seite ohne JavaScript
   - keine Konsolenfehler
   - Build aus einem sauberen Checkout
   - Bildgrößen (das erste sichtbare Bild ist unter 300 KB)
4. **Hier lohnt sich Parallelisierung (ultracode):** getrennte Prüfer für Optik bei drei Breiten, Barrierefreiheit, Inhalte und Links sowie Performance. Jeder liefert Befunde, ein Agent behebt sie.

### Phase 4: Aufräumen und Bericht
1. Alte Dateien entfernen, die der neue Build ersetzt (`index.html`, `script.js` und `styles.css` von v4, `send.php`, `.DS_Store`), `.gitignore` anlegen (`node_modules`, `.shots`, `.DS_Store`; den ausgelieferten Build-Ordner **nicht** ignorieren, siehe 8). `portfolio_files` nur verschieben, wenn alle Pfade in der JSON angepasst werden. Was im Repo gelöscht wird, verschwindet beim Pull auch vom Server. Prüfe live, dass `/send.php`, `/other-design-XD/` und `/archive/` danach 404 liefern.
2. `README.md` für Daniel, auf Deutsch (wird durch `.htaccess` nicht ausgeliefert):
   - wie man Inhalte in der JSON ändert
   - wie man lokal startet und baut
   - wie man deployt (Build, Commit, Push, Deploy-Skript)
   - wie man auf v4 zurückgeht (Verweis auf die Backup-Anleitung)
3. **Bericht:**
   - gewählte Richtung und Abweichungen mit Grund
   - die Kernidee
   - die Werte der letzten Kritik-Runde und was noch fehlt
   - Liste aller Platzhalter, die Daniel füllen muss
   - was nicht geprüft werden konnte

---

## 8. Stack-Entscheidung

Entscheide nach diesen Kriterien und begründe kurz:

1. Inhalte aus JSON **zur Build-Zeit** zu fertigem HTML (SEO, ohne JS lesbar).
2. Mehrere Seiten mit gemeinsamer Navigation und gemeinsamem Footer, nur einmal gepflegt.
3. Statische Ausgabe für Apache, **kein Node und kein Build auf dem Server**. Der Server liefert das Git-Arbeitsverzeichnis aus (Abschnitt 2). Mit Build-Schritt heißt das:
   - der Build-Ordner (z. B. `dist/`) wird **mitcommittet**
   - die `.htaccess` im Root leitet alle Anfragen intern dorthin um (`mod_rewrite`) und sperrt den Rest (3.7)
   - vor jedem Commit wird gebaut; ein npm-Skript wie `npm run release` (Build, dann Prüfung, dass `dist/` aktuell ist) macht das schwer zu vergessen
   Ob `mod_rewrite` auf dem Webspace läuft, beim ersten Deploy live prüfen; falls nicht, Daniel fragen. Ohne Build-Schritt entfällt das, dann müssen die JSON-Inhalte aber trotzdem ohne `fetch` im Browser im HTML stehen.
4. Bildoptimierung im Build.
5. Wenig JavaScript im Browser: nur Slideshow, Motion und kleine Interaktionen.
6. Daniel arbeitet gern mit **Vue.js**. Wenn eine Komponente mit Zustand nötig ist (Slideshow, Vollbild), ist Vue willkommen, aber kein Muss.

Empfehlung aus der Planung: **Astro** (statisch, liest JSON nativ, Bild-Pipeline eingebaut, Vue-Komponenten als „Islands“ möglich). Gleichwertig in Ordnung: Vite mit vorgerendertem Vue. Reines HTML nur, wenn Navigation und Footer trotzdem an einer Stelle gepflegt werden.

---

## 9. Deploy, Live-Test und Rollback

1. Bauen (falls Build-Schritt), committen und pushen auf `master`.
2. Deploy auslösen: `bash C:/everything/portfolio/tools/deploy.sh`
   - Das Skript liest URL, Repo-Name (`danielsell.com`) und Token aus `C:\everything\portfolio\secrets\deploy.env`.
   - **Das Token ist geheim:** nie anzeigen, nie in eine Datei im Repo schreiben, nie in Commit-Nachrichten oder Berichte übernehmen. Die Datei `deploy.env` nicht verändern und nicht ins Repo kopieren.
   - Das Skript zeigt das Feld `output` der API und beendet sich bei einem Fehler mit einem Code ungleich 0. Am 02.11.2026 erfolgreich getestet („Already up to date.“).
3. Danach ist der Stand sofort live. Prüfen:
   - Screenshots der Live-Seite (und der Unterseiten)
   - `bash scripts/livecheck.sh`: Statuscodes der Seiten, der gesperrten Pfade (3.7) und der gelöschten alten Dateien
   - Daniel den Link geben
4. **Rollback**, falls ein Deploy die Seite kaputt macht: den letzten funktionierenden Commit wiederherstellen (`git revert <commit>`, push, deploy). Zurück auf v4: Anleitung in `C:\everything\portfolio\backups\2026-11-02_v4-final\README.md`. Kein Force-Push auf `master`.

## 10. Was Daniel noch liefert (nicht blockierend)

- [ ] Argentinien-Bilder nach `C:\everything\portfolio\assets-raw\adventure\argentinien\`
- [ ] Platzhalter in `content/site.json` und `content/projects.json` (LinkedIn, Texte, Jahre, Stack, Impressum-Adresse)

## 11. Ideen für später (jetzt nicht umsetzen)

- Hero mit drei Welten (creative, adventure, dev als Flächen zum Einsteigen)
- Hero als große Slideshow aus Arbeit und Reisen
- Die alten „Peek“-Bilder, die vom Rand hereinschauen, in den neuen Farben
- Plakat-Satz mit Bildern oder Logo im Satz
- Dark Mode, deutsche Version
