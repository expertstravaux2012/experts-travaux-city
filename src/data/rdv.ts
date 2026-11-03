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

export interface RdvAccuse {
  subject: string;
  preheader: string;
  title: string;
  intro: string;
  recapTitle: string;
  /** Libellés des lignes du récapitulatif : repris du formulaire pour rester identiques. */
  recapLabels: { motif: string; date: string; creneau: string };
  nextStepsTitle: string;
  nextSteps: string;
  /** Délai de réponse : « sous 48 h », validé par Hery. `null` = non affiché (aucune durée promise). */
  delai: string | null;
  button: string;
  signature: string;
  footerNote: string;
}

/** E-mail d'accusé de réception envoyé au visiteur après sa demande (adresse, horaires et téléphone : lus dans site.ts par le code). */
export const accuse: RdvAccuse = {
  subject: 'Votre demande de rendez-vous à Experts Travaux City',
  preheader: 'Nous avons bien reçu votre demande de visite du showroom.',
  title: 'Votre demande est bien reçue',
  intro:
    'Merci d’avoir pris contact avec Experts Travaux City. Votre demande de visite du showroom est bien arrivée auprès de notre équipe.',
  recapTitle: 'Votre demande',
  recapLabels: {
    motif: rdvForm.fields.motif.label,
    date: rdvForm.fields.date.label,
    creneau: rdvForm.fields.creneau.label,
  },
  nextStepsTitle: 'Et ensuite ?',
  nextSteps:
    'L’équipe revient vers vous pour confirmer la date et le créneau de votre rendez-vous.',
  delai: 'Vous recevez notre réponse sous 48 h.',
  button: 'Découvrir le showroom',
  signature: 'L’équipe Experts Travaux City',
  footerNote:
    'Cet e-mail est envoyé automatiquement après votre demande. Pour nous joindre, répondez simplement à ce message.',
};
