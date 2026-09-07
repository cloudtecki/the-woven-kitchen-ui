# Sprint 1 — Login & Signup — Frontend (`frontend-twk-admin`)

**App:** `twk-admin` (React 19 + TypeScript + Rspack, Redux Toolkit + RTK Query, Ant Design v6, react-router v7)
**Dev URL:** `http://localhost:9001` (`npm run start`)
**Scope:** Login + Signup UI, validation, API wiring, token storage, routing guards.

---

## 1. Where Everything Starts

Entry chain for any page load (including `GET /`):

```
src/index.tsx
  -> createBrowserRouter(AppRoutes) + RouterProvider
  -> src/AppRoutes.tsx (RouteObject[])
  -> src/App.tsx (<AppLayout><Content><Outlet/></Content></AppLayout>)
  -> src/Layout/AppLayout.tsx
  -> src/pages/Home|Login|Signup/*.tsx (lazy-loaded)
```

Key files:

| Concern | File |
|---|---|
| Router table | `src/AppRoutes.tsx` |
| Path constants | `src/core/base/const/routes.ts` |
| App shell | `src/App.tsx`, `src/Layout/AppLayout.tsx`, `src/Layout/Content.tsx` |
| Login UI | `src/pages/Login/Login.tsx` |
| Signup UI | `src/pages/Signup/Signup.tsx` |
| Shared auth layout | `src/components/custom/AuthShell/AuthShell.tsx` |
| RTK Query hooks | `src/core/api/auth/mutations/index.ts` → `useLoginMutation`, `useSignupMutation` |
| Service layer | `src/core/service/auth.service.ts` (`AuthApiService`) |
| HTTP + validation base | `src/core/http/base.service.ts` (`ServiceBase`), `src/core/http/index.ts` (`Axios`) |
| Token store | `src/core/http/auth.service.ts` (`AuthService`) |
| Redux user state | `src/core/api/auth/auth.slice.ts`, `src/core/store/rootReducer.ts` |
| Types / schemas | `src/core/base/type/auth.ts`, `src/core/base/schema/auth.ts` |
| Endpoints | `src/core/base/enum/api.ts` (`LOGIN=/api/auth/login`, `SIGNUP=/api/auth/signup`) |
| Validation consts | `src/core/base/const/validation.ts` |
| Strings | `public/locales/en/auth.json` (namespace `auth`) |

Routes today (`src/core/base/const/routes.ts`):

```ts
ROUTES = { HOME: '/', TEST: '/test', LOGIN: '/login', SIGNUP: '/signup' }
```

Router today (`src/AppRoutes.tsx`):

* `/` → `<HomePage/>` — **no guard**
* `/login`, `/signup` → wrapped in `<GuestOnly>` — if `AuthService.isAuthenticated()` then `<Navigate to={ROUTES.HOME} replace/>`
* `*` → `404 Not Found`

---

## 2. Signup Flow — Start to End

**UI:** `src/pages/Signup/Signup.tsx` inside `AuthShell variant="signup"`.

### 2.1 User steps

1. Open `/signup`.
2. Fill: Full Name*, Mobile*, Email*, Password*, Confirm Password*, Alternate Mobile (optional), Bio (optional, 0/120 counter), Consent checkbox (required).
3. Client validation runs first (Ant Form rules + helpers in `core/base/const/validation.ts`).
4. `onFinish(values)` builds `SignupRequest`:
   ```ts
   {
     name: values.name.trim(),
     email: normalizeEmail(values.email), // trim + lowercase
     phone: normalizePhone(values.phone), // strip non-digits, strip leading 91
     alternatePhone?: normalizePhone(...), // only if provided
     bio?: values.bio.trim(),              // only if non-empty
     password: values.password             // never trimmed/normalized
   }
   ```
5. Call `signup(payload)` → `useSignupMutation`.

### 2.2 API chain

