# Empyrean Frontend — Codebase Bug Audit

> **Status 2026-08-28: ALL findings below have been fixed** (5 parallel fix passes, build verified). Kept for reference.

Date: 2026-08-28 · Scope: full codebase, split into 5 parts, audited in parallel.
Note: `bugs/API_BUGS.md` (missing API integration) is largely resolved — the API layer now exists in `src/api/`.

Legend: **C**ritical / **H**igh / **M**edium / **L**ow

---

## Part 1 — Build, Config & App Entry

| Sev | Location | Bug | Fix |
|---|---|---|---|
| M | `vite.config.js:5` | `process.env.VITE_BACKEND_URL` is silently ignored — Vite doesn't load `.env` into `process.env` for the config; proxy only works because the fallback matches `.env` | Use function-form config with `loadEnv(mode, cwd, '')` |
| M | `vite.config.js:9-25` | Proxy only under `server:` — `npm run preview` serves dist with no proxy, so all `/api`, `/health`, `/ws` calls fail | Duplicate proxy under `preview:` |
| M | `index.html:6` + `public/final-logo.svg` | Favicon is a **3.1 MB** SVG downloaded on every page load | Replace with a ~1–5 KB icon |
| L | `.gitignore:10` | `.env.*` also matches `.env.example` (only stays tracked because it was committed earlier) | Add `!.env.example` |
| L | `.env.example:3-4` | Comment claims backend URL is "never exposed to the browser" — false for any `VITE_`-prefixed var (footgun if a secret is ever put there) | Rename to `BACKEND_URL` (no `VITE_` prefix), read via `loadEnv` |
| L | `vite.config.js` (build) | Lazy dashboard chunk is 538 kB (recharts+leaflet together), tripping Vite's >500 kB warning | Add `build.rollupOptions.output.manualChunks` |

Verified clean: `.env` gitignored & secret-free, index.html correct, all deps resolve (react-leaflet 4/react 18, vite 5/plugin-react), firebase removal clean, production build passes, main.jsx auth/nav logic StrictMode-safe.

---

## Part 2 — API Layer (`src/api/`)

| Sev | Location | Bug | Fix |
|---|---|---|---|
| M | `client.js:135-140` | One try/catch wraps both `refreshSession()` and the retried fetch — a network error on the retry throws the stale original 401, masking the real error | try/catch around `refreshSession()` only; let retry errors propagate |
| M | `client.js:96-98` | Any non-ok refresh response (incl. transient 429/5xx) calls `clearSession()` → force-logout despite a still-valid refresh token | Clear session only on 401/403; rethrow 5xx/429 without wiping tokens |
| M | `ws.js:49-55` | Re-auth callback reuses mutable `socket` after `await ensureFreshToken()` — if reconnect happened mid-await it sends on a CONNECTING socket (uncaught `InvalidStateError`) or closes the wrong socket | Capture `const ws = socket` before await; only send if `ws === socket && readyState === OPEN` |
| L | `ws.js:78-94` | After failed re-auth (session cleared), `onclose` still schedules one stray unauthenticated reconnect before stopping | Bail out of reconnect when session is cleared |
| L | `auth.js:42` | `logout()` sends body `{}` when no refresh token (server 400, silently swallowed) | Skip the request; just `clearSession()` |
| L | `export.js:19` | `URL.revokeObjectURL` runs immediately after `click()` — can abort the download in some browsers | Defer revocation (`setTimeout(..., 1000)`) |
| L | `export.js:9` | Filename regex misses RFC 5987 `filename*=UTF-8''...` dispositions | Prefer `filename*`, decode, fall back to `filename` |

Verified clean: single-flight refresh correct under concurrent 401s, retry exactly once (no loops), 204/raw handling, `buildQuery` edge cases, WS StrictMode teardown, all endpoint paths/methods/params match the API contract.

---

## Part 3 — Auth Pages

| Sev | Location | Bug | Fix |
|---|---|---|---|
| **C** | `forgot_password.jsx:117-123` | Fakes "Password reset successfully" with **no API call** (no backend endpoint exists) — user's real password is unchanged and they're told to sign in with the new one → self-lockout | Remove the page + "Forgot password?" link (`login.jsx:186-196`) or implement a real reset flow |
| M | `register.jsx:91-98` | `handleBlur("password")` raises "Passwords do not match" on the confirm field while confirm is still empty (missing `formData.confirmPassword &&` guard that `handleChange` has) | Guard the mismatch check on non-empty confirm |
| M | `forgot_password.jsx:65-72` | Same spurious-mismatch blur bug | Same guard |
| M | `register.jsx:127-153` | No client-side enforcement of backend rules (username 3–50 `[A-Za-z0-9_]`, password 6–72 bytes) → guaranteed 422s with only a generic error shown | Add matching client validation |
| L | `register.jsx:160` | Email trimmed but not lowercased, no ≤255 check → `User@Example.com` may 422 if backend enforces lowercase | Send `email.trim().toLowerCase()` |
| L | `register.jsx:131-136` | `name`/`age`/`gender` are required in the UI but silently discarded (never sent, never persisted) | Drop the fields or save via `updateProfile()` post-registration |
| L | `login.jsx:93-95` | 429 wait-time assumes `X-RateLimit-Reset` is epoch seconds; if backend sends a delta, message always prints "1s" | Confirm header semantics; use directly if delta |

Verified clean: all CSS-module classes exist, labels wired, double-submit guarded, Enter-key flow safe.

