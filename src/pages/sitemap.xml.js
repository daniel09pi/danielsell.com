// sitemap.xml: die festen Seiten in src/pages (ohne 404, ohne die Testseiten unter varianten/ und ohne die Vorlagen
// mit [..] im Namen), dazu die Bereichsseiten und die Projektseiten aus projects.json.
import { CATEGORIES, projects, has, categoryHref, projectHref } from '../lib/content.js';

const fixed = Object.keys(import.meta.glob('./**/*.astro'))
  .map((p) => p.replace(/^\.\//, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, ''))
  .filter((p) => p !== '404' && !p.startsWith('varianten') && !p.includes('['))
  .map((p) => (p ? `/${p}/` : '/'));
const pages = [
  ...fixed,
  ...CATEGORIES.map(categoryHref),
  ...projects.filter((p) => has(p.slug) && has(p.title)).map(projectHref),
];

export function GET({ site }) {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