```
SignupPage.onFinish
 -> useSignupMutation (core/api/auth/mutations/index.ts)
 -> AuthApiService.signup(payload) (core/service/auth.service.ts)
 -> ServiceBase.post('/api/auth/signup', payload, SignupApiResponseSchema)
 -> Axios.post(baseURL=API_URL + /api/auth/signup)
 -> Yup validate response vs SignupApiResponseSchema { success, data: AuthUser, message }
 -> return ApiIResult<SignupApiResponse>
```

Backend contract (`core/base/type/auth.ts`, `core/base/schema/auth.ts`):

```ts
SignupRequest = { name, email, phone, alternatePhone?, password, bio? }
SignupApiResponse = { success: boolean, data: AuthUser, message: string }
AuthUser = { id, name, email, phone, role: 'ADMIN'|'CUSTOMER', bio|null, isActive, createdAt, updatedAt }
```

### 2.3 Result handling (`Signup.tsx:79-105`)

* `result.data` → `message.success(t('signup.successMessage'))` → `navigate(ROUTES.LOGIN)`. **No auto-login, no token saved on signup.**
* `result.error.data` string contains `email` → field error `signup.emailDuplicationError` (“Email already registered”).
* Contains `mobile|phone` → field error `signup.mobileDuplicationError`.
* Else → `message.error(t('signup.genericErrorMessage'))`.
* `busy = isLoading || submitting` disables the submit button and shows “Creating Account…”.

### 2.4 Validation rules (client)

| Field | Rule | Source |
|---|---|---|
| name | required, whitespace check, max 100 | `NAME_MAX_LENGTH` |
| phone | required, `isValidPhone()` → normalize then `/^[6-9]\d{9}$/` (Indian 10-digit) | `PHONE_REGEX` |
| alternatePhone | optional, same phone regex, must ≠ primary after normalize | custom validator |
| email | required, `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` | `EMAIL_REGEX` |
| password | required, `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,64}$/` | `PASSWORD_REGEX` |
| confirmPassword | required, must equal `password` field | `dependencies:['password']` |
| bio | optional, max 120 UI (`SIGNUP_BIO_MAX_LENGTH`), schema allows 500 | `Input maxLength=120` |
| consent | must be `true` | custom validator |

---

## 3. Login Flow — Start to End

**UI:** `src/pages/Login/Login.tsx` inside `AuthShell variant="login"`.

### 3.1 User steps

1. Open `/login`.
2. Fill Email + Password → `onFinish(values)`:
   ```ts
   payload = { email: values.email.trim(), password: values.password }
   result = await login(payload) // useLoginMutation
   ```
3. API chain is identical to signup but with `POST /api/auth/login` and `LoginApiResponseSchema`:
   ```ts
   LoginApiResponse = { success, data: { token: string, user: AuthUser }, message }
   ```

### 3.2 Success path (`Login.tsx:54-59`)

```ts
AuthService.setAuthTokens(result.data.data.token); // localStorage
dispatch(setAuthUser(result.data.data.user));      // Redux auth.user
message.success(t('login.successMessage'));        // "Welcome back! You are logged in."
navigate(ROUTES.HOME);                             // -> '/'
```

That is the **only place tokens are written** in the app.

### 3.3 Failure path (`Login.tsx:61-66`)

```ts
error.status === 400 || 401 → message.error(t('login.invalidCredentialsMessage')) // "Invalid email or password."
else → message.error(t('login.genericErrorMessage'))
catch → genericErrorMessage
```

Nothing is written to storage or Redux on failure (verified in `Login.test.tsx:160`).

Forgot Password / Google / Facebook buttons → `showComingSoon()` → “Coming soon!” toast only. No OAuth call yet even though `@azure/msal-*` is installed.

---

## 4. Token Storage, Maintenance, Security

### 4.1 Where the token lives

`src/core/http/auth.service.ts`:

```ts
TOKEN_KEY = 'twk_access_token'
REFRESH_TOKEN_KEY = 'twk_refresh_token'
localStorage.getItem / setItem
```

