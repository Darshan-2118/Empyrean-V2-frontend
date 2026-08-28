# Empyrean Frontend — API Implementation Audit

Audited against the **Empyrean API v1** documentation (base URL `/api/v1`).
Scope: static code review only — nothing was executed.

**Verdict: the frontend is not integrated with the API.** The only API code is
`src/api.js` (a health check + a generic fetch wrapper), and it is **never
imported anywhere**. Every page that should talk to the backend currently
fakes success with `console.log` / hardcoded mock data.

---

## 1. Critical — Endpoints documented but not implemented at all

| # | Endpoint(s) | Status in frontend | Evidence |
|---|---|---|---|
| 1.1 | `POST /api/v1/auth/login` | **Not called.** Submit handler only does `console.log("Login submitted", formData)` and navigates to the dashboard with no authentication whatsoever. | `src/pages/login.jsx:76-79` |
| 1.2 | `POST /api/v1/auth/register` | **Not called.** Handler sets `"Registration successful!"` locally and navigates away; no request is made, no tokens are received. | `src/pages/register.jsx:152-156` |
| 1.3 | `POST /api/v1/auth/refresh` | **Not implemented.** No token-rotation handling, and the documented refresh flow (on `401` → call refresh → retry original request → force logout on failure) exists nowhere. | — |
| 1.4 | `POST /api/v1/auth/logout` | **Not implemented.** The dashboard "Sign out" menu item has no `onClick` handler and no API call. | `src/pages/dashboard.jsx:88` |
| 1.5 | JWT token management | **Missing entirely.** No access/refresh token storage (docs require in-memory storage, never localStorage), no `Authorization: Bearer <token>` header is ever attached to any request, `expires_in` is never consumed. Grep for `token`/`Authorization`/`localStorage` across `src/` returns zero matches. | — |
| 1.6 | `GET /api/v1/readings/latest` | **Not called.** Docs say the dashboard polls this every 5s; the dashboard instead renders hardcoded values (PM2.5 `22`, PM10 `34`, CO2 `412`, NH3 `0.8`, ticker "AQI: 85"). No polling loop exists. | `src/pages/dashboard.jsx:46-59, 388-405` |
| 1.7 | `GET /api/v1/readings/history` | **Not called.** Both charts (`mockChartData`, `detailedChartData`) are hardcoded arrays; no `from`/`to`/`node_id`/`bucket` params are ever built. | `src/pages/dashboard.jsx:13-21, 145-152` |
| 1.8 | `GET /api/v1/nodes`, `POST /api/v1/nodes`, `PATCH /api/v1/nodes/:node_id` | **Not called.** Devices tab is fully hardcoded (`WQM_001`, battery 78%, etc.); "Add Device" and "Manage Settings" buttons have no handlers. | `src/pages/dashboard.jsx:205-262` |
| 1.9 | `GET /api/v1/alerts`, `PATCH /api/v1/alerts/:alert_id/acknowledge` | **Not called.** "Recent Alerts" feed is a single hardcoded item; no acknowledge flow, no `limit`/`offset`/`severity` handling, `total` unused. | `src/pages/dashboard.jsx:408-423` |
| 1.10 | WebSocket `/ws/alerts` | **Not implemented.** No WebSocket client anywhere; consequently no token via `?token=` query param, no 15-minute `{"token": "..."}` re-auth frame, no handling of close code `4401`, no consumption of the `{ node_id, aqi, category, severity, timestamp }` broadcast payload. | — |
| 1.11 | `GET /api/v1/forecast` | **Not called.** No forecast UI wired to `node_id`, `horizon_minutes`, or `points`. | — |
| 1.12 | `GET /api/v1/export` | **Not called.** No CSV export button/flow; no handling of the streaming attachment response or its `from`/`to`/`node_id` params. | — |
| 1.13 | `GET/PATCH/DELETE /api/v1/profile`, `POST /api/v1/profile/change-password` | **Not called.** Dashboard "Account settings" menu item has no handler; no profile view/edit, no password change, no account deletion. | `src/pages/dashboard.jsx:86-88` |
| 1.14 | `GET /api/v1/admin/health`, `GET/PATCH /api/v1/admin/settings` | **Not called.** No admin UI exists; `role` from auth responses is never read or used for gating. | — |
| 1.15 | `GET /health` | Implemented in `src/api.js:10-49` (`checkHealth`) and correctly targets root-level `/health` (matching the docs), **but the function is dead code — no component imports it.** | `src/api.js` |

---

## 2. Bugs in the existing API code (`src/api.js`)

| # | Bug | Detail | Location |
|---|---|---|---|
| 2.1 | `api.js` is never imported | `checkHealth` and `apiFetch` are exported but unused by every page/component (verified by grep). | `src/api.js` |
| 2.2 | `apiFetch` crashes on `204 No Content` | It unconditionally does `await res.json()`. `POST /auth/logout` returns `204` with **no body** per the docs, so `res.json()` will throw and the real result is lost. Same failure mode for any non-JSON error body (the thrown parse error masks the HTTP error). | `src/api.js:61-62` |
| 2.3 | No auth header support | `apiFetch` has no mechanism to attach `Authorization: Bearer <access_token>`; every protected endpoint (`/readings/*`, `/nodes`, `/alerts`, `/forecast`, `/export`, `/profile`, `/admin/*`) would return `401`. | `src/api.js:55-69` |
| 2.4 | No 401 → refresh → retry flow | Docs mandate: on `401`, call `POST /auth/refresh`, retry the original request, force logout on refresh failure. Not implemented. | — |
| 2.5 | No rate-limit (`429`) handling | `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` headers are ignored; no backoff or user-facing message. Login is capped at 10 req/min and the login button has no debounce/lockout, so rapid retries will silently hit `429`. | `src/api.js`, `src/pages/login.jsx` |
| 2.6 | `Content-Type: application/json` forced on GETs | Harmless today, but wrong in principle and will break if a body-less method ever gets one attached. Also, the header spread (`headers: {...}, ...options`) lets a caller's `headers` key silently **replace** the default headers object instead of merging. | `src/api.js:56-59` |
| 2.7 | RFC 7807 handling is partial | Error extraction reads `data.detail || data.message` — `detail` matches RFC 7807, but `title`/`type`/per-field validation details (`422`) are never surfaced to forms. | `src/api.js:65` |

