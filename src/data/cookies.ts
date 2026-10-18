// Paramètres et textes du gestionnaire de cookies. Aucun import : utilisable hors Astro (tests Node).

export type ConsentCategory = 'mesure-audience';

export interface CookieCategory {
  id: 'necessaires' | ConsentCategory;
  label: string;
  description: string;
  required: boolean;
}

export const consentStorageKey = 'et-consent';
/** ~6 mois : durée maximale de validité du choix recommandée par la CNIL. */
export const consentTtlDays = 182;

export const consentCategories: CookieCategory[] = [
  {
    id: 'necessaires',
    label: 'Cookies nécessaires',
    description:
      'Indispensables au fonctionnement du site et à la mémorisation de votre choix. Ils ne peuvent pas être désactivés.',
    required: true,
  },
  {
    id: 'mesure-audience',
    label: "Mesure d’audience",
    description:
      "Statistiques de fréquentation pour comprendre l’usage du site et l’améliorer.",
    required: false,
  },
];

export const optionalCategoryIds: ConsentCategory[] = consentCategories
  .filter((c): c is CookieCategory & { id: ConsentCategory } => !c.required)
  .map((c) => c.id);

export const cookieTexts = {
  banner: {
    ariaLabel: 'Gestion des cookies',
    title: 'Votre vie privée',
    text: "Nous aimerions mesurer l’audience du site pour l’améliorer. Aucun cookie de mesure n’est déposé sans votre accord.",
    accept: 'Tout accepter',
    refuse: 'Tout refuser',
    customize: 'Personnaliser',
  },
  panel: {
    title: 'Gestion des cookies',
    intro:
      'Choisissez les catégories que vous autorisez. Vous pouvez modifier ce choix à tout moment depuis le pied de page.',
    alwaysActive: 'Toujours actif',
    save: 'Enregistrer mes choix',
    close: 'Fermer',
  },
  footerButton: 'Gérer mes cookies',
};
