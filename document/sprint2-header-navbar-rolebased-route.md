# Sprint 2 — Role-Based Sidebar & Route Access — Implementation Report

**App:** `frontend-twk-admin` | **Backend:** `backend-twk-admin` (Node, `http://localhost:3000`)

---

## 1. Existing roles discovered (backend — not guessed)

`backend-twk-admin/src/shared/constants/roles.js`: only **`ADMIN`** and **`CUSTOMER`**.
Enforced via `authorizeRoles(...allowed)` (`src/api/middlewares/authorize-roles.js`) on the
JWT `{ userId, role }` payload (`src/api/middlewares/authenticate.js`). Signup hardcodes
`role: CUSTOMER` (`src/application/services/auth.service.js:45`). The .NET backend has no
roles/auth at all (scaffold only) and is not used.

Backend permission matrix actually in code:

| Backend route | ADMIN | CUSTOMER |
|---|---|---|
| `GET/PATCH /api/users/me` (profile) | ✅ | ✅ |
| `GET /api/users/*`, `PATCH/DELETE /api/users/:id` (customers) | ✅ | ❌ |
| `POST/PATCH/DELETE /api/menu` (menu manage) | ✅ | ❌ |
| `GET /api/menu/tomorrow` (daily menu) | ✅ | ✅ |
| `GET/POST /api/orders`, `GET /api/orders/:id` | ✅ | ✅ |
| `PATCH /api/orders/:id` | ✅ | ❌ |

No backend endpoints exist for payments, deliveries, expenses, reports, dashboard, settings.

## 2. Current-user API endpoint discovered

**`GET /api/users/me`** (authenticate only) → `{ success: true, data: AuthUser }`
(`src/api/routes/user.routes.js:24`, `user.service.js: getProfile → toUserDTO`, `response.js: successResponse`).
Role field: `data.role`. Frontend wired it as `APIEndpoints.GET_CURRENT_USER` with
`AuthApiService.getCurrentUser()` + `useGetCurrentUserQuery` (RTK Query, `providesTags: [USER]`).

## 3. Navigation items and role access (`src/core/base/const/navigation.ts`)

Single table (`NAVIGATION_ITEMS: { key, labelKey, path, icon, allowedRoles }`) used by
**both** the sidebar filter and the route guards — no duplicated role logic.

| Item | Path | ADMIN | CUSTOMER | Basis |
|---|---|---|---|---|
| Dashboard | `/admin/dashboard` | ✅ | ✅ | Assumption (shared landing) |
| Customers | `/admin/customers` | ✅ | ❌ | Backend: users mgmt ADMIN-only |
| Menu | `/admin/menu` | ✅ | ❌ | Backend: menu manage ADMIN-only |
| Daily Menu | `/admin/daily-menu` | ✅ | ✅ | Backend: `/menu/tomorrow` both |
| Orders | `/admin/orders` | ✅ | ✅ | Backend: orders list/view/create both |
| Payments | `/admin/payments` | ✅ | ❌ | Assumption (no endpoint; financial data) |
| Deliveries | `/admin/deliveries` | ✅ | ❌ | Assumption (no endpoint; ops data) |
| Expenses | `/admin/expenses` | ✅ | ❌ | Assumption (no endpoint; financial data) |
| Reports | `/admin/reports` | ✅ | ❌ | Assumption (no endpoint; business-wide) |
| Settings | `/admin/settings` | ✅ | ✅ | Assumption (hosts own-profile via `/me`) |

Helpers (pure, unit-tested): `getNavigationForRole`, `isPathAllowedForRole`, `getDefaultPathForRole`.

## 4. Routes created / updated (`src/AppRoutes.tsx`, `src/core/base/const/routes.ts`)

New `ROUTES`: `ADMIN /admin`, `ADMIN_DASHBOARD … ADMIN_SETTINGS`, `FORBIDDEN /forbidden`.
Structure: `/admin` → `RequireAuth → AdminLayout → Outlet`; each child additionally wrapped in
`ProtectedRoute allowedRoles={rolesFor(path)}` where `rolesFor` reads `NAVIGATION_ITEMS`
(single source). `/` now redirects authenticated users to `/admin/dashboard` (was `HomePage`);
`/test`, `/login`, `/signup`, `*→404` preserved. New `/forbidden` (403 page) for denied roles.
Login success navigates to `ADMIN_DASHBOARD` (was `HOME`); `GuestOnly` bounces there too.

