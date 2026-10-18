# Experts Travaux City : questions pour la réunion client

Réunion de lundi. Principe du site : rien n'est écrit sans justificatif. Chaque case cochée ici débloque une valeur aujourd'hui à `null` ou « À COMPLÉTER ».

> ## Les 8 indispensables pour lundi
>
> 1. Adresse complète du showroom et lien Google Maps
> 2. Horaires jour par jour, et ouverture sur rendez-vous uniquement ou non
> 3. Ce qui est réellement exposé dans chacun des 6 univers
> 4. Vraies photos du showroom, avec les droits d'utilisation
> 5. Téléphone et email propres au showroom (ou confirmation de ceux du site principal)
> 6. Données légales de l'éditeur : raison sociale, SIRET, RCS, TVA, directeur de la publication
> 7. Nom de domaine définitif et date de mise en ligne
> 8. Confirmation écrite des affirmations reprises du site principal (« Depuis 2013 », « assureur unique du chantier », etc.)

---

## 1. Le showroom (SEO local et rendez-vous)

- [ ] Quelle est l'adresse complète du showroom ? Quel est le lien Google Maps ?
  Sert à l'affichage, au JSON-LD et au SEO local. Fichier : `src/data/site.ts` (`address`).
- [ ] Quels sont les horaires d'ouverture, jour par jour ?
  Sert à l'affichage et au JSON-LD. Fichier : `src/data/site.ts` (`horaires`).
- [ ] Le showroom est-il ouvert uniquement sur rendez-vous ?
  Conditionne le texte du hero, du formulaire et de la FAQ. Fichiers : `home.ts`, `rdv.ts`.
- [ ] Le showroom a-t-il son propre téléphone et son propre email ? Sinon, confirmez-vous 05 82 95 14 32 et contact@experts-travaux.fr ?
  Repris du site principal en attendant. Fichier : `site.ts` (`phone`, `email`).
- [ ] Comment accède-t-on au showroom : parking, transports, accessibilité PMR, étage, interphone ?
  Sert à la section contact et à la FAQ. Fichiers : `showroom.ts`, `site.ts`.
- [ ] Quels créneaux proposer pour les rendez-vous (matin, après-midi, autres) ?
  Alimente les choix du formulaire. Fichier : `rdv.ts`.
- [ ] Quel délai minimum pour prendre rendez-vous ?
  Sert à la date minimale du formulaire et au message de confirmation. Fichier : `rdv.ts`.
- [ ] Qui reçoit et traite les demandes de rendez-vous ?
  Sert à la configuration des notifications du webhook. Fichier : workflow n8n.
- [ ] Les motifs du formulaire sont-ils les bons : rénovation complète, extension, cuisine ou salle de bain, maison sur mesure, local professionnel, autre ?
  Sert à la liste déroulante. Fichier : `rdv.ts`.

## 2. Ce qui est réellement exposé au showroom

Sert à étoffer les textes sans rien inventer. Fichiers : `showroom.ts`, `home.ts`, `realisations.ts`.

- [ ] Cuisine : qu'est-ce qui est présenté (plans, mises en situation, échantillons, ambiances) ?
- [ ] Salle de bain : qu'est-ce qui est présenté ?
- [ ] Luminaires : qu'est-ce qui est présenté ? Y a-t-il des échantillons ?
- [ ] Carreaux : qu'est-ce qui est présenté ? Y a-t-il des échantillons de carrelage ?
- [ ] Bois : qu'est-ce qui est présenté ? Y a-t-il des échantillons de parquet ?
- [ ] Peinture : y a-t-il un nuancier ? Qu'est-ce qui est présenté d'autre ?
- [ ] Des marques ou des gammes peuvent-elles être citées ? Lesquelles, et avec quelle autorisation ?
- [ ] Quelle est la durée moyenne d'une visite ?
- [ ] Que faut-il apporter (plans, photos, métrés) ?
- [ ] La visite est-elle gratuite et sans engagement ?
- [ ] Peut-on venir sans rendez-vous ?

## 3. Photos et visuels

Les visuels actuels (`public/assets/city/`) sont des rendus illustratifs, pas des photos du showroom.

- [ ] Peut-on obtenir de vraies photos : extérieur, façade, intérieur, chacun des 6 univers ?
  Remplacent les rendus du hero en hélice. Fichiers : `public/assets/city/`, `realisations.ts`.
- [ ] Qui prend les photos, et quand ? Quels sont les droits d'utilisation ? Peut-on les avoir en haute définition ?
  Sert à fixer le calendrier de mise en ligne.
- [ ] Peut-on avoir le logo complet en SVG, avec le wordmark Experts Travaux City, et les fichiers de police ?
  Sert à l'image de partage (Open Graph). Fichiers : composant `Logo`, `seo.ts`.
- [ ] Le visuel de partage actuel (logo cube sur fond sombre) convient-il ?
  Sert aux aperçus sur les réseaux et messageries. Fichier : `seo.ts`.
