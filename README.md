# webapp template

Fast SPA starter. Vite + React 19 + TypeScript + Tailwind + shadcn/ui + React Router v7 + Supabase auth + TanStack Query.

## Quick start

```bash
cp .env.example .env       # fill in Supabase keys
npm install                # also installs all shadcn components on first run
npm run dev
```

Open http://localhost:5173.

## What's wired up

- **Vite + React 19** — fast dev server, fast HMR.
- **TypeScript** in strict mode with `@/*` path alias to `src/*`.
- **Tailwind v3** + the shadcn/ui design tokens (neutral, light + dark).
- **shadcn/ui** — `components.json` configured. Core components ship in `src/components/ui/`. The rest are added by `postinstall` via `scripts/install-shadcn.mjs` so you have every component available out of the box. Re-run with `npm run shadcn:add-all`.
- **React Router v7** — routes in `src/router.tsx`. `ProtectedRoute` redirects to `/login`.
- **Supabase auth** — client in `src/lib/supabase.ts`, `useAuth()` in `src/hooks/use-auth.ts`. Sample login + signup pages.
- **TanStack Query** — `queryClient` in `src/lib/query-client.ts`, provider in `main.tsx`.
- **Fetch wrapper** — `api()` in `src/lib/api.ts` auto-attaches the Supabase access token.
- **Dark mode** — `next-themes`-style provider with light/dark/system toggle in the header.
- **Toasts** — `sonner` Toaster mounted globally.

## Add a page

1. Create `src/pages/my-page.tsx` exporting a component.
2. Add a route in `src/router.tsx`. Wrap in `<ProtectedRoute>` if auth-required.

## Add a shadcn component

```bash
npx shadcn@latest add <name>
```

Or re-run the full set: `npm run shadcn:add-all`.

## Project layout

```
src/
  components/
    auth/             protected-route
    layout/           root-layout
    ui/               shadcn components
    theme-provider.tsx
    mode-toggle.tsx
  hooks/              use-auth
  lib/                supabase, api, query-client, utils
  pages/              home, dashboard, login, signup, not-found
  router.tsx
  main.tsx
  index.css
```