---

## 3. Request/response contract mismatches

| # | Bug | Detail | Location |
|---|---|---|---|
| 3.1 | Register sends fields the API rejects | The form collects `name`, `age`, `gender`, `confirmPassword` — the API's `POST /auth/register` accepts **only** `username`, `email`, `password`. The Phase 12 `@validate_body` Pydantic middleware rejects unknown keys (`422`). If the form were wired up as-is, every registration would fail. | `src/pages/register.jsx:16-24` |
| 3.2 | Client-side validation doesn't match API rules | Username must be 3–50 chars, letters/digits/`_` only; password must be 6–72 **bytes** UTF-8. The form enforces none of these (only "required", plus a loose email regex). | `src/pages/register.jsx:65-99, 125-150` |
| 3.3 | Login field mismatch | UI label/placeholder says "Email or username", but `POST /auth/login` accepts only `username`. If users type an email, they'll get `401` with no explanation. | `src/pages/login.jsx:6, 113, 123` |
| 3.4 | Forgot-password has no backend endpoint | The API docs define **no** password-reset endpoint. The page fakes success ("Password reset successfully") without any request. The closest endpoint, `POST /profile/change-password`, requires `current_password` (which this page doesn't collect) **and** authentication. This feature cannot work against the documented API. | `src/pages/forgot_password.jsx:93-124` |
| 3.5 | `201 Created` not anticipated | `login`/`register` return `201`, not `200`. `apiFetch` uses `res.ok` (covers all 2xx, fine), but any future code asserting `status === 200` will break — noted for the integration work. | docs §Authentication |
| 3.6 | No handling of `409 Conflict` | Duplicate username/email on register/PATCH profile returns `409`; no form-level error mapping exists for it (or for per-field `422` errors). | `src/pages/register.jsx` |

---

## 4. Infrastructure / config issues

| # | Bug | Detail | Location |
|---|---|---|---|
| 4.1 | Two conflicting Vite configs | `vite.config.js` has the `/api` + `/health` dev proxy but **no** Tailwind plugin; `vite.config.mjs` has the Tailwind plugin but **no proxy**. Vite picks one file only — if `vite.config.mjs` is ever selected (e.g. via `--config`), every API call 404s in dev. These must be merged into a single config. | `vite.config.js`, `vite.config.mjs` |
| 4.2 | No WebSocket proxy | `vite.config.js` has no `/ws` entry with `ws: true`, so `/ws/alerts` will not be proxied in dev once implemented. Browser WS must also connect with `?token=<access_token>` (browsers can't set auth headers on WS handshakes). | `vite.config.js:9-18` |
| 4.3 | `.env.example` placeholder | Ships `VITE_BACKEND_URL=http://localhost:port_number` — literal placeholder text; should be `http://localhost:8000` to match the default in `vite.config.js:4`. | `.env.example:4` |

---

## 5. Summary checklist for integration

- [ ] Merge the two Vite configs (proxy + Tailwind in one file); add `/ws` proxy with `ws: true`.
- [ ] Build an auth layer: in-memory token store, `Authorization` header injection, `401 → /auth/refresh → retry → forced logout` flow, `expires_in` tracking.
- [ ] Fix `apiFetch`: handle `204`/empty bodies, non-JSON error bodies, merge (not replace) headers, surface RFC 7807 `title`/`detail` and `422` field errors, handle `429` with `X-RateLimit-Reset`.
- [ ] Wire `POST /auth/login` (username only) and `POST /auth/register` (strip `name`/`age`/`gender` or move them to `PATCH /profile` after login); handle `201`, `401`, `409`, `422`.
- [ ] Decide fate of forgot-password (no backend endpoint exists) — remove the page or add a backend endpoint.
- [ ] Wire `POST /auth/logout` (send both refresh body and Bearer header; expect `204`).
- [ ] Dashboard: poll `GET /readings/latest` every 5s; chart from `GET /readings/history` (`from`/`to`/`node_id`/`bucket`); devices from `GET/POST/PATCH /nodes`; alerts feed from `GET /alerts` + acknowledge via `PATCH /alerts/:id/acknowledge`.
- [ ] Add `/ws/alerts` WebSocket client with `?token=` auth and the 15-min `{"token": ...}` re-auth frame; handle close code `4401`.
- [ ] Add forecast (`GET /forecast?node_id=`), export (`GET /export` streaming CSV), profile (`GET/PATCH/DELETE /profile`, `POST /profile/change-password`), and admin (`/admin/health`, `/admin/settings`) integrations.
- [ ] Use `role` from auth responses to gate admin UI.
