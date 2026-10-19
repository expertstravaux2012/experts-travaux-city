// Contenu éditorial de la home (`/`) du showroom Experts Travaux City.
// Textes propres au showroom (pas de reprise du site principal). Rien d'inventé : adresse, horaires,
// produits exposés, chiffres et labels restent à fournir (voir site.ts).
import { site } from './site';

export interface Lien {
  label: string;
  href: string;
}

export const hero = {
  /** H1 : « Experts Travaux » + « City » (géant, Montserrat Light) + précision lisible par les moteurs et lecteurs d'écran. */
  brand: site.parent.name,
  name: 'City',
  srOnly: 'Showroom de rénovation à Toulouse',
  subtitle: 'Voyez, comparez, décidez : le showroom où votre projet de rénovation prend forme. Toulouse, sur rendez-vous.',
  ctas: {
    rdv: { label: 'Prendre rendez-vous', href: '/#rendez-vous' },
    showroom: { label: 'Découvrir le showroom', href: '#showroom' },
  },
} as const;

/** Signature de marque validée par le client (sous le logo, pas en H1). */
export const signature = {
  slogan: 'Maison de confiance',
  baseline: 'Un seul interlocuteur, de la conception à la livraison',
} as const;

/** Bloc « Pour quel projet » : adossé aux motifs du formulaire (rdv.ts). À placer par astro-builder. */
export const pourQuelProjet = {
  title: 'Pour quel projet venir au showroom ?',
  text: 'Que vous prépariez une rénovation complète, une extension, une cuisine ou une salle de bain, une maison sur mesure ou un local professionnel, le rendez-vous se construit autour de votre projet. Précisez-le dans le formulaire : votre interlocuteur unique vous écoute, vous aide à clarifier vos choix, puis établit un devis détaillé après une visite sur place. Un autre projet ? Indiquez-le aussi.',
} as const;

export interface SectionIntro {
  title: string;
}

export const methodeSection: SectionIntro = {
  title: 'Du rendez-vous à la remise des clés',
};

export const marque = {
  title: 'Experts Travaux City, la maison de confiance d’Experts Travaux',
  paragraphs: [
    'Le showroom prolonge le savoir-faire d’Experts Travaux, entreprise toulousaine de rénovation et de bâtiment : un seul interlocuteur et un assureur unique du chantier, du devis à la remise des clés.',
    'Pour découvrir l’ensemble de nos métiers et de nos domaines d’intervention, rendez-vous sur le site Experts Travaux.',
  ],
  facts: [
    { valeur: String(site.foundedYear), label: 'Depuis' },
    { valeur: 'Toulouse', label: `et ${site.areaServed.radiusKm} km alentour` },
  ],
  link: { label: site.parent.linkLabel, href: site.parent.url } satisfies Lien,
} as const;
