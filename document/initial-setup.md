# Initial Setup — Sprint 0, Story 0.1

**Project:** the-woven-kitchen (`frontend-twk-admin`)
**Scope:** Basic project setup verification only. No business features (Login, Customers, Orders, Menu, Payments, Dashboard) implemented.

## 1. What Was Inspected

| Area | Files | Status |
|---|---|---|
| Build tooling | `rspack.config.ts` (dev), `rspack.prod.config.ts` (prod) | ✅ Rspack + SWC loader, SCSS pipeline, HTML template, env injection, type-check plugin |
| TypeScript | `tsconfig.json` | ✅ Strict mode, `baseUrl: ./src` path aliases |
| Redux Toolkit | `src/core/store/configureStore.ts`, `rootReducer.ts` | ✅ `configureStore` with `rootReducer` (user slice + RTK Query reducer) and api middleware concatenated |
| Typed hooks | `useAppSelector.ts`, `useAppDispatch.ts` | ✅ Provided for app-wide use |
| RTK Query | `src/core/api/base.api.ts` | ✅ Single `baseApi` (`fetchBaseQuery`, tag types from `STORE_TAGS`); domain endpoints injected dynamically via `injectEndpoints` in `<domain>/queries/index.ts` & `<domain>/mutations/index.ts` |
| API integration | `src/core/http/index.ts`, `base.service.ts`, `src/core/service/*.service.ts` | ✅ Axios instance with runtime `API_URL`; `ServiceBase` validates every response against Yup schemas and returns `ApiIResult<T>`; services delegate to it |
| React Router | `src/AppRoutes.tsx`, `src/index.tsx` | ✅ v7 `createBrowserRouter(AppRoutes)`; lazy-loaded pages; paths from `core/base/const/routes.ts` |
| Ant Design | `src/index.tsx` (antd reset css import), deps | ✅ antd v6 + @ant-design/icons installed |
| i18n | `src/i18n.ts`, `public/locales/` | ✅ i18next http-backend, namespaces `common`, `user` |
| ESLint / Prettier | `eslint.config.mjs`, `.prettierrc`, husky | ✅ Flat config, pre-commit formatting |
| Environment config | `.env.development`, `public/app-env.js`, `utils/env*`, `core/base/const/env.ts` | ✅ Runtime vars via `globalThis.twkVars` (apiUrl, scope, clientId, authority, baseUrl); `REACT_APP_BUILD_NUMBER` from dotenv into DefinePlugin |
| Tests infra | `vitest.config.ts`, `vitest.setup.ts`, `src/tests/` | ✅ Vitest + jsdom + Testing Library configured; no test files exist yet |

## 2. What Was Already Correct

- React 19 + TypeScript strict setup compiles cleanly.
- Redux Toolkit store wiring (reducer composition + middleware) is correct.
- RTK Query baseApi pattern (injectEndpoints per domain, tags, queryFn → service layer) is correct and untouched.
- Axios base URL resolves from runtime environment config; auth interceptor slot is prepared (commented until MSAL is wired).
- Router serves `/` (Home) and `/test`; 404 fallback present.
- antd styles imported at entry.
- ESLint, Prettier, Husky all functional.

## 3. Changes Made (minimal lint fixes only)

No architectural or behavioral changes. Only unused-code/type cleanups so `npm run lint` passes:

- `src/App.tsx` — removed unused `useEffect/useRef/useState` imports.
- `src/index.tsx` — removed unused `App` import (routes own their layout).
- `src/pages/Home/Home.tsx` — removed unused `sampleProduct` object and unused destructured query flags.
- `src/common/hooks/useInfiniteQuery.ts` — removed unused imports; `listParams?: any` → `Record<string, unknown>`; `let nextOffset` → `const`.
- `src/components/custom/ProductCard/ProductCard.tsx` — prop typed as `ProductListItem` instead of `any`.
- `src/core/api/user/queries/index.ts` — endpoint generic `any` → `UserApiResponse` (matches product-domain pattern).
- `src/core/http/index.ts` — removed unused `AuthService`/`API_SCOPE` imports (re-add when enabling the Bearer-token interceptor).
- `src/globalThis.d.ts` — removed stale eslint-disable directive.

## 4. Validation Results

| Check | Command | Result |
|---|---|---|
| ESLint | `npm run lint` | ✅ Pass — 0 errors (3 pre-existing `react-hooks/exhaustive-deps` warnings left as-is to avoid behavior changes) |
| TypeScript | `npx tsc --noEmit` | ✅ Pass — no errors |
| Production build | `npm run build` | ✅ Compiles (~28s). Warnings are asset-size hints only |
| Dev server | `npm run start` → `http://localhost:9001` | ✅ HTTP 200; HTML shell + `app-env.js`/`env-init.js` + bundle served |
| Unit tests | `vitest.config.ts` present | No test files yet — nothing to run |

## Definition of Done — Confirmed

- [x] Existing React application runs
- [x] Existing packages work correctly
- [x] Redux Toolkit works (store composed, slices mounted)
- [x] RTK Query works (baseApi + injected endpoints + middleware)
- [x] API integration works (axios + ServiceBase + Yup validation)
- [x] React Router works
- [x] Ant Design works
- [x] ESLint passes
- [x] Build/type checking passes
- [x] No existing functionality broken

## Notes for Future Stories

- Use `useAppSelector`/`useAppDispatch`; never plain redux hooks.
- New pages: folder under `src/pages/<Page>/` (`Page.tsx` + `.scss` + `index.ts`), lazy route in `AppRoutes.tsx`, path const in `ROUTES`.
- New endpoints: Yup schema in `core/base/schema`, types in `core/base/type`, service method extending `ServiceBase`, inject in `core/api/<domain>/{queries,mutations}/index.ts` with proper tags.
- Auth interceptor in `core/http/index.ts` is stubbed — enable together with MSAL login story.
