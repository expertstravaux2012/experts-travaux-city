// Données légales et textes des pages Mentions légales / CGU.
// Toute valeur non fournie par le client vaut `legalPlaceholder` (surlignée au rendu) : ne jamais l'inventer.
// Textes à faire relire juridiquement avant mise en ligne (site.indexable = true).
import { site } from './site';

export const legalPlaceholder = 'À COMPLÉTER';

export const legal = {
  /** Date de dernière mise à jour des textes (ISO). */
  updatedAt: '2026-10-30',
  editeur: {
    raisonSociale: 'EXPERTS TRAVAUX',
    formeJuridique: 'SARL',
    capital: '10 890 €',
    siret: '790 215 792 00017',
    rcs: '790 215 792 R.C.S. Toulouse',
    tvaIntracommunautaire: 'FR77790215792',
    directeurPublication: 'Ugo Segard',
  },
  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    contact: 'https://vercel.com/contact',
  },
  /** Durée de conservation des données de contact après le dernier échange. */
  conservationDonnees: 'trois ans',
};

export const legalLabels = {
  toc: 'Sommaire',
  updated: 'Dernière mise à jour :',
};

export const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'CGU', href: '/cgu/' },
] as const;

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  /** Affiche le bouton qui ouvre le panneau de préférences cookies. */
  cookieSettings?: boolean;
}

export interface LegalDocument {
  h1: string;
  intro: string;
  sections: LegalSection[];
}

