// Salles 01 à 06 de la home (une par univers de realisations.ts) et libellés d'interface associés.
// Textes reformulés à partir de realisations.ts / home.ts / showroom.ts uniquement : aucun produit, teinte, marque
// ou équipement exposé n'est affirmé. Les visuels sont des rendus illustratifs, jamais des photos du showroom.
// `categorie` = clé de jointure avec `realisations` (image, dimensions).
// `accroche` et `cta` : PROPOSITIONS À VALIDER par Hery (textes provisoires).

export interface Salle {
  /** Ancre : /#id */
  id: string;
  numero: string;
  /** Nom de l'univers (puce, rail, plan). */
  titre: string;
  /** H2 d'accroche. PROPOSITION À VALIDER. */
  accroche: string;
  /** Doit correspondre à `Realisation.categorie`. */
  categorie: string;
  texte: string;
  /** Pastilles : uniquement des mots déjà présents dans `texte`. */
  themes?: string[];
  /** CTA de la salle (vers le rendez-vous). PROPOSITION À VALIDER. */
  cta: string;
  /** Décrit uniquement ce qui est visible dans le rendu illustratif. */
  alt: string;
  /** Libellé du lien dans le plan et le rail. */
  planLabel: string;
}

export const salles: Salle[] = [
  {
    id: 'cuisine',
    numero: '01',
    titre: 'Cuisine',
    accroche: 'La cuisine, à vos mesures',
    categorie: 'Cuisine',
    texte:
      'Venez avec vos usages, vos mesures et vos envies. Vous faites le point sur l’organisation, du plan de travail aux façades, et vous arrêtez vos choix.',
    themes: ['Plan de travail', 'Façades', 'Organisation'],
    cta: 'Préparer ma cuisine',
    alt: 'Rendu illustratif : plan en marbre, robinetterie et façade en chêne',
    planLabel: 'Cuisine',
  },
  {
    id: 'salle-de-bain',
    numero: '02',
    titre: 'Salle de bain',
    accroche: 'La salle de bain, selon vos habitudes',
    categorie: 'Salle de bain',
    texte:
      'Précisez l’espace disponible, vos habitudes et le style recherché. Votre interlocuteur vous aide à passer des idées aux choix : revêtements, robinetterie, rangements, ambiance.',
    themes: ['Revêtements', 'Robinetterie', 'Rangements'],
    cta: 'Préparer ma salle de bain',
    alt: 'Rendu illustratif : travertin, marbre vert et béton ciré',
    planLabel: 'Salle de bain',
  },
  {
    id: 'luminaires',
    numero: '03',
    titre: 'Luminaires',
    accroche: 'La lumière, pièce par pièce',
    categorie: 'Luminaires',
    texte:
      'L’éclairage se pense avec le reste du projet. Vous abordez les luminaires pièce par pièce : emplacements, ambiance recherchée, cohérence avec les matières et les teintes déjà choisies.',
    cta: 'Prendre rendez-vous',
    alt: 'Rendu illustratif : quatre luminaires sur fond bronze',
    planLabel: 'Luminaires',
  },
  {
    id: 'carreaux',
    numero: '04',
    titre: 'Carreaux',
    accroche: 'Le carreau, du format au calepinage',
    categorie: 'Carreaux',
    texte:
      'Sol, mur, crédence ou douche : le choix des carreaux dépend de la pièce et de l’usage. Vous fixez format, couleur et calepinage avec votre interlocuteur avant de lancer les travaux.',
    themes: ['Format', 'Couleur', 'Calepinage'],
    cta: 'Prendre rendez-vous',
    alt: 'Rendu illustratif : zellige vert, terre cuite, terrazzo et marbre',
    planLabel: 'Carreaux',
  },
  {
    id: 'bois',
    numero: '05',
    titre: 'Bois',
    accroche: 'Le bois, dans son essence',
    categorie: 'Bois',
    texte:
      'Sol en parquet, boiseries, agencements : le bois se choisit selon l’essence, la teinte et l’entretien souhaité. Vous clarifiez vos priorités avec votre interlocuteur.',
    themes: ['Essence', 'Teinte', 'Entretien'],
    cta: 'Prendre rendez-vous',
    alt: 'Rendu illustratif : échantillons de bois du clair au foncé',
    planLabel: 'Bois',
  },
  {
    id: 'peinture',
    numero: '06',
    titre: 'Peinture',
    accroche: 'La teinte, dans votre lumière',
    categorie: 'Peinture',
    texte:
      'Une teinte se juge dans la lumière de votre pièce. Vous définissez l’ambiance recherchée et composez votre palette, en accord avec sols, carreaux et luminaires.',
    cta: 'Composer ma palette',
    alt: 'Rendu illustratif : nuancier de cinq teintes',
    planLabel: 'Peinture',
  },
];

