// Section Méthode — parcours client depuis le showroom. Garanties, labels, délais et « gratuit » : uniquement avec justificatif.

export interface Etape {
  numero: string;
  titre: string;
  description: string;
}

export const etapes: Etape[] = [
  { numero: '01', titre: 'Rendez-vous', description: 'Vous choisissez un créneau, nous confirmons votre visite du showroom.' },
  { numero: '02', titre: 'Échange au showroom', description: 'Vous présentez votre projet à un interlocuteur unique, qui vous expose notre façon de travailler.' },
  { numero: '03', titre: 'Visite & devis détaillé', description: 'Nous venons sur place évaluer la faisabilité, puis établissons un devis détaillé.' },
  { numero: '04', titre: 'Chantier & livraison', description: 'Un chantier piloté par le même interlocuteur, jusqu’à la réception avec vous.' },
];

export const cubeIllustration = {
  label: 'Illustration d’un cube qui se construit, une face après l’autre, au fil des quatre étapes de la méthode.',
} as const;

export interface Garantie {
  titre: string;
  description: string;
}

export const garanties: Garantie[] = [
  { titre: 'Interlocuteur unique', description: 'La même personne, du premier échange à la livraison.' },
  { titre: 'Assureur unique du chantier', description: 'Un seul assureur pour l’ensemble des corps de métier.' },
  { titre: 'Devis détaillé', description: 'Un chiffrage clair, validé avant tout démarrage.' },
];

/** Fragment du H2 `methodeSection.title` mis en accent (doit en être une sous-chaîne exacte). */
export const methodeAccent = 'remise des clés';
