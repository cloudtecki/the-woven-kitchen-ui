# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

React 19 + TypeScript admin SPA ("the-woven-kitchen", package dir: `frontend-twk-admin`). Bundled with **Rspack** (Vite is used only by Vitest). State via Redux Toolkit + RTK Query. UI: Ant Design v6, AG Grid, Emotion, SCSS. Auth: Azure MSAL. i18n: i18next.

## Commands

- `npm run start` — Rspack dev server
- `npm run build` — production build (`rspack.prod.config.ts`)
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npm run format` — Prettier write all
- `npm run test` — Vitest, no watch, coverage enabled (CI-style)
- `npm run test-local` — Vitest watch mode for local iteration

Always run `npm run lint` and `npm run test` after changes. There is no separate typecheck script; TypeScript is checked via `ts-checker-rspack-plugin` during build/dev and by the IDE — prefer running `npx tsc --noEmit` when unsure.

## Path Aliases

`tsconfig.json` sets `baseUrl: "./src"`. Import modules directly from `src` root without relative paths or a leading alias token:

```ts
import AppLayout from 'Layout/AppLayout';        // src/Layout/AppLayout.tsx
import { ROUTES } from 'core/base/const/routes'; // src/core/base/const/routes.ts
```

Known roots: `assets`, `common`, `components`, `core`, `Layout`, `pages`, `utils`, `tests`.

## Architecture

Layered structure under `src/`:

- `core/api` — RTK Query. `base.api.ts` defines a single `baseApi`; domains (e.g. `user`, `product`) inject endpoints via `injectEndpoints` in `queries/index.ts` / `mutations/index.ts`, exporting `useXxxQuery` hooks. Endpoints delegate to services via `queryFn`.
- `core/service` — domain service classes extending `ServiceBase` (`core/http/base.service.ts`), an Axios wrapper that validates every response against a Yup schema and returns `ApiIResult<T>` (`{ data, status, hasErrors } | { error, hasErrors }`).
- `core/store` — `configureStore`, `rootReducer`, typed hooks `useAppDispatch` / `useAppSelector`. Use these, never plain `useDispatch`/`useSelector`.
- `core/api/*.slice.ts` — classic Redux Toolkit slices for local state (e.g. theme, user details).
- `core/base` — shared `const` (routes, store tags), `enum`, `type` (TS types), `schema` (Yup schemas for API payloads).
- `pages/<Page>/` — one folder per page: `Page.tsx` + `Page.scss` + `index.ts` barrel.
- `components/custom/<Component>/` — same folder convention for custom components.
- `Layout/` — app shell (`AppLayout`, `Content`).
- `common/hooks/` — reusable hooks (`useInfiniteQuery`, `useScroll`).
- `utils/` — env helpers (`env.ts`, `env-vars.ts`, `bundler.ts`).

### Routing

Routes are declared as a `RouteObject[]` array in `src/AppRoutes.tsx`. Pages are lazy-loaded with `React.lazy`; path strings come from `ROUTES` in `core/base/const/routes.ts` — add new routes there, never inline literals.

### API calls

Flow: component → generated RTK Query hook (`useGetXQuery`) → endpoint `queryFn` → service method (`core/service/*.service.ts`) → `ServiceBase.get/post/put/delete` → validated against Yup schema from `core/base/schema`.

When adding an endpoint:

1. Add/extend the Yup response schema in `core/base/schema/<domain>.ts`.
2. Add types in `core/base/type/<domain>.ts`.
3. Add the service method extending `ServiceBase`.
4. Inject the endpoint in `core/api/<domain>/queries/index.ts` or `mutations/index.ts` with proper `providesTags`/`invalidatesTags` (tags defined in `core/base/const/store.ts`).

### i18n

All user-facing strings go through `react-i18next` (`t()`), translations live in `public/locales/<lng>/<ns>.json` with namespaces `common` and `user`. Never hardcode display text.

### Environment

Runtime config comes from `globalThis.twkVars` (populated by `public/app-env.js` / `env-init.js`) plus `REACT_APP_*` env vars handled in `utils/env*`.

## Conventions

- TypeScript strict mode; avoid `any` (some legacy usages exist — do not add new ones).
- Default exports for components/pages/slices; named exports for hooks, actions, consts.
- Styling: SCSS files colocated next to components (`Component.scss` imported in the tsx); root class prefix `twk-` (e.g. `twk-app`).
- Tests use Vitest + jsdom + React Testing Library with globals enabled; shared helpers in `src/tests/tests.util.tsx` and i18n test config in `src/tests/i18n-test-config.ts`.
- Formatting is enforced by Prettier and pre-commit hooks (husky). Keep code formatted before committing.
- Do not commit secrets; `.env*` files exist locally but are gitignored.