/** Étapes du rail et du plan : Entrée (00), les six univers (01 à 06), Méthode (07), La maison (08), Rendez-vous (09). */
export interface Etape {
  /** Ancre : /#id */
  id: string;
  numero: string;
  planLabel: string;
}

export const etapes: Etape[] = [
  { id: 'showroom', numero: '00', planLabel: 'Entrée' },
  ...salles.map(({ id, numero, planLabel }) => ({ id, numero, planLabel })),
  { id: 'methode', numero: '07', planLabel: 'La méthode' },
  { id: 'apropos', numero: '08', planLabel: 'La maison' },
  { id: 'rendez-vous', numero: '09', planLabel: 'Rendez-vous' },
];

/** Intro « porte » (calque plein écran, une fois par session). Interface seulement. */
export const intro = {
  label: 'Ouverture du showroom',
  skip: 'Cliquez pour entrer directement',
} as const;

/** Salle 00. PROPOSITION À VALIDER pour eyebrow, titre, CTA. Le H1 de la page reste porté par le hero. */
export const entree = {
  id: 'showroom',
  eyebrow: 'Toulouse · Sur rendez-vous',
  titre: 'Entrez dans le showroom',
  /** Mot du titre mis en accent. */
  accent: 'showroom',
  texte:
    'Choisissez vos matériaux, comparez vos options et posez vos questions à la personne qui suivra votre chantier. Venez avec vos idées ou un début de plan : nous les ordonnons avec vous. Vous décidez en confiance avant de lancer vos travaux.',
  /** Photo décorative : vide, la même image est décrite en salle 06. */
  alt: '',
  cta: { label: 'Commencer la visite', href: '/#cuisine' },
  rdv: { label: 'Prendre rendez-vous', href: '/#rendez-vous' },
} as const;

/** Indice de la salle Luminaires, affiché seulement avec un pointeur fin. PROPOSITION À VALIDER. */
export const indiceSouris = 'Bougez la souris : la lumière vous suit.';

/** Libellés du rail de progression, de l'indicateur « Salle 03 sur 10 » et du plan en superposition. */
export const visite = {
  rail: { ariaLabel: 'Progression de la visite, salle par salle' },
  /** Utiliser avec `salleSur(numero)`. */
  salleLabel: 'Salle',
  total: String(etapes.length),
  plan: {
    title: 'Plan du showroom',
    close: 'Fermer le plan',
    ariaOpen: 'Ouvrir le plan du showroom',
    ariaClose: 'Fermer le plan du showroom',
    ariaNav: 'Plan : accéder à une salle',
    button: 'Plan',
  },
  curseur: { entrer: 'Entrer', suivant: 'Suivant', plan: 'Plan' },
  suivante: 'Salle suivante',
  precedente: 'Salle précédente',
  versRdv: { label: 'Prendre rendez-vous', href: '/#rendez-vous' },
} as const;

/** « Salle 03 sur 10 » */
export const salleSur = (numero: string) => `${visite.salleLabel} ${numero} sur ${visite.total}`;
/** « Salle 03 » */
export const salleNumero = (numero: string) => `${visite.salleLabel} ${numero}`;
