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
- **Terracotta** : `city` #B24824 (couleur du logo, mesurée sur « City » ; aplats avec texte stone 5,2:1, graphismes, grands textes), `city-strong` (alias de `city`, nom conservé), `city-on-dark` #E8946F (texte sur fond sombre).
- **Typo** : Montserrat Light (`font-display`, titres), Hanken Grotesk (texte), Anton (`font-wordmark`, nom de marque dans le logo), Libre Caslon Text Italic 400 (`font-city`, uniquement le mot « City » : logo, H1 de l'Entrée, hero), Oswald Light 300 (`font-slogan`, `text-slogan`, uniquement le slogan du logo). Ni Newsreader, ni monospace, ni capitales d'étiquette : seule exception validée, le slogan du logo en capitales condensées interlettrées (`tracking-slogan` 0,3em).
- **Boutons** : `accent`, `primary-light`, `primary`, `secondary(-light)`.
- **Écarts validés par Hery** (exceptions explicites à « pas d'ombre » et « tout en parallélogrammes ») :
  - `shadow-floating` (hairline + ombre portée douce) : seule ombre autorisée, élévation de la carte du formulaire (RdvSection).
  - Carte du formulaire **rectangulaire** (ni `para` ni `para-lg`) : le `clip-path` couperait l'ombre.
  - `RdvSection` : fond `city-strong` en plein plan (texte `on-accent`, 5,2:1).
- **Salles** (séquence de 6, validée) : gabarit `salle-frame` + `salle-dark` (face-dark / stone) ou `salle-light` (face-light / on-surface), alternés et combinés à `plane`. Numéro géant `text-salle-number` + `salle-number-outline` (décoratif, `aria-hidden`). Rail `rail-bar` / `rail-link` (état actif via `aria-current`, `city-on-dark` sur fond `face-deep` propre au rail), plan en superposition `plan-overlay`, porte entre salles `porte` / `porte-battant-left` / `porte-battant-right` / `porte-filet` (option B validée, voir ci-dessous). Tokens `--porte-*`, `--salle-*`, `--rail-*`, `--plan-*`, `--z-rail`, `--z-plan` dans `global.css`.
- **Maquette, option A (scroll natif, écarts validés par Hery)** :
  - Salle `salle-frame` : **photo plein cadre** (`salle-photo`) + **voile** (`salle-scrim` décoratif, face-deep 35 % : aucun texte directement sur la photo) + **panneau en biais** `salle-panel` (face-deep 88 % en `salle-dark`, face-light 92 % en `salle-light`, alternance conservée ; côté via `data-side`). Texte courant toujours dans le panneau (stone 11,3:1 / on-surface 10,1:1) ; accent `salle-accent` = city-on-dark (sombre) ou city-strong (clair, titre seulement).
  - **Numéro en contour** `salle-number-outline` (stone 50 %, `aria-hidden`, décoratif, exempté de contraste) à la place du numéro plein pour les salles.
  - **Curseur d'accompagnement** (`cursor-follower`, anneau en parallélogramme, pas de cercle) : le curseur natif reste visible ; absent au toucher et en reduced-motion.
  - **Pas de `backdrop-filter`** : les panneaux ne sont pas floutés, le contraste ne dépend que du voile. Variante compacte `salle-panel-compact` (< md : hauteur plafonnée en svh, voile 86 % / 92 %, photo visible). Bouton **Plan** dans le header (`plan-trigger` + `para`, cible 44 px), plus de bouton fixe en bas à gauche.
  - Parallaxe souris (`--mx`/`--my`, `--parallax-*`) et calque de lumière (`salle-light-layer`, transform d'un calque pré-rendu) : même garde, états finaux sans animation sinon. Rail horizontal en bas `rail-bar` (>= md, `--spacing-rail`), plan `plan-grid` / `plan-cell` (10 cases), intro porte `intro*` (CSS pur, 1,4 s, `--dur-intro-*`). Les anciens `door*` sont supprimés (`--door-skew` renommé `--intro-skew`).
  - **Porte entre salles (option B, validée)** : `<div class="porte" aria-hidden="true" data-porte="first|mid|last">` enfant de `salle-frame` (dernier du DOM de la salle), avec `porte-battant-left` (face-deep) et `porte-battant-right` (face-dark), chacun contenant `<span class="porte-filet">` (city-on-dark, sans texte, sans libellé). Pilotée par la timeline `--salle` : `porte-in` (entrée, `--porte-range-in-*` = `entry 50%`-`entry 90%`, fermée avant `entry 50%`, puis ouverte) et `porte-out` (sortie, `--porte-range-out-*` = `exit 0%`-`exit 35%`, ouverte vers fermée, tenue fermée après `exit 35%`) : plages finales, sortante exit 0-35 %, entrante entry 50-90 % ; marge de 15 % de la fenêtre (~135 px à 900 px) où les deux sont fermées (validé après mesure QA : exit 50 % laissait un liseré de 20-40 px, exit 40 % 9 px de marge). À mi-jointure tout l'écran est couvert par des battants fermés, puis la salle suivante s'ouvre (fin d'entrée à 90 % pour que l'arrivée par ancre, ~87 %, soit ouverte ; Entrée au chargement ouverte, dernière salle jamais refermée). Le battant gauche garde son hairline de recouvrement. Côté composants : `ui/Porte.astro` (le markup ci-dessus, prop `position`) ; `Section` accepte `porte="mid|last"` (rend `Porte` et ajoute la classe `section-porte` : `isolation: isolate`, `overflow: clip`, `view-timeline: --salle` ; `Salle` fournit déjà ce cadre via `salle-frame`) ; `data-porte` : `first` = sortie seule, `last` = entrée seule, `mid` = les deux. `transform` seul (clip-path statique, diagonale 56 %/44 %, ouverture ±75 %, `--ease-porte`), `pointer-events: none`, `z-porte` 30 (contexte local de la salle, sous rail/header/plan/intro/curseur). **Sous md (< 768 px)** : `--porte-view-inset: 0` (la timeline `--salle` ignore scroll-padding : le bandeau cookies, ~26rem, réduisait sinon la zone de scroll de ~40 % et les portes passaient en ~100 px ; desktop = `auto`, inchangé). Plages en longueur `cover` (svh), identiques quelle que soit la hauteur de la section : entrante fermée tant que son haut est sous 86 svh (`cover 14svh`), ouverte à 70 svh (`cover 30svh`) ; sortante ouverte tant que son bas est sous 30 svh, fermée à 14 svh. Les portes ne couvrent que le bord de l'écran : plus de fermeture totale à mi-jointure sous md, couverture maximale ~70 % (resserré après retour sur iPhone 13, où les portes cachaient le texte des salles ; couverture moyenne ~6 %, ~7 % du défilement avec plus de 25 % de l'écran couvert). Sections hautes (`Section tall` -> `data-porte-tall` : Parcours, Marque, Rendez-vous) : jambes de `--porte-tall-span` (20 svh) finissant à `--porte-tall-end` (chrome + 2rem : une ancre arrive ouverte) ; les cartes 01-04 du Parcours ont quitté l'écran avant la fermeture, la dernière garantie, en fin de section, reste en partie visible pendant qu'elle se ferme (~80 % de fermeture à 390x844 ; remonter `--porte-tall-end` de 10 svh l'aggrave : 100 %), la jointure Parcours -> Marque dure ~100 px comme une salle (avant 270 à 560 px). Hors `animation-timeline: view()` ou en reduced-motion : `display: none` (contenu intact). Aucune hauteur ajoutée.
- **Breakpoints** : Tailwind par défaut (`sm` 40rem, `md` 48rem…) + `desktop` 75rem, `wide` 90rem et `xs` 26rem (416 px, `--breakpoint-xs`, ex. masquer le slogan du logo en dessous : `max-xs:sr-only` : le slogan reste lisible par les lecteurs d'écran, et non `max-xs:hidden`), + `narrow` 23.4375rem (375 px, `--breakpoint-narrow`, utilisé en CSS dans `plan-cell` : sous 375 px, nom de case en `--text-plan-cell-narrow`, retour à la ligne et césure autorisés).
- **Plan (mosaïque)** : `plan-grid` / `plan-cell` (10 cases). Chaque case reçoit sa zone via `style="--aire:x"` et `md:[grid-area:var(--aire)]!`. Zones md+ (4 colonnes) : `e e c s / l l c k / b b p k / m m m m / a a a a / r r r r` (e entrée, c carreaux, s, l luminaires, k cuisine, b, p peinture, m, a, r). Ordre de lecture = ordre du DOM = ordre de tab = 00 à 09 sur tous les formats (aucun `order`, seules les zones placent). Sous md : 2 colonnes, première case et cases 08-10 en pleine largeur.
- **Contrastes à respecter** : `city` (= `city-strong`) en aplat portant du texte stone (5,2:1), graphisme ou grand texte seulement ; sur `face-light` (3,8:1) et sous le panneau clair (3,0 à 3,2:1) : grands textes et graphismes uniquement ; sur fond sombre (face-deep 3,1:1, face-dark 2,5:1) : décor seulement, le texte passe en `city-on-dark` ; texte courant sur `face-light` = `on-surface`. `face-mid` n'est pas une couleur de texte ni de trait sur fond sombre (2,8:1 sur face-deep).

## Architecture (validée)

```
src/
  styles/global.css      tokens, @utility plane / para / para-lg
  data/                  site, navigation, home, showroom, rdv, methode, seo, pages, legal, cookies, realisations, salles
  lib/                   helix/tour.ts (hero 3D), jsonld, url, consent, faq-jsonld
  components/
    ui/                  Button, Section (prop porte), Breadcrumb, Icon, Logo, Cube, Salle, SalleLabel, SalleScene, Pastille, Porte
    layout/              Header, MobileMenu, Footer, Marquee, Preloader, CookieConsent, LegalPage, PorteIntro, CurseurSuivi, RailSalles, PlanSalles
    sections/            Hero (hélice, derrière showHelix), Entree, Salles, Parcours, Marque, RdvSection
    sections/page/       PageIntro (pages légales)
  layouts/Layout.astro   head, polices, SEO, JSON-LD
  pages/                 index, mentions-legales, cgu, robots.txt.ts
```

Une seule page de contenu. Navigation par ancres : `/#methode` (Parcours), `/#apropos` (Marque), `/#rendez-vous` (RdvSection), `#showroom` (Entrée). Pages supprimées (validé) : `/showroom/`, `/prendre-rendez-vous/`, section « Matières ».

Ordre de la page : PorteIntro (intro CSS, une fois par session) → Entrée (salle 00, porte le H1 ; remplacée par Hero/hélice si `showHelix`) → Salles 01–06 (`sections/Salles`, `ui/Salle` = cadre, données `data/salles.ts`) → Parcours → Marque → RdvSection → Footer, avec Rail horizontal (progression), Plan des salles et CurseurSuivi montés en fin de page. Habillage : Marquee (bandeau terracotta fixe `h-9`, header à `top-9`). Preloader (cube) : voir Layout.

## Hero en hélice

Inspiré de la section « Uma nova perspectiva » d'azimuteresidencial.com.br (idée seulement). `src/lib/helix/tour.ts` (Three.js, chargé à la demande) : les 6 photos 16/9 de `realisations.ts` sont des cadres sur une hélice (`STEP` 1.12 rad, `PITCH` 3.05, rayon 5.25) ; une piste de défilement (`data-pin="7"` = 700 svh) pilote la caméra qui descend en spirale et marque une pause sur chaque image (`HOLD` 0.34, plage `(p - 0.1) / 0.8`). Repli sans WebGL / `prefers-reduced-motion` / Save-Data : photo plein cadre + vignettes (même composant, classe `is-3d` ajoutée si l'hélice démarre). Les vignettes servent de navigation. Réglages : constantes en tête de `tour.ts`.

## Visuels

`public/assets/city/` : six visuels 16/9 (`choix_*`). Servir les variantes `-1600.webp` ; les originaux 2752 px ne sont pas utilisés. Le fond de l'Entrée est une **vraie photo du showroom** (variantes `showroom-experts-travaux-city*.webp`, original dans `docs/photos/`). **Les six `choix_*` restent des rendus illustratifs** : ne pas les présenter comme des photos du showroom ; à remplacer par de vraies photos.

## Rendez-vous

`RdvSection` poste un JSON vers la fonction Vercel `api/rdv.ts` (logique pure dans `src/lib/rdv-mail.ts`), qui envoie un e-mail via **Mailjet** (`MAILJET_API_KEY`, `MAILJET_API_SECRET`, `MAILJET_SENDER_EMAIL`, `RDV_TO_EMAIL` optionnel ; `.env.example`). Rien n'est stocké. Champs : nom, email, tel, motif, date, creneau, message, consent, source, page. Champ piège anti-spam `website`. En `astro dev`, `/api` n'est pas servi (erreur normale affichée) : utiliser `vercel dev`.

## À renseigner avant mise en ligne

`src/data/site.ts` : `url` (domaine définitif `city.experts-travaux.fr`), `address` et `horaires` renseignés (31 Rue du Rempart Matabiau, 31000 Toulouse ; lundi sur rendez-vous, mardi–samedi 11h–19h, dimanche fermé), `phone` 05 82 95 14 32 confirmé, `email` contact@experts-travaux.fr conservé, `indexable` (interrupteur unique, reste `false` jusqu'à décision de Hery : `false` = noindex + `Disallow: /`), `showHelix` (interrupteur unique, `false` par défaut : Entrée en salle 00 ; `true` = hélice 3D à la place de l'Entrée, `tour.ts` n'est chargé que dans ce cas). `src/data/legal.ts` : éditeur, hébergeur. Variables Mailjet dans Vercel (MAILJET_API_KEY, MAILJET_API_SECRET, MAILJET_SENDER_EMAIL). Textes de `home.ts`/`showroom.ts` : provisoires, à valider. Photos réelles du showroom.

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
