# Experts Travaux City — Site du showroom

Site **one-page** du showroom Experts Travaux City (Toulouse). Dissocié du site principal `experts-travaux-site` pour des raisons SEO : le SEO métiers vit là-bas ; ici on reflète le showroom et on prend des **rendez-vous**. Stack : **Astro 7 + Tailwind v4**, même socle que le site principal.

## Principes (non négociables)

- **SOLID & DRY** : un composant = une responsabilité ; élément répété 2+ fois → `components/ui/`.
- **Contenu séparé du markup** : tous les textes et données dans `src/data/`.
- **Aucune valeur de style magique** : tout vient des tokens de `src/styles/global.css`.
- **Rien d'inventé** : adresse, horaires, chiffres, labels, garanties, témoignages → uniquement avec justificatif. Valeur manquante = `null` dans `site.ts` (non affichée, non émise en JSON-LD) ou « À COMPLÉTER ».
- **Incrémental** : on avance par étapes validées. On ne dévie pas de l'architecture ci-dessous sans validation explicite de Hery ; pour tout choix conséquent ou difficilement réversible, on s'arrête et on lui demande.

## Identité « Faces du cube » (différente du site principal)

Enrichie de la charte Experts Travaux (cube, Hanken Grotesk, contrastes AA) :

- **Plans de couleur** (trois faces du logo) : `face-deep` #1C1B1B, `face-dark` #2E2E2E, `face-mid` #656262, `face-light` #D9D6D1, `stone` #FAF9F9. Plans empilés à arête haute en biais (`@utility plane`), tuiles/boutons/images en parallélogrammes (`para`, `para-lg`).
- **Terracotta** : `city` #C4603C (graphismes, grands textes), `city-strong` #A34A28 (aplats avec texte blanc, texte sur fond clair), `city-on-dark` #E8946F (texte sur fond sombre).
- **Typo** : Montserrat Light (`font-display`, titres ; `font-city` pour « City »), Hanken Grotesk (texte), Anton (nom de marque dans le logo). Ni Newsreader, ni monospace, ni capitales d'étiquette.
- **Boutons** : `accent`, `primary-light`, `primary`, `secondary(-light)`.

## Architecture (validée)

```
src/
  styles/global.css      tokens, @utility plane / para / para-lg
  data/                  site, navigation, home, showroom, rdv, methode, seo, pages, legal, cookies, realisations
  lib/                   helix/tour.ts (hero 3D), jsonld, url, consent, faq-jsonld
  components/
    ui/                  Button, Section, SectionHeading, Breadcrumb, Icon, Logo
    layout/              Header, MobileMenu, Footer, Marquee, Preloader, CookieConsent, LegalPage
    sections/            Hero, Statement, Parcours, Marque, RdvSection
    sections/page/       PageIntro (pages légales)
  layouts/Layout.astro   head, polices, SEO, JSON-LD
  pages/                 index, mentions-legales, cgu, robots.txt.ts
```

Une seule page de contenu. Navigation par ancres : `/#methode` (Parcours), `/#apropos` (Marque), `/#rendez-vous` (RdvSection), `#showroom` (Statement). Pages supprimées (validé) : `/showroom/`, `/prendre-rendez-vous/`, section « Matières ».

Ordre de la page : Hero (hélice) → Statement (intro géante, mots qui s'allument au scroll) → Parcours → Marque → RdvSection → Footer. Habillage : Preloader (cube qui se dessine, une fois par session), Marquee (bandeau terracotta fixe `h-9`, header à `top-9`).

## Hero en hélice

Inspiré de la section « Uma nova perspectiva » d'azimuteresidencial.com.br (idée seulement). `src/lib/helix/tour.ts` (Three.js, chargé à la demande) : les 6 photos 16/9 de `realisations.ts` sont des cadres sur une hélice (`STEP` 1.12 rad, `PITCH` 3.05, rayon 5.25) ; une piste de défilement (`data-pin="7"` = 700 svh) pilote la caméra qui descend en spirale et marque une pause sur chaque image (`HOLD` 0.34, plage `(p - 0.1) / 0.8`). Repli sans WebGL / `prefers-reduced-motion` / Save-Data : photo plein cadre + vignettes (même composant, classe `is-3d` ajoutée si l'hélice démarre). Les vignettes servent de navigation. Réglages : constantes en tête de `tour.ts`.

## Visuels

`public/assets/city/` : six visuels 16/9 (`choix_*`). Servir les variantes `-1600.webp` ; les originaux 2752 px ne sont pas utilisés. **Ce sont des rendus illustratifs** : ne pas les présenter comme des photos du showroom ; à remplacer par de vraies photos.

## Rendez-vous

`RdvSection` poste un JSON vers un webhook **n8n** : `PUBLIC_RDV_WEBHOOK_URL` (`.env.example`). Champs : nom, email, tel, motif, date, creneau, message, consent, source, page. Champ piège anti-spam `website`. Sans URL, message de repli.

## À renseigner avant mise en ligne

`src/data/site.ts` : `url` (domaine, provisoire `city.experts-travaux.fr`), `address`, `horaires`, `phone`/`email` du showroom (repris du site principal en attendant), `indexable: true` (interrupteur unique : `false` = noindex + `Disallow: /`). `src/data/legal.ts` : éditeur, hébergeur. Webhook n8n. Textes de `home.ts`/`showroom.ts` : provisoires, à valider. Photos réelles du showroom.

## Agents (`.claude/agents/`)

Même système que le site principal, adapté à City, avec un chef d'orchestre :

- **orchestrateur** — cadre la demande, la découpe, délègue dans le bon ordre, impose `qa-review` en fin de tâche, s'arrête pour validation sur les choix conséquents. Se lance en session principale : `claude --agent orchestrateur` (ou `"agent": "orchestrateur"` dans `.claude/settings.json` pour en faire le défaut du dossier).
- **content-fr** — textes, dans `src/data/`, rien d'inventé.
- **design-system** — tokens et charte « Faces du cube ».
- **astro-builder** — composants et page (SOLID/DRY), architecture ci-dessus.
- **helix-3d** — hero en hélice : réglages, perf, replis.
- **seo-perf** — meta, JSON-LD, noindex, images, Lighthouse.
- **qa-review** — vérification finale (build, accessibilité, responsive, charte, contenu).

Ordre type : content-fr → design-system → astro-builder → helix-3d → seo-perf → **qa-review**. Toute tâche non triviale se termine par une passe qa-review.

## Développement

`npm install` · `npm run dev` · `npm run build` (`astro check` non pris en charge avec TypeScript 7 : le build fait foi).
