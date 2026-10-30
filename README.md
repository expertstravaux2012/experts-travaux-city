# Experts Travaux City

Site one-page du showroom Experts Travaux City (Toulouse). Il est dissocié du site principal Experts Travaux : le SEO métiers vit là-bas ; ici on présente le showroom et on prend des rendez-vous.

Stack : Astro 7 + Tailwind v4. Node 22.x (`engines` de `package.json`).

## Démarrage

```bash
npm install
npm run dev      # serveur de développement Astro
npm run build    # build de production (fait foi, pas d'`astro check`)
npm test         # tests unitaires (node --test sur src/**/*.test.ts)
```

`astro dev` ne sert pas `/api`. Pour tester le formulaire de rendez-vous, lancer `vercel dev` (avec les variables d'environnement du formulaire, voir ci-dessous).

## Structure

| Chemin | Rôle |
| --- | --- |
| `src/data/` | Tous les textes et données (site, home, salles, rdv, légal, SEO...), séparés du markup |
| `src/components/` | `ui/` (briques réutilisables), `layout/` (header, footer, rail, plan...), `sections/` (sections de la page) |
| `src/lib/` | Logique sans markup (JSON-LD, consentement, e-mail de rendez-vous, hélice 3D) |
| `src/styles/global.css` | Tokens de la charte et utilitaires |
| `src/pages/` | `index`, `mentions-legales`, `cgu`, `robots.txt` |
| `api/rdv.ts` | Fonction Vercel du formulaire de rendez-vous |
| `public/assets/` | Visuels servis tels quels (`city/`, `rebranding/`, `og-city.jpg`) |
| `docs/` | Documents de travail (maquette, marque, photo originale) |

La charte « Faces du cube », les principes de développement et les agents sont décrits dans [AGENTS.md](AGENTS.md) (`CLAUDE.md` en est un lien). Ils ne sont pas répétés ici.

## Formulaire de rendez-vous

Le formulaire envoie un seul e-mail via Mailjet, depuis la fonction Vercel `api/rdv.ts` (logique dans `src/lib/rdv-mail.ts`). Rien n'est stocké.

Variables à renseigner dans Vercel (serveur uniquement, jamais `PUBLIC_`), modèle dans `.env.example` :

- Obligatoires : `MAILJET_API_KEY`, `MAILJET_API_SECRET`, `MAILJET_SENDER_EMAIL` (adresse expéditeur validée dans Mailjet). Si l'une manque, l'envoi échoue (réponse 500).
- Optionnelle : `RDV_TO_EMAIL` (destinataire ; par défaut `email` de `src/data/site.ts`).

Sécurité :

- Validation côté serveur (champs, longueurs, e-mail, consentement ; corps limité à `MAX_BODY_BYTES`).
- Champ piège anti-spam `website` : s'il est rempli, la requête est ignorée silencieusement.
- Contrôle de l'en-tête `Origin` : domaine du site (`site.url`), hôte de la requête ou prévisualisations Vercel du projet.
- Limitation de débit configurée dans Vercel Firewall (hors dépôt) : 5 envois / 10 min / IP sur `POST /api/rdv`.

## Mise en ligne

- Déploiement : Vercel, équipe Experts-travaux, projet `experts-travaux-city`. Domaine prévu : `city.experts-travaux.fr`.
- Indexation : `indexable` dans `src/data/site.ts` est l'interrupteur unique. `false` = `noindex` + `Disallow: /`. Valeur actuelle : `false`, jusqu'à décision de Hery.

À faire avant le lancement :

1. Renseigner les variables Mailjet dans Vercel.
2. Faire relire les mentions légales et les CGU (`src/data/legal.ts`).
3. Passer `indexable` à `true`.

## Visuels

- Le fond de l'Entrée est la vraie photo du showroom : variantes `showroom-experts-travaux-city-*` dans `public/assets/city/`, original dans `docs/photos/`.
- Les six visuels `choix_*` de `public/assets/city/` sont des rendus illustratifs. Ne pas les présenter comme des photos du showroom.
