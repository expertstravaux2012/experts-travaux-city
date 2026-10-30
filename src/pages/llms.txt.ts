import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { navigation } from '../data/navigation';
import { seo } from '../data/seo';
import { legalLinks } from '../data/legal';

const abs = (href: string) => `${site.url}${href}`;
const link = (title: string, url: string, description?: string) =>
  `- [${title}](${url})${description ? `: ${description}` : ''}`;

export const GET: APIRoute = () => {
  const legalSeo = [seo.mentionsLegales, seo.cgu];
  const pratique = [
    site.address && `Adresse : ${site.address.street}, ${site.address.city}`,
    ...(site.horaires ?? []).map((h) => `${h.jours} : ${h.horaires}`),
    site.phone && `Téléphone : ${site.phone.display}`,
    site.email && `E-mail : ${site.email}`,
  ].filter(Boolean);

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} est le showroom de ${site.parent.name} à ${site.areaServed.city}. Le SEO métiers et le détail des prestations sont sur le site principal : ${site.parent.url}.`,
    '',
    '## Pages',
    '',
    link('Accueil', abs('/'), seo.home.description),
    link('Showroom', abs('/#showroom')),
    ...navigation.links.map((l) => link(l.label, abs(l.href))),
    link(navigation.cta.label, abs(navigation.cta.href)),
    '',
    `## ${site.parent.name}`,
    '',
    link(site.parent.linkLabel, site.parent.url),
    '',
    '## Informations pratiques',
    '',
    ...pratique.map((p) => `- ${p}`),
    '',
    '## Optional',
    '',
    ...legalLinks.map((l, i) => link(l.label, abs(l.href), legalSeo[i]?.description)),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