| Operation | API |
|---|---|
| Read | `AuthService.getToken(): string\|null` |
| Write | `AuthService.setToken(token)`, `setAuthTokens(accessToken, refreshToken?)` |
| Refresh read/write | `getRefreshToken()`, `setRefreshToken()` — **defined but never used today** (login passes only access token) |
| Clear | `AuthService.clearAuth()` removes both keys — **no caller today (no logout button)** |
| Header | `getAuthHeaders()` → `{ Authorization: 'Bearer <token>' }` or `{}` |

Redux (`src/core/api/auth/auth.slice.ts`, mounted as `state.auth` in `rootReducer.ts`):

```ts
{ user: AuthUser | null } // setAuthUser(user), clearAuthUser()
```

> Token = `localStorage` (survives reload). User profile = Redux only (lost on reload — re-fetch or re-decode is needed if you want persistence).

### 4.2 How the token is sent

`src/core/http/index.ts`:

```ts
const Axios = axios.create({ baseURL: API_URL });
Axios.interceptors.request.use(async (config) => {
  const headers = AuthService.getAuthHeaders();
  if (headers.Authorization) config.headers.Authorization = headers.Authorization;
  return config;
});
```

Every `ServiceBase.get/post/put/delete` goes through this `Axios`, so every authenticated call automatically gets `Authorization: Bearer <token>` if a token exists.

Note: RTK Query’s `baseApi` uses `fetchBaseQuery()` with no auth wiring — but auth mutations bypass it via `queryFn → AuthApiService → Axios`, so login/signup work. Any future endpoint using plain `query: () => url` (fetchBaseQuery) will **not** send the token unless you add `prepareHeaders` there.

### 4.3 Expiry / invalid handling

`AuthService.isAuthenticated()`:

```ts
token = getToken();
if (!token) return false;
try {
  payload = JSON.parse(atob(token.split('.')[1])); // JWT payload
  return Date.now() < payload.exp * 1000;
} catch { return false; }
```

| Token state | Result | Effect today |
|---|---|---|
| Missing (`null`) | `false` | `GuestOnly` lets you see `/login`, `/signup` |
| Malformed (not 3 parts, bad base64/JSON, no `exp`) | `false` (caught) | Same as missing |
| Expired (`exp*1000 <= Date.now()`) | `false` | Same as missing — **no auto-redirect, no refresh, no 401 interceptor** |
| Valid JWT, not expired | `true` | `GuestOnly` redirects `/login`→`/`, `/signup`→`/` |

There is **no refresh-token flow, no response interceptor for 401, no silent renew, no idle-timeout logout** (`react-idle-timer` is installed but unused in auth). Expired/invalid tokens simply fail the `isAuthenticated()` check and backend calls return 401 which `ServiceBase` surfaces as `{ hasErrors:true, error:{ status:401, data:message } }`.

### 4.4 Security notes (current posture)

* ✅ Password never stored client-side; only sent in POST body over HTTP(S).
* ✅ Yup validates both request shape (via Form + schema) and response shape before use.
* ✅ `Authorization` header is the only credential transport; no token in URL.
* ⚠️ `localStorage` is XSS-readable. Any injected script can read `twk_access_token`. Mitigations in place: `dompurify` dep is available, React escapes by default — but there is no CSP/httpOnly-cookie alternative yet. Do not store extra PII there.
* ⚠️ No logout → `clearAuth()` is dead code until a logout button calls it + `dispatch(clearAuthUser())`.
* ⚠️ `atob` decode does **not** verify signature — `isAuthenticated()` is a UX hint only; real authorization is the backend’s 401/403.
* ⚠️ No role enforcement in frontend — `user.role` (`ADMIN`|`CUSTOMER`) is stored but never checked in routes.

---

## 5. The `/` (localhost:9001) Redirect — Fixed with `RequireAuth`

### 5.1 Previous behavior (bug)

1. Browser hit `http://localhost:9001/` → router matched `path: '/'` → rendered `<HomePage/>` unconditionally.
2. `GuestOnly` only protected `/login` and `/signup` (logged-in users bounced to `/`). There was no protected-route wrapper on `/` or `/test`.
3. So an anonymous user saw Home instead of being sent to `/login`.

### 5.2 Current behavior (fixed in `src/AppRoutes.tsx`)

