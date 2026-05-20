# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — `tsc -b && vite build` (type-check then build)
- `npm run typecheck` — `tsc -b --noEmit`
- `npm run lint` — ESLint over the repo
- `npm run preview` — preview the production build
- `npm run shadcn:add-all` — re-run the full shadcn install (`--force` overwrite). The same script runs automatically via `postinstall`, only adding components that are missing from `src/components/ui/`.

No test runner is configured.

## Environment

Copy `.env.example` to `.env` and fill in:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — if both are absent, [src/lib/supabase.ts](src/lib/supabase.ts) installs a stub client so the app still boots; auth calls become no-ops and a console warning is emitted. Don't add hard guards that crash when these are unset — the stub is the intended fallback.
- `VITE_API_BASE_URL` — prepended to every `api()` call; empty string is fine for same-origin.

## Architecture

Single-page React 19 + Vite app. The provider stack in [src/main.tsx](src/main.tsx) is `ThemeProvider → QueryClientProvider → RouterProvider`, with a global `Toaster` (sonner) mounted alongside.

**Routing.** All routes live in [src/router.tsx](src/router.tsx) as a flat `createBrowserRouter` config under a single `RootLayout`. Auth-gated routes are nested under a `<ProtectedRoute><Outlet /></ProtectedRoute>` element — add new private pages as children of that block rather than wrapping each page individually. Unknown paths redirect to `/404`.

**Auth.** [src/hooks/use-auth.ts](src/hooks/use-auth.ts) is the only place that touches Supabase auth from components; it subscribes to `onAuthStateChange` and exposes `signIn`/`signUp`/`signOut`. `ProtectedRoute` ([src/components/auth/protected-route.tsx](src/components/auth/protected-route.tsx)) renders a loading state until `useAuth()` settles, then redirects to `/login` with `state.from` set for post-login return.

**API calls.** Use the `api<T>()` wrapper in [src/lib/api.ts](src/lib/api.ts) instead of `fetch` directly. It:
- Prepends `VITE_API_BASE_URL`.
- Auto-attaches the Supabase access token as `Authorization: Bearer …` unless `{ auth: false }` is passed.
- JSON-encodes `body` (FormData is passed through).
- Throws `ApiError` (with `status`, `data`, `message`) on non-2xx — pair with TanStack Query for retries/caching.

**Path alias.** `@/*` → `src/*` (configured in [tsconfig.app.json](tsconfig.app.json) and [vite.config.ts](vite.config.ts)). Use it for all internal imports.

**shadcn/ui.** `components.json` is configured with the `neutral` base color and the `new-york` style. The full component set lives in `src/components/ui/` and is installed by [scripts/install-shadcn.mjs](scripts/install-shadcn.mjs) on `postinstall`. To add a new one, prefer `npx shadcn@latest add <name>` so it picks up `components.json` settings.

**Theming.** [src/components/theme-provider.tsx](src/components/theme-provider.tsx) provides light/dark/system with `webapp-theme` as the localStorage key. The `ModeToggle` in the header is the user-facing switch.

## Adding a page

1. Create `src/pages/<name>.tsx` exporting a named component.
2. Add a route entry in [src/router.tsx](src/router.tsx) — under the `ProtectedRoute` children block if auth is required.
