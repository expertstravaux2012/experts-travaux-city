// Textes SEO par page (title ≤ 60 caractères, description 145–157 caractères).
// Le SEO métiers vit sur le site principal Experts Travaux : le showroom cible la marque et le rendez-vous.
export interface PageSeo {
  title: string;
  description: string;
}

export interface SeoContent {
  home: PageSeo;
  mentionsLegales: PageSeo;
  cgu: PageSeo;
}

export const seo: SeoContent = {
  home: {
    title: 'Showroom rénovation à Toulouse | Experts Travaux City',
    description: `Showroom Experts Travaux City à Toulouse : découvrez les matériaux et univers (cuisine, salle de bain, carrelage), préparez votre projet sur rendez-vous.`,
  },
  mentionsLegales: {
    title: 'Mentions légales | Experts Travaux City',
    description:
      'Mentions légales du site Experts Travaux City : éditeur, hébergeur, propriété intellectuelle, protection des données personnelles et gestion des cookies.',
  },
  cgu: {
    title: 'Conditions générales d’utilisation | Experts Travaux City',
    description:
      'Conditions générales d’utilisation du site Experts Travaux City : accès, propriété intellectuelle, responsabilité, données personnelles et droit applicable.',
  },
};
