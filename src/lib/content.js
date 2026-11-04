// Liest die beiden JSON-Dateien zur Build-Zeit. Einzige Quelle für Texte, Links und Projekte.
import site from '../../content/site.json';
import data from '../../content/projects.json';

export { site };
export const projects = data.projects;
export const CATEGORIES = ['creative', 'adventure', 'dev'];

/** "[Text]" ist ein Platzhalter: wird angezeigt und markiert. */
export const isPlaceholder = (v) => typeof v === 'string' && /^\s*\[[\s\S]*\]\s*$/.test(v);

/** Leerer String, null oder leere Liste blendet das Element aus. */
export const has = (v) => {
  if (Array.isArray(v)) return v.some(has);
  if (v && typeof v === 'object') return true;
  return v !== undefined && v !== null && String(v).trim() !== '';
};

/** Nur echte Ziele werden zu Links; Platzhalter-URLs bleiben Text. */
export const isUrl = (v) => typeof v === 'string' && /^(https?:\/\/|mailto:|\/|#)/.test(v.trim());
export const isExternal = (v) => typeof v === 'string' && /^https?:\/\//.test(v.trim());

export const byCategory = (cat) => projects.filter((p) => p.category === cat);

/** Eigene Seite pro Bereich (Phase 2): /creative/, /adventure/, /dev/ */
export const categoryHref = (cat) => `/${cat}/`;

/** Feature pro Kategorie: das Projekt mit featured: true, sonst das erste der Liste. */
export const featured = (cat) => {
  const list = byCategory(cat);
  return list.find((p) => p.featured === true) ?? list[0] ?? null;
};

/** Untertitel-Wort i verlinkt auf Kategorie i (creative, adventure, dev). */
export const subtitleLinks = () =>
  (site.hero?.subtitle ?? []).filter(has).map((word, i) => ({
    word,
    category: CATEGORIES.includes(String(word).toLowerCase()) ? String(word).toLowerCase() : CATEGORIES[i],
  }));

export const categoryLabel = (cat) => {
  const i = CATEGORIES.indexOf(cat);
  return site.hero?.subtitle?.[i] && !isPlaceholder(site.hero.subtitle[i]) ? site.hero.subtitle[i] : cat;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const formatDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : String(iso ?? '');
};

/** Zitat mit Markierungen: "{creative: brand identities}" wird zu einem Teil mit Kategorie. */
export const parseMarks = (text) => {
  const parts = [];
  const re = /\{\s*(creative|adventure|dev)\s*:\s*([^}]+?)\s*\}/g;
  let last = 0, m;
  while ((m = re.exec(String(text ?? '')))) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[2], category: m[1] });
    last = m.index + m[0].length;
  }
  if (last < String(text ?? '').length) parts.push({ text: String(text).slice(last) });
  return parts;
};
