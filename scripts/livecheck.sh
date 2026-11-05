#!/usr/bin/env bash
# Live-Prüfung nach dem Deploy: Statuscodes der Seiten, Sperren und alten Dateien.
B=https://danielsell.com
check() { printf '%-34s %s (erwartet %s)\n' "$1" "$(curl -s -o /dev/null -w '%{http_code}' "$B$1")" "$2"; }
for p in / /about/ /creative/ /adventure/ /dev/ /projects/alukeku/ /projects/danielsell-com/ /impressum/ /datenschutz/ /sitemap.xml /robots.txt /favicon.svg /og.png; do check "$p" 200; done
check /impressum 301
for p in /.git/config /.git/HEAD /.htaccess /.gitignore /REDESIGN-PLAN.md /content/site.json /src/pages/index.astro /scripts/images.mjs /brand/logo.svg /portfolio_files/alukeku/1.avif /package.json /astro.config.mjs /node_modules/astro/package.json /dist/index.html /send.php /index.html.bak /styles.css /script.js /other-design-XD/ /archive/ /gibtsnicht/; do check "$p" 404; done
printf '\n404-Seite: '; curl -s "$B/gibtsnicht/" | grep -o '<title>[^<]*</title>'
printf 'Startseite: '; curl -s "$B/" | grep -o '<title>[^<]*</title>'
printf 'Redirect /impressum -> '; curl -s -o /dev/null -w '%{redirect_url}\n' "$B/impressum"
