# Maquette : transition « porte » entre salles (analyse et transposition en scroll natif)

Statut : analyse, aucun code de production touché. Source : `Showroom Experts Travaux City.html` (template + script `Component`) rendu dans Chrome headless (Playwright). Captures : `scratchpad/trans/` (≈ 700 JPEG, `{1440|390}-{a-entree-1|b-3-4|c-6-7-methode|d-8-9-rdv}-NN-{t}ms.jpg`, une image toutes les 30 à 70 ms sur 2,3 s ; scripts `tr.mjs`, `tr2.mjs`, mesures `tr.json`). Les valeurs ci-dessous sont lues dans le code et confirmées par échantillonnage de `getComputedStyle` (porte à 0 / 129 / 259 / 386 / 511 / 636 ms, etc.).

## 1. Ce que fait la maquette

### Déclencheur
`go(i)` : molette (verrou 1,2 s, seuil `deltaY` 12), flèches/PageUp/PageDown/espace, touches 0-9, balayage horizontal > 70 px, rail, boutons « Entrer », plan. Un seul `busy` (1,45 s) empêche tout chevauchement. Aucune notion de direction : aller en arrière, avancer d'une salle ou sauter de 1 à 9 donne **exactement la même porte** (pas de porte intermédiaire). Mode par défaut `transition: 'porte'` ; deux autres modes existent mais ne sont pas utilisés (`fondu` : salle `scale(1.06 → 1)` 1 s ; `travelling` : salle `translateX(±18vw → 0)` 1 s ; sans porte, sans délai d'entrée).

### Chronologie (t = 0 au clic, identique à 1440 et 390 px)

| t (ms) | Événement |
|---|---|
| 0 | `door: closed` : panneaux G/D `translateX(∓75 % → 0)`, 620 ms, `cubic-bezier(.77,0,.18,1)` (mesuré : -1080 px à 0 ms, -840 à 259, -152 à 386, 0 à ~600). Libellé central fondu 0 → 1 en 250 ms (`opacity .25s ease`). `pointer-events: auto` sur la porte : les clics sont bloqués. |
| ~600 | Porte fermée (diagonale visible au centre, libellé « SALLE 0N » + nom). |
| 680 | `cur = i` : l'ancienne salle `opacity 1 → 0`, la nouvelle `0 → 1` (700 ms `ease`, z-index 2 vs 1), `scrollTop` de la salle remise à 0. Tout se passe derrière la porte (mesuré : `r1` 0,09 à 764 ms, 0,48 à 888, 1 à ~1400 ; la porte rouvre dès 950 ms, donc le fondu se termine sous les panneaux qui s'écartent). Les éléments de l'entrée sont encore à l'état « avant » (`rev` faux). |
| 950 | `door: open` : panneaux `translateX(0 → ∓75 %)`, mêmes 620 ms et même easing (mesuré : -4 px à 1013, -88 à 1138, -553 à 1263, -1002 à 1388, -1080 à ~1600). Libellé `opacity → 0` (250 ms). `pointer-events: none` immédiat. `rev = true` : démarrent les entrées de la salle (ci-dessous). |
| 1450 | `busy` levé (une nouvelle navigation est possible, la porte précédente est finie à ~1570 : léger chevauchement toléré). |
| ~3350 | Dernière entrée terminée (fond `scale` 2,4 s, démarré à 950). |

Durée perçue de la porte : 1,6 s (fermeture 0,6 s + rouverture 0,6 s décalée à 0,95 s). Les entrées de salle durent jusqu'à 2,4 s.

### La porte (`aria-hidden`, `position:absolute; inset:0; z-index:40`)
- **Panneau gauche** : `#1b1b1b`, `inset:0`, `clip-path: polygon(0 0, 56% 0, 44% 100%, 0 100%)`. **Panneau droit** : `#232323`, `clip-path: polygon(56% 0, 100% 0, 100% 100%, 44% 100%)`. Les deux couvrent tout l'écran ; seule la découpe statique diffère. Fermés, ils se rejoignent sur une diagonale (haut à 56 %, bas à 44 % : biais = 12 % de la largeur, soit ≈ 173 px à 1440 et ≈ 47 px à 390).
- Chaque panneau : un filet terracotta `#a84b2b`, 3 × 70 px, `skewX(-6deg)`, centré verticalement, à `44 % - 40px` (G) et `56 % + 37px` (D) : il voyage avec le panneau.
- Libellé centré : « SALLE 0N » (Hanken 600 12 px, interlettrage .2em, `#e3916a`) + nom de la **salle cible** (Montserrat 200, `clamp(44px, 7vw, 110px)`, blanc). Texte déjà mis à jour avant fermeture (`target` posé au clic).
- **Pas de thème par salle** : mêmes deux gris et même filet pour les 10 salles (vérifié visuellement sur 4 transitions). Seul le libellé change.
- Direction : G sort vers la gauche, D vers la droite (ouverture « en deux battants »), jamais verticale. À l'ouverture les panneaux sortent entièrement (±75 % de la largeur suffit car chaque polygone ne couvre que 56 % / 56 %).