const e = legal.editeur;
const h = legal.hebergeur;
const host = site.url.replace(/^https?:\/\//, '');

export const mentionsLegales: LegalDocument = {
  h1: 'Mentions légales',
  intro: `Informations relatives à l’éditeur, à l’hébergement et à l’utilisation des données du site ${site.name}.`,
  sections: [
    {
      id: 'editeur',
      title: 'Éditeur du site',
      paragraphs: [
        `Le site ${host} est édité par ${e.raisonSociale}, ${e.formeJuridique} au capital de ${e.capital}.`,
        `Siège social : ${site.address ? `${site.address.street}, ${site.address.city}` : legalPlaceholder}.`,
        `SIRET : ${e.siret} · RCS : ${e.rcs} · TVA intracommunautaire : ${e.tvaIntracommunautaire}.`,
        `Contact : ${site.email} · ${site.phone.display}.`,
        `Directeur de la publication : ${e.directeurPublication}.`,
      ],
    },
    {
      id: 'hebergement',
      title: 'Hébergement',
      paragraphs: [`Le site est hébergé par ${h.nom}, ${h.adresse}. Contact : ${h.contact}.`],
    },
    {
      id: 'propriete-intellectuelle',
      title: 'Propriété intellectuelle',
      paragraphs: [
        `L’ensemble des contenus du site (textes, photographies, visuels, logo, structure) est la propriété exclusive de ${site.name} ou de ses partenaires et est protégé par le droit de la propriété intellectuelle.`,
        'Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable est interdite.',
      ],
    },
    {
      id: 'donnees-personnelles',
      title: 'Données personnelles',
      paragraphs: [
        `Le responsable du traitement est ${e.raisonSociale}, dont les coordonnées figurent ci-dessus.`,
        'Les données saisies dans le formulaire de rendez-vous (nom, adresse e-mail, téléphone, nature du projet, date et créneau souhaités, précisions) sont utilisées uniquement pour répondre à votre demande, confirmer votre visite du showroom et, le cas échéant, établir un devis. La base légale est l’exécution de mesures précontractuelles prises à votre demande.',
        `Ces informations sont transmises par e-mail à ${site.name} via le prestataire d’envoi Mailjet, qui agit en qualité de sous-traitant. Le site ne les conserve pas : aucune donnée du formulaire n’y est stockée.`,
        `Côté ${site.name}, elles sont conservées le temps nécessaire au traitement de votre demande, puis au plus ${legal.conservationDonnees} à compter du dernier échange. Elles ne sont ni vendues ni cédées à des tiers.`,
        `Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données. Pour l’exercer, écrivez à ${site.email}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (www.cnil.fr).`,
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies et traceurs',
      paragraphs: [
        'Le site ne dépose aucun cookie de mesure d’audience ou de publicité sans votre consentement préalable. Les seuls éléments enregistrés par défaut sont strictement nécessaires au fonctionnement du site, dont la mémorisation de votre choix.',
        'Votre choix est conservé six mois ; vous pouvez le modifier à tout moment.',
      ],
      cookieSettings: true,
    },
  ],
};

export const cgu: LegalDocument = {
  h1: 'Conditions générales d’utilisation',
  intro: `Règles d’accès et d’utilisation du site ${site.name}. En naviguant sur le site, vous les acceptez.`,
  sections: [
    {
      id: 'objet',
      title: 'Objet',
      paragraphs: [
        `Les présentes conditions générales d’utilisation (CGU) encadrent l’accès et l’utilisation du site ${host}, édité par ${e.raisonSociale} (voir les mentions légales).`,
        `Le site présente le showroom ${site.name}, rattaché à ${site.parent.name} (rénovation et bâtiment à Toulouse et dans sa région), et permet de demander un rendez-vous ou un renseignement.`,
      ],
    },
    {
      id: 'acces',
      title: 'Accès au site',
      paragraphs: [
        'Le site est accessible gratuitement à tout utilisateur disposant d’un accès à Internet. Les frais d’accès (matériel, connexion) restent à sa charge.',
        `${site.name} s’efforce d’assurer la disponibilité du site mais peut l’interrompre à tout moment, notamment pour maintenance, sans préavis ni indemnité.`,
      ],
    },
    {
      id: 'contenus',
      title: 'Contenus et informations',
      paragraphs: [
        'Les informations publiées sur le site (descriptions de prestations, réalisations, délais, zone d’intervention) ont une valeur indicative et ne constituent pas une offre contractuelle. Seul un devis établi puis accepté par écrit engage les parties.',
      ],
    },
    {
      id: 'usage',
      title: 'Utilisation du site',
      paragraphs: [
        'L’utilisateur s’engage à utiliser le site de manière loyale, sans porter atteinte à son fonctionnement ni à sa sécurité (intrusion, extraction automatisée de contenus, transmission de code malveillant), et à ne transmettre par le formulaire que des informations exactes le concernant.',
      ],
    },
    {
      id: 'propriete-intellectuelle',
      title: 'Propriété intellectuelle',
      paragraphs: [
        'Le site et ses contenus sont protégés par le droit de la propriété intellectuelle (voir les mentions légales). Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.',
      ],
    },
    {
      id: 'responsabilite',
      title: 'Responsabilité',
      paragraphs: [
        `${site.name} ne saurait être tenu responsable des dommages directs ou indirects résultant de l’accès au site, de son indisponibilité ou de l’utilisation des informations qu’il contient, sauf faute lourde ou dol.`,
        'L’utilisateur reste responsable de la protection de son matériel et de ses données.',
      ],
    },
    {
      id: 'liens',
      title: 'Liens hypertextes',
      paragraphs: [
        `Le site peut renvoyer vers des sites tiers (réseaux sociaux, cartographie). ${site.name} n’exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard.`,
      ],
    },
    {
      id: 'donnees-personnelles',
      title: 'Données personnelles',
      paragraphs: [
        'Le traitement des données personnelles collectées via le site est décrit dans les mentions légales (section « Données personnelles »), qui précisent vos droits et les modalités pour les exercer.',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      paragraphs: [
        'Le site ne dépose aucun cookie de mesure d’audience ou de publicité sans votre consentement. Vous pouvez gérer vos choix à tout moment.',
      ],
      cookieSettings: true,
    },
    {
      id: 'modification',
      title: 'Modification des CGU',
      paragraphs: [
        `${site.name} peut modifier les présentes CGU à tout moment. La version applicable est celle publiée sur le site à la date de la visite ; la date de dernière mise à jour figure en tête de page.`,
      ],
    },
    {
      id: 'droit-applicable',
      title: 'Droit applicable',
      paragraphs: [
        'Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relève des tribunaux compétents, après tentative de résolution amiable.',
      ],
    },
  ],
};
