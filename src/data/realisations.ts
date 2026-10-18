// Univers du showroom affichés sur la home (visuels 16/9, dossier /assets/city). Sélection provisoire.
// Visuels illustratifs : `alt` ne décrit que ce qui est visible. `description` parle du projet du visiteur
// (ce qu'il prépare et décide en rendez-vous), jamais de produits, marques ou gammes exposés au showroom.

export interface Realisation {
  image: string;
  width: number;
  height: number;
  alt: string;
  categorie: string;
  /** 25 à 40 mots, tournés vers le projet du visiteur. Aucun produit exposé affirmé. */
  description: string;
}

export const realisations: Realisation[] = [
  {
    image: '/assets/city/choix_cuisine_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Cuisine',
    alt: 'Plan en marbre, robinetterie et façade en chêne',
    description:
      'Pour votre cuisine, venez avec vos usages, vos mesures et vos envies. Avec votre interlocuteur, vous faites le point sur l’organisation du plan de cuisine, du plan de travail aux façades, et vous arrêtez vos choix.',
  },
  {
    image: '/assets/city/choix_salle_de_bain_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Salle de bain',
    alt: 'Travertin, marbre vert et béton ciré',
    description:
      'Pour votre salle de bain, précisez l’espace disponible, vos habitudes et le style recherché. Votre interlocuteur vous aide à passer des idées aux choix : revêtements, robinetterie, rangements, ambiance.',
  },
  {
    image: '/assets/city/choix_luminaires_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Luminaires',
    alt: 'Quatre luminaires sur fond bronze',
    description:
      'L’éclairage se pense avec le reste du projet. Lors du rendez-vous, vous abordez les luminaires pièce par pièce : emplacements, ambiance recherchée, cohérence avec les matières et les teintes déjà choisies.',
  },
  {
    image: '/assets/city/choix_carreaux_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Carreaux',
    alt: 'Zellige vert, terre cuite, terrazzo et marbre',
    description:
      'Sol, mur, crédence ou douche : le choix des carreaux dépend de la pièce et de l’usage. Vous en parlez avec votre interlocuteur pour fixer format, couleur et calepinage avant de lancer les travaux.',
  },
  {
    image: '/assets/city/choix_bois_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Bois',
    alt: 'Échantillons de bois du clair au foncé',
    description:
      'Sol en parquet, boiseries, agencements : le bois se choisit selon l’essence, la teinte et l’entretien souhaité. Vous clarifiez vos priorités avec votre interlocuteur, pour un ensemble cohérent avec le reste du projet.',
  },
  {
    image: '/assets/city/choix_peinture_showroom_toulouse-1600.webp',
    width: 1600,
    height: 893,
    categorie: 'Peinture',
    alt: 'Nuancier de cinq teintes',
    description:
      'Une teinte se juge dans la lumière de votre pièce. Lors du rendez-vous, vous définissez l’ambiance recherchée et composez votre palette, du nuancier peinture aux accords avec sols, carreaux et luminaires.',
  },
];
