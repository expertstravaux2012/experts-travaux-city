import type { APIRoute } from 'astro';
import { site } from '../data/site';

// Piloté par site.indexable (src/data/site.ts) : au lancement, passer indexable à true.
export const GET: APIRoute = () => {
  const body = site.indexable
    ? `User-agent: *\nAllow: /\nDisallow: /maintenance/\n\nSitemap: ${site.url}/sitemap-index.xml\n`
    : `# Site en construction : indexation interdite.\n# Au lancement : passer site.indexable à true dans src/data/site.ts.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
