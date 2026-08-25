# TERMINAL 3

Cave à vin et épicerie fine de luxe à Jérusalem — site vitrine + back-office + commandes.

## Stack

- TanStack Start + React 19 + Vite 7
- Tailwind CSS v3 + PostCSS
- TypeScript
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- TanStack Query

## Prérequis

- Node.js 20+ / npm 10+
- Un projet Supabase actif
- Git

## Installation locale

```bash
npm install
```

Créer un fichier `.env` à la racine en copiant `.env.example` :

```bash
cp .env.example .env
```

Remplacer les valeurs `your-project`, `your-anon-key` et `your-service-role-key` par celles de votre projet Supabase (Settings → API).

## Supabase — première configuration

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Ouvrir l'éditeur SQL et exécuter le contenu de `supabase/migrations/0001_schema.sql`.
3. Exécuter ensuite `supabase/seed.sql` pour insérer le catalogue de démonstration, les zones et les pages.
4. Créer un bucket Storage public nommé `media` :
   - Storage → New bucket → `media` → Public bucket → Save.
5. Créer le premier administrateur :

```bash
ADMIN_EMAIL=admin@terminal3.co.il \
ADMIN_PASSWORD=ChangeMe123! \
SUPABASE_URL=https://... \
SUPABASE_SERVICE_ROLE_KEY=... \
node scripts/seed-admin.mjs
```

## Développement

```bash
npm run dev
```

Le serveur de développement démarre sur `http://localhost:5173`.

## Build production

```bash
npm run build
npm run start
```

`npm run start` lance `server.mjs`, un petit serveur Node qui sert le build statique et le SSR.

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build client + SSR |
| `npm run start` | Serveur de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run test:rls` | Smoke tests RLS (requiert les variables d'env) |
| `npm run setup:storage` | Crée le bucket Supabase Storage `media` |
| `npm run seed:admin` | Crée le compte administrateur |

## Structure du projet

```
src/
  routes/             # Pages TanStack Router (file-based routing)
  components/         # Composants React
  backend/            # Fonctions serveur, auth, Supabase admin
    functions/        # server functions (public, client, admin)
    auth-middleware.ts
    supabase-server.ts
  shared/             # Logique partagée, types, mock data
    lib/              # cart, site, format, mappers, promotions, order-calculator, supabase
    data/             # Catalogue de démonstration local
    types/            # Types TypeScript
  styles.css          # Tokens Tailwind + utilitaires luxe
  client.tsx          # Entry client
  router.tsx          # Entry router
supabase/
  migrations/         # Schéma PostgreSQL
  seed.sql            # Données initiales
scripts/
  seed-admin.mjs      # Bootstrap admin
  setup-supabase.mjs  # Configuration Supabase Storage
  test-rls.mjs        # Tests de sécurité RLS
```

## Gestion du contenu

### Admin

Accès : `/admin` après connexion avec un compte possédant le rôle `admin`.

L'admin permet de gérer :
- Les produits (catalogue, prix, stock, images)
- Les promotions (pourcentage, montant fixe, prix spéciaux)
- Les banderoles et bannières
- Les zones de livraison
- Les pages (titres, SEO, textes)
- La médiathèque (upload d'images)
- Les commandes (paiement, Teoudat Zeout, annulation)
- Les clients

### Catalogue sans Supabase

Si aucune variable d'env Supabase n'est définie, le site utilise automatiquement le catalogue local `src/data/catalog.ts`.

## Sécurité

- Toutes les opérations admin passent par des fonctions serveur autorisées côté Supabase (middleware `requireAdmin`).
- Les totaux de commandes sont recalculés côté serveur.
- Les commandes alcoolisées nécessitent une vérification Teoudat Zeout.
- Les mots de passe et clés de service ne doivent jamais être commités.

## Déploiement

Le build produit `dist/client` (assets statiques) et `dist/server` (SSR).

### Render (recommandé)

Un fichier `render.yaml` est inclus à la racine. Pour déployer sur Render :

1. Connectez votre repo GitHub à Render.
2. Créez un nouveau **Web Service**.
3. Render détectera `render.yaml` et utilisera :
   - Build : `npm ci && npm run build`
   - Start : `npm run start`
4. Renseignez les variables d'environnement dans le dashboard Render :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`

### Vercel

TanStack Start avec SSR nécessite une fonction serverless adaptée. Le projet n'inclut pas encore d'adaptateur Vercel. Le plus simple est donc **Render** ou tout serveur Node exécutant `npm run build` puis `npm run start`.

### Manuel

Sur un serveur Node avec `npm` :

```bash
npm ci
npm run build
npm run start
```

Le serveur écoute par défaut sur `http://localhost:3000`.

## Licence

Projet privé — TERMINAL 3.
