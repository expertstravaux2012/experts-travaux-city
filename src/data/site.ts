export const site = {
  /** Nom d'affichage complet (le wordmark du logo découpe « Experts Travaux » + « City »). */
  name: 'Experts Travaux City',
  /** Marque mère : le site principal porte le SEO métiers ; le showroom le référence. */
  parent: {
    name: 'Experts Travaux',
    url: 'https://experts-travaux.fr',
    linkLabel: 'Découvrir Experts Travaux',
  },
  /** Domaine de production (sans slash final). À CONFIRMER avec Hery (sous-domaine ou domaine dédié). */
  url: 'https://city.experts-travaux.fr',
  /**
   * Interrupteur unique d'indexation. false = noindex, nofollow sur toutes les pages,
   * robots.txt en `Disallow: /`. Passer à true au lancement, une fois le domaine confirmé.
   */
  indexable: false,
  /**
   * Gestionnaire de cookies. enabled = true : le bandeau s'affiche à la première visite.
   * Le bouton « Gérer mes cookies » du footer reste actif.
   */
  consent: { enabled: true },
  /** Zone d'intervention (identique au site principal). */
  areaServed: { city: 'Toulouse', radiusKm: 100 },
  ogImage: {
    src: '/assets/og-city.jpg',
    width: 1200,
    height: 630,
    alt: 'Logo Experts Travaux City : un cube aux trois faces grises sur fond sombre',
  },
  logo: {
    mark: '/assets/rebranding/logo-mark.png',
    markDark: '/assets/rebranding/logo-mark-dark.png',
    markWebp: '/assets/rebranding/logo-mark.webp',
    markDarkWebp: '/assets/rebranding/logo-mark-dark.webp',
  },
  description:
    'Showroom Experts Travaux City à Toulouse : découvrez les matériaux et univers (cuisine, salle de bain, carrelage) et préparez votre projet avec un interlocuteur unique, sur rendez-vous.',
  legalLine: 'Showroom · Rénovation & Bâtiment · Toulouse',
  foundedYear: 2013,
  labels: {
    skipToContent: 'Aller au contenu',
    homeAria: 'Experts Travaux City — accueil',
    mainNav: 'Navigation principale',
    mobileNav: 'Navigation principale mobile',
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    footerNav: 'Plan du site',
    footerNavTitle: 'Navigation',
    footerContactTitle: 'Contact',
  },
  /** Coordonnées : reprises du site principal en attendant celles du showroom. À CONFIRMER. */
  email: 'contact@experts-travaux.fr',
  phone: { display: '05 82 95 14 32', href: 'tel:+33582951432' },
  /** Adresse du showroom : null tant que non communiquée (rien n'est affiché ni émis en JSON-LD). À RENSEIGNER. */
  address: null as null | { street: string; city: string; mapsUrl: string },
  /** Horaires d'ouverture : null tant que non communiqués. Exemple : [{ jours: 'Lundi – vendredi', horaires: '9h – 18h' }]. */
  horaires: null as null | { jours: string; horaires: string }[],
  socials: [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/experts-travaux/about/' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/expertstravaux/' },
  ],
} as const;
