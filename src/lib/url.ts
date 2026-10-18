import { site } from '../data/site';

/** URL absolue de production, avec slash final (cohérent avec build.format "directory"). */
export const absoluteUrl = (path = '/'): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const hasFile = /\.[a-z0-9]+$/i.test(clean);
  return `${site.url}${hasFile || clean.endsWith('/') ? clean : `${clean}/`}`;
};

export const metierPath = (slug: string): string => `/metiers/${slug}/`;
