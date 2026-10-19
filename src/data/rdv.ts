// Prise de rendez-vous : textes du formulaire, champs et messages d'état. Aucune donnée en dur dans les composants.

export interface RdvIntro {
  title: string;
  text: string;
}

export const rdvIntro: RdvIntro = {
  title: 'Réservez votre visite du showroom',
  text: 'Indiquez-nous vos disponibilités et la nature de votre projet. Nous revenons vers vous pour confirmer le créneau.',
};

/** Confirmation animée après envoi réussi (« le cube se ferme »). Aucun délai promis. */
export const rdvConfirmation = {
  title: 'Demande transmise',
  text: 'Nous revenons vers vous pour confirmer le créneau de votre visite.',
  /** Texte alternatif de l'animation (décoratif : à utiliser en aria-label ou à masquer). */
  illustrationAlt: 'Le cube se referme : votre demande est transmise.',
} as const;

export const rdvForm = {
  /** Variable d'environnement (PUBLIC_RDV_WEBHOOK_URL) : URL du webhook n8n. Voir .env.example. */
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
    'J’accepte que ces informations soient utilisées pour répondre à ma demande de rendez-vous (voir les mentions légales).',
  submit: 'Demander ce rendez-vous',
  sending: 'Envoi en cours…',
  error: 'L’envoi a échoué. Réessayez ou contactez-nous directement par téléphone ou par e-mail.',
  unavailable: 'Le formulaire n’est pas disponible pour le moment. Contactez-nous directement par téléphone ou par e-mail.',
} as const;