### Ce qui est révélé (état avant → après, déclenché par `rev = (salle courante && porte ouverte)`)
| Élément | Avant | Après | Durée / délai / easing |
|---|---|---|---|
| Fond photo (calque `inset:-6%`) | `scale(1.18)` | `scale(1)` | 2,4 s, `cubic-bezier(.2,.7,.1,1)` (+ parallaxe souris `-30px/-20px`) |
| Panneau de contenu (plan en biais) | `opacity 0`, `translateY(50px)` | `1`, `0` | opacité .9 s / transform 1,1 s, délai .3 s, `(.2,.7,.1,1)` |
| Encart secondaire (liste « Six univers », etc.) | idem | idem | délai .6 s |
| Titre, 2 lignes masquées (`overflow:hidden`) | `translateY(110%)` | `0` | 1 s, délais .45 s puis .55 s, `(.2,.8,.1,1)` |
| Grand numéro contour (`-webkit-text-stroke`) | `opacity 0`, `translateY(12vw)` | `1`, `0` | opacité 1,2 s ; transform 1,6 s, `(.2,.7,.1,1)` (+ parallaxe `+44px/+26px`) |
| Plaques/cartes en cascade (`s1..s4`) | `translateY(80/90/100/110px)` | `0/-30/-60/-90px` | décalages différenciés par plaque (profondeur) |
| Salle elle-même | `opacity 0` (+ `transform: none`) | `1` | .7 s `ease` (voir 680 ms) |

