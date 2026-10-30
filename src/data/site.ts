export const site = {
  /** Nom d'affichage complet (le wordmark du logo découpe « Experts Travaux » + « City »). */
  name: 'Experts Travaux City',
  /** Marque mère : le site principal porte le SEO métiers ; le showroom le référence. */
  parent: {
    name: 'Experts Travaux',
    url: 'https://experts-travaux.fr',
    linkLabel: 'Découvrir Experts Travaux',
  },
  /** Domaine de production (sans slash final). */
  url: 'https://city.experts-travaux.fr',
  /**
   * Interrupteur unique d'indexation. false = noindex, nofollow sur toutes les pages,
   * robots.txt en `Disallow: /`. Passé à true au lancement (domaine confirmé).
   */
  indexable: true,
  /**
   * Préloader « cube qui se dessine » (une fois par session, ~3 s). false = non émis (code conservé dans
   * Preloader.astro ; l'intro porte le remplace) ; true = affiché.
   */
  showPreloader: false,
  /**
   * Interrupteur unique du hero. false = Entrée (salle 00, photo + panneau, porte le H1) ; true = hélice 3D
   * (Hero, Three.js chargé à la demande) à la place de l'Entrée. Un seul H1 dans les deux cas.
   */
  showHelix: false,
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
  /** Adresse du showroom (renseignée). `city` = code postal + ville (le JSON-LD les sépare au premier espace). */
  address: {
    street: '31 Rue du Rempart Matabiau',
    city: '31000 Toulouse',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=31%20Rue%20du%20Rempart%20Matabiau%2C%2031000%20Toulouse',
  },
  /** Horaires affichés du showroom (valeur renseignée ; dimanche fermé non émis en JSON-LD). `null` = ni affichés ni émis en JSON-LD. */
  horaires: [
    { jours: 'Lundi', horaires: 'Sur rendez-vous' },
    { jours: 'Mardi – samedi', horaires: '11h – 19h' },
    { jours: 'Dimanche', horaires: 'Fermé' },
  ] as null | { jours: string; horaires: string }[],
  /** Forme structurée de `horaires` pour le JSON-LD (lundi sur rendez-vous et dimanche non émis). À garder alignée sur `horaires`. */
  horairesSpec: {
    dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:00',
    closes: '19:00',
  },
  socials: [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/experts-travaux/about/' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/expertstravaux/' },
  ],
} as const;