> On entering `/`, check if **any user (ADMIN or CUSTOMER) is logged in** via `AuthService.isAuthenticated()`. If yes → render Home. If no (missing/invalid/expired token) → redirect to `/login`.

Roles do not change this rule — both `ADMIN` and `CUSTOMER` are allowed on `/`. Role checks (if needed later) belong on admin-only sub-routes, not on the root gate.

Implemented:

```tsx
export const RequireAuth = ({ children }: RequireAuthProps) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

// usage in AppRoutes children:
{ path: ROUTES.HOME, element: <RequireAuth><HomePage /></RequireAuth> },
{ path: ROUTES.TEST, element: <RequireAuth><SamplePage /></RequireAuth> },
{ path: ROUTES.LOGIN, element: <GuestOnly><LoginPage /></GuestOnly> },
{ path: ROUTES.SIGNUP, element: <GuestOnly><SignupPage /></GuestOnly> },
```

Full routing matrix now:

| URL | Logged out | Logged in (valid token) |
|---|---|---|
| `/` | → `/login` (RequireAuth) | Home renders |
| `/test` | → `/login` (RequireAuth) | Test renders |
| `/login` | Login renders | → `/` (GuestOnly) |
| `/signup` | Signup renders | → `/` (GuestOnly) |

Optional hardening (not yet done):
* Call `AuthService.clearAuth()` + `dispatch(clearAuthUser())` when you detect an expired/malformed token so stale data never lingers.
* Add an Axios response interceptor: on 401 → clear + `window.location.href = '/login'`.
* Persist `user` to `sessionStorage` or re-fetch `/user` on boot if header/avatar needs it without re-login.
* Add a logout button: `AuthService.clearAuth(); dispatch(clearAuthUser()); navigate(ROUTES.LOGIN)`.

---

## 6. Manual Verification

```bash
cd D:\real-time-project\twk\frontend-twk-admin
npm run start
# open http://localhost:9001/
```

| Step | Expect |
|---|---|
| Fresh browser, `localStorage` empty, open `/` | Redirect to `/login` (RequireAuth) |
| `/signup` → valid data → submit | Toast “Account created…”, navigate to `/login` |
| `/signup` → duplicate email/phone | Inline field error, stays on `/signup` |
| `/login` → correct creds | Toast “Welcome back!”, `localStorage.twk_access_token` set, `state.auth.user` set, navigate to `/` |
| `/login` → wrong creds | Toast “Invalid email or password.”, no token stored |
| Logged in → open `/login` or `/signup` | Redirect to `/` (GuestOnly) |
| DevTools → delete/expire token → reload `/` | Redirect to `/login` |
| Every API call (Network tab) | `Authorization: Bearer <token>` header present when logged in |

Automated: `npm run test` covers `Login.test.tsx` (render, validation, trim, success stores token + navigates home, 401 shows message + stores nothing, social/forgot toasts, password toggle, signup link) and `Signup.test.tsx`. `npm run lint` + `npx tsc --noEmit` should stay green.

---

## 7. File Reference (start → flow → end)

**Signup:** `pages/Signup/Signup.tsx:onFinish` → `core/api/auth/mutations/index.ts:signup` → `core/service/auth.service.ts:13` → `core/http/base.service.ts:57 post` → `core/http/index.ts:Axios` → backend `POST /api/auth/signup` → `core/base/schema/auth.ts:SignupApiResponseSchema` → navigate `LOGIN`.

**Login:** `pages/Login/Login.tsx:onFinish` → `core/api/auth/mutations/index.ts:login` → `core/service/auth.service.ts:17` → `ServiceBase.post(LOGIN)` → backend `POST /api/auth/login` → `LoginApiResponseSchema` → `core/http/auth.service.ts:setAuthTokens` + `core/api/auth/auth.slice.ts:setAuthUser` → navigate `HOME`.

**Guard:** `AppRoutes.tsx:GuestOnly` + `core/http/auth.service.ts:isAuthenticated` (JWT `exp` check). Missing piece: `RequireAuth` for `/` (see §5.3).
