# TERMINAL 3 — Agent Notes

## Stack
- TanStack Start (React 19) + Vite 7
- Tailwind CSS v3 via `tailwind.config.ts` + PostCSS
- `motion`, `lucide-react`, `sonner`
- Supabase client (`@supabase/supabase-js`, `@supabase/ssr`) via TanStack Start server functions

## Commands
- `npm run dev` — start dev server (Vite)
- `npm run build` — production build (client + SSR)
- `npm run start` — production server via `server.mjs` (Node)
- `npm run typecheck` — TypeScript check
- `npm run test:rls` — RLS smoke tests
- `npm run setup:storage` — create the Supabase Storage `media` bucket
- `npm run seed:admin` — bootstrap the first admin user

## Project structure
- `src/routes/` — file-based routing (`__root.tsx`, index, category pages, auth, account, admin)
- `src/components/` — React components (ui, layout, widgets, admin)
- `src/backend/`
  - `functions/*.functions.ts` — `createServerFn` RPC layer (public, client, admin)
  - `auth-middleware.ts` — require auth / admin
  - `supabase-server.ts` — admin + public Supabase clients
- `src/shared/`
  - `lib/cart.tsx` — React context cart with `localStorage`
  - `lib/promotions.ts` — promotion engine and cart totals for local cart display
  - `lib/order-calculator.ts` — server-side order total calculator
  - `lib/supabase.ts` — browser Supabase client
  - `lib/site.ts` — brand constants and helpers
  - `lib/format.ts` — price formatting
  - `lib/mappers.ts` — DB to app type mapping
  - `lib/mock-fallback.ts` — static fallback catalog and page content
  - `data/catalog.ts` — mock products used for the static seed
  - `types/database.ts` — Supabase/DB TypeScript types
- `src/styles.css` — Tailwind v3 tokens and custom utilities
- `src/client.tsx` + `src/router.tsx` — TanStack Start entry points
- `supabase/migrations/0001_schema.sql` — full DB schema, RLS, triggers
- `supabase/seed.sql` — initial page content, delivery zones, products, promotions, banners
- `scripts/seed-admin.mjs` — one-time admin bootstrap (reads password from env)
- `scripts/setup-supabase.mjs` — create the Supabase Storage `media` bucket
- `public/robots.txt` + `public/favicon.svg`

## Supabase setup
1. Create a Supabase project (or enable Lovable Cloud).
2. Run `supabase/migrations/0001_schema.sql` then `supabase/seed.sql`.
3. Run `npm run setup:storage` to create the `media` bucket.
4. Set env vars in `.env` (see `.env.example`) and in Supabase dashboard.
5. Run `npm run seed:admin` once with `ADMIN_PASSWORD` set (default e-mail `admin@terminal3.co.il`).
6. Change the admin password after first login and enable 2FA.

## Manual QA checklist (after Supabase setup)

1. Admin login works and non-admin users get "Accès refusé" on `/admin`.
2. Client accounts cannot read admin-only data through API (RLS blocks direct `select * from orders`).
3. Admin changes to product price/title/summary/image appear on the vitrine after reload.
4. Scheduled banners respect `starts_at` / `ends_at`.
5. Admin-created promotions apply in cart totals.
6. Favorites persist across logout/login.
7. Pickup order flow creates a `pending` order.
8. Out-of-zone delivery is rejected in checkout.
9. Telephone orders work from `/admin/commande-telephone`.
10. Alcohol orders cannot be marked `completed` before Teoudat Zeout verification.
11. Orders cannot be `completed` without recorded payment.
12. Server ignores forged client totals (tested by sending a tampered total in `createOrder`).
13. No admin password or service role key appears in browser bundles.

## Notes
- The build emits `dist/client` and `dist/server`. A small Node wrapper (`server.mjs`) serves static files from `dist/client` and SSR from `dist/server/server.js`.
- Images in `src/assets/` are SVG placeholders. Replace them with real JPG assets uploaded via `/admin/medias` (Supabase Storage bucket `media`).
- All colors are semantic tokens; no hard-coded `text-white`/`bg-black` classes are used.
- Admin areas are protected by `requireAdmin` middleware that checks `user_roles` via the `has_role` Postgres function.
- Order totals are recalculated server-side in `createOrder` / `createPhoneOrder`; never trust client cart amounts.
- The site falls back to the local mock catalog when Supabase env vars are not configured.