- [ ] Souhaitez-vous une photo de l'équipe ou du responsable du showroom ? (optionnel)
  Sert à la section Marque. Fichier : `home.ts`.

## 4. FAQ (option B du SEO)

Questions à poser telles quelles. Sert à la FAQ de la page et au balisage associé. Fichiers : `seo.ts`, `lib/faq-jsonld.ts`.

- [ ] Le showroom est-il ouvert sans rendez-vous ?
- [ ] Où se trouve-t-il et comment s'y rendre ?
- [ ] Quels sont les horaires ?
- [ ] Que peut-on voir et choisir sur place ?
- [ ] Combien de temps dure une visite et que faut-il apporter ?
- [ ] La visite est-elle gratuite et sans engagement ?

Déjà documentées, à faire confirmer seulement :
- [ ] « Qui suit mon chantier après le rendez-vous ? »
- [ ] « Quelle zone autour de Toulouse ? »

## 5. Mentions légales et RGPD

Fichier : `src/data/legal.ts` (champs « À COMPLÉTER »).

- [ ] Éditeur : raison sociale, forme juridique, capital, adresse du siège ?
- [ ] Éditeur : SIRET, RCS, TVA intracommunautaire ?
- [ ] Qui est le directeur de la publication ? Quel contact indiquer ?
- [ ] Hébergeur : nom, adresse, téléphone ?
- [ ] Médiateur de la consommation (nom, site) : applicable ?
- [ ] Durée de conservation des demandes de rendez-vous : « trois ans » est écrit aujourd'hui sans justificatif. Quelle durée retenir ?
- [ ] Base légale : « mesures précontractuelles » est écrit aujourd'hui. Le client ou son juriste la valide-t-il ?
- [ ] Y a-t-il un DPO ou un contact RGPD ?
- [ ] Le client fera-t-il relire les mentions légales et les CGU par son juriste ? Pour quand ?
- [ ] Quels outils de mesure ou de publicité seront installés (Google Analytics, Meta Pixel, autres) ?
  Sert à paramétrer le bandeau de consentement. Fichiers : `cookies.ts`, `lib/consent`.

## 6. Lancement et référencement

- [ ] Quel est le nom de domaine définitif (aujourd'hui provisoire : `city.experts-travaux.fr`) ? Qui gère le DNS ?
  Fichier : `site.ts` (`url`).
- [ ] Quelle date de mise en ligne souhaitée ?
  Sert à basculer `indexable: true`. Fichier : `site.ts`.
- [ ] Les pages légales doivent-elles rester en noindex ?
  Fichiers : `pages.ts`, `legal.ts`.
- [ ] Existe-t-il une fiche Google Business Profile pour le showroom ? Sinon, qui la crée ?
  Nom, adresse et téléphone doivent être identiques à ceux du site.
- [ ] Qui ajoute des liens depuis experts-travaux.fr vers le showroom, et où ?
  Sert au maillage et à l'autorité du domaine.
- [ ] Quelles URL exactes du site principal cibler pour les liens depuis le showroom (cuisine, salle de bain, rénovation complète, extension, autres) ?
  Évite de dupliquer les mots-clés métiers. Fichiers : `home.ts`, `showroom.ts`.
- [ ] Les liens LinkedIn et Instagram actuels sont-ils ceux du showroom ? Y a-t-il d'autres réseaux ?
  Fichiers : `site.ts`, JSON-LD.

## 7. Validation des textes et promesses

- [ ] Le client relit-il tous les textes : `home.ts`, `methode.ts`, `showroom.ts`, `seo.ts` ? Pour quand ?
- [ ] Le client confirme-t-il par écrit ces affirmations reprises du site principal ?
  - [ ] « Depuis 2013 »
  - [ ] « Interlocuteur unique »
  - [ ] « Assureur unique du chantier »
  - [ ] « Devis détaillé validé avant tout démarrage »
  - [ ] « Toulouse et 100 km alentour »
  - [ ] Slogan « Maison de confiance »
- [ ] Quels sont le ton et le vocabulaire souhaités ? Y a-t-il des mots à éviter ou des concurrents à ne pas nommer ?

## 8. Technique (côté Hery, à ne pas poser au client)

- [ ] Webhook n8n : créer le workflow et renseigner `PUBLIC_RDV_WEBHOOK_URL`.
- [ ] Tester l'envoi de bout en bout : champs reçus, `consent: "on"`, CORS, notifications.
- [ ] Choisir l'hébergement et le déploiement du site Astro ; vérifier le certificat HTTPS.
- [ ] Tester dans un navigateur à 390, 768 et 1440 px : hélice 3D, menu mobile, bandeau cookies, focus clavier.
- [ ] Décider selon la FAQ : supprimer ou compléter `lib/faq-jsonld.ts`.

---

## Si le client ne peut répondre qu'à 5 choses lundi

1. L'adresse (avec lien Google Maps)
2. Les horaires
3. Ce qui est exposé dans chaque univers
4. Les photos (et qui les prend, quand)
5. Les données des mentions légales
