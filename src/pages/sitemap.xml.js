// sitemap.xml aus allen Seiten in src/pages (ohne 404).
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .map((p) => p.replace(/^\.\//, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, ''))
  .filter((p) => p !== '404')
  .map((p) => (p ? `/${p}/` : '/'));

export function GET({ site }) {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