Les éléments restent à l'état « avant » (opacité 0, décalés) tant que la salle n'est pas active : ils se rejouent à **chaque** visite (la salle repasse à `rev` faux dès qu'on la quitte).

### Éléments qui ne bougent pas pendant la transition
En-tête (« Salle 0N / 09 Nom », z-index 20), pied/rail (z-index 20), marquee. La porte (z 40) les recouvre entièrement, le compteur et le rail changent pendant que la porte est fermée (le rail anime `flex` 3,2 vs 1 et la couleur de barre sous la porte). Le plan (z 30) est fermé au clic. Le curseur (z 100) reste au-dessus de la porte et continue de suivre la souris. Le préchargement (z 50) réutilise la même porte : `finishIntro` → `door: open` 700 ms plus tard.

### Empilement (z-index)
salles 1 (inactives) / 2 (active) → en-tête et pied 20 → plan 30 → **porte 40** → intro 50 → curseur 100.

### Natures d'animation et coût
- Porte : `transform: translateX` uniquement (compositeur, 2 calques plein écran) ; le `clip-path` est **statique** (rasterisé une fois, pas d'animation de masque) ; libellé : `opacity`. Coût faible, mais deux calques plein écran + masque.
- Crossfade de salles : `opacity` de deux sections plein écran superposées, avec `backdrop-filter: blur(10px)` sur les plaques : c'est le poste le plus lourd (flou rasterisé sur contenu mouvant), masqué à l'œil par la porte pendant 270 ms seulement.
- Entrées : `transform` (scale d'un calque débordant de 12 %, translate) et `opacity` ; rien sur `width/height/top`. Pas de repaint de layout. L'image à `scale(1.18 → 1)` pendant 2,4 s est le calque le plus grand en mouvement.
- Aucun `clip-path` animé, aucun `filter` animé. Pas de CLS : tout est `position:absolute` dans un conteneur plein écran.
- 390 px : mêmes durées et structure ; la diagonale devient très étroite (≈ 47 px), le libellé passe à 44 px (plancher du `clamp`) ; sur écran tactile la porte se déclenche au balayage horizontal (> 70 px), pas au scroll vertical (les salles longues défilent dans leur propre `data-scroll`).

## 2. Contexte de notre site (existant utile)

- `salle-frame` porte déjà `view-timeline: --salle block` et les animations d'entrée (`salle-photo-in`, `salle-panel-in`, `salle-line-up`, `salle-number-in`) sous `@media (prefers-reduced-motion: no-preference)` + `@supports (animation-timeline: view())`, état final sinon. Les entrées internes sont donc déjà transposées ; **il manque uniquement la porte entre salles**.
- Utilitaires hérités : `door`, `door-panel-left/right`, `door-open-left/right`, tokens `--door-skew` (2 rem), `--door-height`, `--door-range-*` (l'ancienne `ui/Porte`, section scroll de hauteur propre, retirée de la page ; elle ouvrait la porte seulement, sans fermeture).
- Intro : `PorteIntro` réutilise la même porte (CSS pur, 1,4 s). Elle couvre l'entrée dans le site ; la présente analyse concerne les **9 jointures** suivantes : Entrée→01, 01→02, … 05→06, 06→méthode, méthode→à propos, à propos→rendez-vous.
- Tokens existants réutilisables : `--ease-in-out` (`cubic-bezier(.65,0,.35,1)` ≠ maquette `(.77,0,.18,1)`), `--ease-out-expo`, `--dur-*`, `--z-intro: 200`, `--z-cursor: 210`.

## 3. Propositions de transposition en scroll natif

Principe commun : **le contenu reste dans le HTML et dans le flux** (SEO), la porte est un calque décoratif `aria-hidden`, `pointer-events: none`, sans focus. Elle n'existe que sous `@media (prefers-reduced-motion: no-preference)` **et** `@supports (animation-timeline: view())` : sinon le calque est `display: none` (aucun repli à écrire, rien ne masque le contenu). Tokens communs à ajouter : `--porte-seam-top: 56%`, `--porte-seam-bottom: 44%` (ou un seul `--porte-skew` en % pour éviter la valeur magique), `--porte-open-shift: 75%`, `--porte-left`/`--porte-right` (`face-deep` / `face-dark`, les mêmes que la maquette `#1b1b1b`/`#232323` : à rapprocher des tokens existants plutôt que de créer 2 gris), `--ease-porte: cubic-bezier(.77,0,.18,1)`, `--z-porte` (entre en-tête/plan et `--z-intro`), et `--porte-range-*` selon l'option.

### Option A : seuil dédié entre deux salles (porte « en flux », la plus fidèle)
Entre chaque paire de salles, un bloc `ui/Seuil` (hauteur `--seuil-height`, ex. 100-120 svh) contenant un calque `position: sticky; top: 0; height: 100svh` : deux panneaux + libellé « Salle 0N / nom de la salle suivante ». `animation-timeline: view()` sur le seuil : 0-35 % panneaux `±75 % → 0` (fermeture), 35-65 % libellé visible (plateau), 65-100 % réouverture ; la salle suivante est déjà dessous.
- **Fidélité** : très haute (porte complète, libellé central, même diagonale, même easing). Les entrées de salle se déclenchent derrière.
- **Perf** : 2 calques plein écran composités uniquement dans le seuil visible ; pas de repaint (transform + opacity). Bornés : 18 calques dans la page au repos si `will-change` posé à tort : ne pas en poser (le compositeur promeut seulement les animations actives).
- **A11y / reduced-motion** : le seuil est supprimé (`display: none`, hauteur 0) ; le libellé « Salle 0N » en `aria-hidden` (le titre réel est dans la salle).
- **Repli** : seuil absent, rien ne change.
- **CLS / LCP** : hauteur fixe en svh dans le flux, donc CLS nul ; premier seuil sous la 1re salle, LCP (photo/H1 de l'Entrée) inchangé.
- **Défaut majeur** : ajoute 9 × ~1 écran de scroll **vide** (la page s'allonge d'environ 40 %), friction pour l'utilisateur et pour les robots d'exploration/lecteurs d'écran (9 blocs décoratifs). C'est ce qui a fait retirer l'ancienne `ui/Porte`.
- **Effort** : moyen. **Fichiers** : nouveau `components/ui/Seuil.astro`, utilitaires `seuil`/`porte-panel-*` + keyframes dans `global.css`, insertion dans `sections/Salles.astro`, `Parcours`, `Marque`, `RdvSection` (ou `pages/index.astro`), données du libellé dans `data/salles.ts` (numéros et noms des 3 sections non-salle : à fournir par `content-fr`).

### Option B : portes superposées aux salles, sans hauteur ajoutée (recommandée)
Chaque salle (sauf l'Entrée pour la porte d'entrée) embarque un calque `ui/Porte` (`position:absolute; inset:0`, au-dessus de la photo et du panneau, sous l'en-tête) piloté par la **timeline `--salle` déjà déclarée** sur `salle-frame` :
- `porte-in` : `animation-range: entry 0% entry 80%`, panneaux fermés → ouverts (`fill: backwards forwards`) : la salle monte déjà sombre (portes fermées, comme la maquette à t = 600 ms), puis les battants s'écartent à mesure qu'elle s'inscrit.
- `porte-out` : `animation-range: exit 30% exit 100%`, ouverts → fermés (`fill: forwards` seul, pour ne pas écraser `porte-in` avant sa phase) : la salle sortante se referme. À la jointure, les deux calques sont fermés : on retrouve la diagonale pleine de la maquette. Pas de `porte-out` sur la dernière salle (rendez-vous) : le pied de page ne doit pas se couvrir.
- Le **libellé** « Salle 0N » est un `SalleLabel`/`Pastille` existant ; le gros nom central de la maquette n'est pas reproduit (le calque est lié à la salle, pas à l'écran : il ne peut pas rester centré sur la jointure). Variante : afficher seulement la pastille « 0N » sur le battant.
- **Fidélité** : moyenne à haute (même forme, mêmes gris, même easing, même sens d'ouverture ; manque le libellé géant et la durée fixe : la vitesse suit le scroll). La porte se joue sur le scroll réel, jamais de contenu bloqué.
- **Perf** : transform seul sur 2 panneaux par salle (clip-path statique), uniquement pendant l'entrée/sortie ; la timeline `--salle` existe déjà. Surveiller : sur les salles longues (mobile, hauteur > 100 svh) les ranges `entry`/`exit` se rallongent, donc fixer les plages en % de **hauteur de la timeline** reste proportionnel ; le panneau ne couvre pas de texte à lire car il n'est fermé qu'en bord d'écran. Bascule à mesurer : mémoire de ~16 calques plein écran possibles ; Lighthouse/DevTools Layers à vérifier.
- **A11y / reduced-motion** : calques absents sous `prefers-reduced-motion: reduce` ; `aria-hidden`, pas de focus, `pointer-events: none` ; le texte sous un battant partiel reste dans le DOM mais **la lisibilité** pendant le scroll relève du risque contraste : à valider (la porte n'est fermée que quand la salle est hors cadre).
- **Repli sans `animation-timeline`** : calques `display: none`, entrées déjà gérées par `--salle`.
- **CLS / LCP** : zéro CLS (absolu, aucune dimension). Le 1er écran n'a pas de porte (Entrée : `PorteIntro` existant) : LCP inchangé ; les portes ne sont rendues qu'à partir de la 2e salle, sous le pli.
- **Effort** : faible à moyen. **Fichiers** : nouveau `components/ui/Porte.astro` (2 `div` + options `in`/`out`), `ui/Salle.astro` (insère `<Porte />`), `Parcours`/`Marque`/`RdvSection` (même insertion via `Section` ou `Porte`), `global.css` (utilitaires `porte`, `porte-panel-left/right`, keyframes `porte-in-*`/`porte-out-*`, réemploi des anciens `door-*` à supprimer s'ils restent inutilisés), tokens ci-dessus. Aucune donnée, aucun JS.

### Option C : porte chronométrée déclenchée par IntersectionObserver
Un calque fixe unique (`z` entre en-tête et intro) joue la séquence de la maquette (620 ms / 950 ms, libellé central avec nom de la salle cible) quand le haut d'une salle franchit le milieu de l'écran, pendant que le scroll natif continue.
- **Fidélité** : maximale visuellement (durées, libellé géant). **Mais** temps réel ≠ scroll : le contenu est masqué ~1 s en plein défilement, peut se rejouer à l'aller et au retour, et bloque la lecture si l'utilisateur s'arrête sur la jointure.
- **Perf** : faible (un seul calque), mais un JS à maintenir (observateurs, verrou, annulation au scroll rapide, reduced-motion).
- **Repli** : sans JS, rien. **CLS/LCP** : nul (calque fixe), mais hors principe « scroll natif ». **Effort** : moyen (JS + `lib/`). Déconseillée : le contraire de l'option A validée (le scroll ne pilote plus l'effet) et risque pour l'accessibilité (masquage temporaire du contenu).

## 4. Recommandation

**Option B** : seule à transposer la porte sans allonger la page ni bloquer le contenu, en s'appuyant sur la timeline `--salle` et le gabarit `salle-frame` déjà validés, avec repli propre (calques supprimés) et zéro CLS/LCP. Concession : pas de libellé géant central ; la pastille « 0N » sur le battant peut compenser. Décision à valider par Hery avant d'écrire du code : (1) B (portes superposées) vs A (seuil, plus fidèle mais +40 % de scroll) ; (2) fermeture `porte-out` sur la salle sortante, oui/non ; (3) gris des battants (`face-deep`/`face-dark` plutôt que `#1b1b1b`/`#232323` bruts) ; (4) le nom des jointures vers méthode/à propos/rendez-vous (numéros 07-09 à fournir par `content-fr`).

Ordre de travail proposé : design-system (tokens `--porte-*`, couleurs) → astro-builder (`ui/Porte`, insertion, suppression des `door-*` orphelins) → seo-perf (vérifier LCP, calques) → qa-review.
