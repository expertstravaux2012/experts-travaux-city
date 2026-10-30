// Prise de rendez-vous : textes du formulaire, champs et messages d'état. Aucune donnée en dur dans les composants.

export interface RdvIntro {
  title: string;
  text: string;
}

export const rdvIntro: RdvIntro = {
  title: 'Réservez votre visite du showroom',
  text: 'Indiquez-nous vos disponibilités et la nature de votre projet. Votre demande est envoyée par e-mail à l’équipe du showroom.',
};

/** Confirmation animée après envoi réussi (« le cube se ferme »). Aucun délai promis. */
export const rdvConfirmation = {
  title: 'Demande transmise',
  text: 'Votre demande de visite a bien été envoyée par e-mail à l’équipe du showroom.',
  /** Texte alternatif de l'animation (décoratif : à utiliser en aria-label ou à masquer). */
  illustrationAlt: 'Le cube se referme : votre demande est transmise.',
} as const;

export const rdvForm = {
  /** Envoi par e-mail via Mailjet (fonction serveur Vercel) : rien n'est stocké sur le site. */
  fields: {
    nom: { label: 'Nom', placeholder: 'Votre nom' },
    email: { label: 'Email', placeholder: 'vous@exemple.fr' },
    tel: { label: 'Téléphone', placeholder: '06 12 34 56 78' },
    motif: {
      label: 'Votre projet',
      placeholder: 'Choisissez une option',
      options: [
        'Rénovation complète',
        'Extension',
        'Cuisine ou salle de bain',
        'Maison sur mesure',
        'Local professionnel',
        'Autre projet',
      ],
    },
    date: { label: 'Date souhaitée' },
    creneau: { label: 'Créneau', options: ['Matin', 'Après-midi'] },
    message: { label: 'Précisions (facultatif)', placeholder: 'Localisation, calendrier, attentes…' },
  },
  /** Champ piège anti-spam (masqué visuellement) : libellé lu par les lecteurs d'écran. */
  honeypotLabel: 'Ne pas remplir',
  consent:
    'J’accepte que ces informations soient transmises par e-mail à Experts Travaux City pour traiter ma demande de rendez-vous (voir les mentions légales).',
  submit: 'Demander ce rendez-vous',
  sending: 'Envoi en cours…',
  error: 'Votre demande n’a pas pu être envoyée. Réessayez dans un instant ou contactez-nous directement par téléphone ou par e-mail.',
} as const;