---

## Part 4 — Dashboard

| Sev | Location | Bug | Fix |
|---|---|---|---|
| H | `pages/EmpyreanDashboardLayout.css:30` | `.dashboard{height:100vh}` renders under the 80px sticky Navbar → page is 100vh+80px, bottom ~80px (Devices/Settings rail buttons) clipped below the fold | Hide Navbar on dashboard, or `height: calc(100vh - 80px)` |
| M | `dashboard.jsx:148,152` | `MapContainer center` isn't reactive — opening Map before `/nodes` resolves locks it to the default center forever | Re-center via a `useMap()` child or key the MapContainer |
| M | `dashboard.jsx:618-627` | `handleTogglePref` optimistic update never rolls back on `updateProfile` failure → toggle permanently out of sync | Restore prev prefs in catch |
| M | `dashboard.jsx:42-46` | `parseLocation` mishandles array locations (`[lat,lng]`/GeoJSON) → `NaN` → null, silently dropping map markers | Add an `Array.isArray(loc)` branch |
| M | `dashboard.jsx:271` + CSS | `.device-status--online` never defined; `.status-dot` always green → Inactive devices show a green "online" dot | Default gray dot; green only under `--online` |
| M | `dashboard.jsx:258` + CSS | `.device-list` used but undefined → device cards stack flush with zero spacing | Add flex column + gap rules |
| L | `pages/EmpyreanDashboardLayout.css:31` | `width:100vw` + vertical scrollbar → spurious horizontal scrollbar | `width:100%` |
| L | `dashboard.jsx:607-616` | `handleAcknowledge` swallows PATCH failures — alert stays listed with zero feedback | Surface the failure |
| L | `dashboard.jsx:25-33` | `timeAgo` has no NaN guard → "NaN hours ago" on bad timestamps | Guard like `fmtTime` |
| L | `dashboard.jsx:162,267` | `key={id}` can be undefined for nodes lacking `node_id`/`id` → duplicate React keys | Fall back to index |
| L | `dashboard.jsx:581-605` | History poll has no ordering guard — a slow stale response can overwrite a newer one | Sequence counter or AbortController |
| L | `dashboard.jsx:556-563` | One-shot `getNodes`/`getProfile` double-fires under StrictMode and fails silently with no retry | Dedupe + error/retry state |
| L | `dashboard.jsx:91,414,476` | `.ticker__gradient`, `.widget--profile`, `.widget--alerts` used but absent from CSS → grid placements/gradient never render | Add the missing rules |
| L | `dashboard.jsx:227` | Peak-bucket text renders "(AQI null)" when `max_aqi` is null (line 236 is guarded, 227 isn't) | Add the same null guard |
| L | `dashboard.jsx:318` | `activeProfile` is component-local — health-profile selection lost on every tab switch, never persisted | Lift state / persist via `updateProfile` |
| L | `pages/EmpyreanDashboardLayout.css:412-426` | `.main::before` glow uses `z-index:-1` with no stacking context → paints behind `.dashboard` background, never visible | Give `.main` `z-index:0` |
| L | `styles/EmpyreanDashboardLayout.css` | Stale unused 442-line duplicate of the dashboard CSS (missing all widget styles) — edits there silently do nothing | Delete it |

Verified clean: all interval/WS effects clean up properly (StrictMode-safe), map height resolves, leaflet z-indexes contained, recharts empty-data safe, logout can't strand the user.

---

## Part 5 — Landing / Marketing Pages & Navbar

| Sev | Location | Bug | Fix |
|---|---|---|---|
| M | `Navbar.jsx:40-48` | Disabled "Live Map" is a real `<a href="#map">` with no onClick — clicking mutates the URL hash and it stays focusable/clickable | `e.preventDefault()` or render a disabled `<button>` |
| M | `Navbar.jsx:3` | Navbar logo (190 KB embedded-raster SVG) loads on every page — already cut from 3 MB, still heavy for an `<img>` | Export a true vector/small PNG |
| L | `main.jsx:47,53` vs `About.jsx`/`Features.jsx` | `onSwitchToLogin` passed but never used — About/Features render no login CTA and Navbar has no auth link, so login is only reachable via How-It-Works buttons; Landing's `onSwitchToLogin/Features/About` props are never passed | Add the intended CTAs or drop dead props |
| L | `howItWorks.jsx:186-188` | Device mockup shows hardcoded AQI/PM2.5 labeled **"live aqi"** — static data presented as live | Relabel as sample output |
| L | `landing.module.css:34` | Hero `height:calc(100vh - 80px)` assumes fixed navbar; at ≤860px the navbar stacks (~130px+) pushing the CTA below the fold | Use a shared `--nav-h` var / mobile adjustment |
| L | `assets/log&reg/logo-artwork.svg` | 3 MB asset never imported anywhere (dead weight; folder name contains `&`) | Delete it |

Verified clean: all asset imports exist on disk, all CSS-module classes referenced in JSX are defined, IntersectionObserver/interval listeners cleaned up, all `.map` calls keyed, nav callbacks optional-chained.

---

## Top 5 to fix first

1. **C** — Remove/fix forgot-password fake success (user lockout).
2. **H** — Dashboard clipped under Navbar (100vh + 80px).
3. **M** — 3.1 MB favicon in `public/`.
4. **M** — Refresh clears session on transient 429/5xx (random logouts).
5. **M** — `vite preview` has no proxy (production preview fully broken vs API).