## 5. Components created / updated

| Component | File | Notes |
|---|---|---|
| `ProtectedRoute` | `components/custom/ProtectedRoute/` | Auth check → role check → allow/loading/redirect; clears stale session on profile-fetch failure |
| `AdminSidebar` | `components/custom/AdminSidebar/` | Filters `NAVIGATION_ITEMS` by role, Ant `Menu` active highlight, brand mark, `onNavigate` hook |
| `AdminHeader` | `components/custom/AdminHeader/` | Username + role from user data (i18n `roles.*`), avatar initial, logout button, mobile collapse |
| `AdminLayout` | `Layout/AdminLayout/` | Ant `Sider` (`breakpoint lg`, `collapsedWidth 0`) + `Header` + `Content>Outlet`; full-page `Spin` while current user loads |
| Admin pages ×10 | `pages/Admin/<Section>/` | Thin wrappers over shared `AdminPlaceholder` (title/desc/signed-in-as); business content = later sprints |
| `ForbiddenPage` | `pages/Forbidden/` | 403 `Result` + back link to role default path |
| `useCurrentUser` | `common/hooks/useCurrentUser.ts` | Token check + Redux + `GET /me` hydration; loading/error flags |
| i18n | `public/locales/en/admin.json`, `i18n.ts`, test config | New `admin` namespace (nav, roles, header, loading, pages, forbidden) |

## 6. Authentication / authorization changes

- Added current-user hydration: on reload, valid token + empty Redux → `GET /api/users/me` → `setAuthUser`. No duplicate auth mechanism; same `AuthService` token + `ServiceBase`/Yup pipeline.
- Route protection is now two-layer: `RequireAuth` (token/`exp`) at `/admin` + `ProtectedRoute` (role) per child. Direct URL entry to unauthorized routes redirects to `/forbidden`; unauthenticated entry redirects to `/login`.
- Logout implemented (was dead code): `clearAuth()` + `clearAuthUser()` + `resetApiState()` → `/login`; post-logout admin URLs redirect to login.
- `UserRole = AuthRole` alias added for guard/nav readability; `AuthUser`/`AuthUserSchema` reused unchanged for `/me`.

## 7. Assumptions made (explicit, per prompt)

1. Dashboard/Settings are shared (landing + own-profile); Payments/Deliveries/Expenses/Reports are ADMIN-only — backend has no endpoints for these, so finance/ops-wide data defaults to admin. Revisit when backend defines permissions.
2. Admin sections render placeholders; only navigation + guards are Sprint 2 scope.
3. Sidebar/Header styling follows project conventions (Ant + BEM `twk-` + SCSS) since Figma link requires access not available in this environment — no redesign, responsive via `Sider breakpoint lg` + collapsing header toggle, no fixed-height clipping.
4. `CUSTOMER` users use the same admin shell with reduced nav (backend permits them orders/menus/profile).

## 8. Validation / testing performed

- `npx tsc --noEmit` ✅ · `npm run lint` ✅ (0 errors, 3 pre-existing warnings) · `npm run build` ✅ (asset-size warnings only)
- New: `navigation.test.ts` (6), `ProtectedRoute.test.tsx` (5: unauth→login, ADMIN allow, CUSTOMER→forbidden, loading no-redirect, expired→login), `AdminSidebar.test.tsx` (3: ADMIN all, CUSTOMER filtered, click), `AdminHeader.test.tsx` (2: name+role display, logout clears + redirects) — 16/16 ✅
- Existing: Login (10) + Signup (14) incl. updated post-login landing expectation — 24/24 ✅
- Manual checklist for reviewer: login as ADMIN sees 10 items; CUSTOMER sees 4; direct `/admin/reports` as CUSTOMER → `/forbidden`; logged-out `/admin/*` → `/login`; logout → `/login` + back-navigation blocked; reload as logged-in user keeps session via `/me`; mobile width collapses sidebar without horizontal overflow.
