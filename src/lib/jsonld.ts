// Construction du JSON-LD : un @graph unique par page, @id stables.
import { site } from '../data/site';
import { absoluteUrl } from './url';

export type JsonLdNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${site.url}/#organization`;

const areaServedNode = (): JsonLdNode => ({
  '@type': 'GeoCircle',
  name: `${site.areaServed.city} et ${site.areaServed.radiusKm} km alentour`,
  // Centre-ville de Toulouse (pas l'adresse de l'entreprise).
  geoMidpoint: { '@type': 'GeoCoordinates', latitude: 43.6047, longitude: 1.4442 },
  geoRadius: site.areaServed.radiusKm * 1000,
});

/** Showroom de la marque mère : GeneralContractor local, rattaché à Experts Travaux. */
export const organizationNode = (): JsonLdNode => ({
  '@type': ['GeneralContractor', 'HomeAndConstructionBusiness'],
  '@id': ORGANIZATION_ID,
  name: site.name,
  url: absoluteUrl('/'),
  description: site.description,
  logo: absoluteUrl(site.logo.mark),
  image: absoluteUrl(site.ogImage.src),
  telephone: site.phone.href.replace('tel:', ''),
  email: site.email,
  parentOrganization: { '@type': 'Organization', name: site.parent.name, url: site.parent.url },
  address: site.address
    ? {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        postalCode: site.address.city.split(' ')[0],
        addressLocality: site.address.city.split(' ').slice(1).join(' '),
        addressCountry: 'FR',
      }
    : { '@type': 'PostalAddress', addressLocality: site.areaServed.city, addressCountry: 'FR' },
  ...(site.address ? { hasMap: site.address.mapsUrl } : {}),
  ...(site.horaires ? { openingHoursSpecification: { '@type': 'OpeningHoursSpecification', ...site.horairesSpec } } : {}),
  areaServed: areaServedNode(),
  sameAs: site.socials.map((s) => s.url),
});

export const breadcrumbNode = (
  path: string,
  items: { name: string; path: string }[],
): JsonLdNode => ({
  '@type': 'BreadcrumbList',
  '@id': `${absoluteUrl(path)}#breadcrumb`,
  itemListElement: [{ name: 'Accueil', path: '/' }, ...items].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const buildGraph = (nodes: JsonLdNode[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});

/** Sérialisation sûre pour <script type="application/ld+json"> (échappe `<`). */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
