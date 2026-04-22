# @etechinc/sso-client

Client SDK for the Kannegiesser SSO broker at `kannegiesser.ai/auth/*`. Drop-in login, session, and logout for any `*.kannegiesser.ai` app, plus a Node/Workers helper to verify session JWTs offline.

## Install

The package is hosted on GitHub Packages. Add a `.npmrc` to the consuming app:

```
@etechinc:registry=https://npm.pkg.github.com
```

Then install:

```bash
pnpm add @etechinc/sso-client
# or: npm install @etechinc/sso-client
```

Authenticating against GitHub Packages requires a PAT with `read:packages` scope exposed as `NODE_AUTH_TOKEN` (CI) or appended to the app's `.npmrc`:

```
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Browser usage (React)

Wrap your app in `SsoProvider` and read the session with `useSession`:

```tsx
import { SsoProvider, useSession } from '@etechinc/sso-client';

export function App() {
  return (
    <SsoProvider brokerOrigin="https://kannegiesser.ai" appSlug="parts">
      <Shell />
    </SsoProvider>
  );
}

function Shell() {
  const { user, loading, login, logout, hasRole } = useSession();

  if (loading) return <p>Loading...</p>;
  if (!user) return <button onClick={() => login()}>Sign in</button>;
  if (!hasRole('member')) return <p>You don't have access to this app.</p>;

  return (
    <div>
      <p>Hi, {user.name}</p>
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
```

`useSession()` returns:

| Field | Type | Notes |
|---|---|---|
| `user` | `SessionUser \| null` | `null` means unauthenticated. |
| `loading` | `boolean` | `true` on initial session fetch. |
| `error` | `Error \| null` | Network error during session fetch. |
| `login(returnTo?)` | `(r?: string) => void` | Full-page redirect to broker login. Defaults to `window.location.href`. |
| `logout()` | `() => void` | Form POST to `/auth/logout`, then broker redirects to Azure end-session. |
| `hasRole(role)` | `(r: string) => boolean` | True iff `user.access[appSlug]` contains `role`. |
| `refresh()` | `() => Promise<void>` | Re-fetches `/auth/session`. |

The provider silently refreshes on `window focus` when the JWT has under 60 seconds left.

## Backend usage (Node / Workers)

Import from the `/server` entry:

```ts
import { createKaiVerifier } from '@etechinc/sso-client/server';

const verifyKai = createKaiVerifier({
  brokerOrigin: 'https://kannegiesser.ai',
  appSlug: 'parts',
});

// Express middleware example:
export async function requireKai(req, res, next) {
  const jwt = req.cookies.kai_session;
  const user = await verifyKai(jwt);
  if (!user) return res.status(401).send('Unauthorized');
  req.user = user;
  next();
}
```

`verifyKai(jwt)` returns a `SessionUser` or `null`. `null` means either the JWT was missing/invalid/expired, **or** the user has no roles for the configured `appSlug`. Treat both cases as 401.

JWKS is fetched once from `${brokerOrigin}/auth/.well-known/jwks.json` and cached for 10 minutes.

## How it works

The broker sits at `kannegiesser.ai/auth/*` and sets `kai_session` (ES256 JWT) + `kai_refresh` cookies scoped to `.kannegiesser.ai`, so every subdomain app shares the session. The signing keys rotate and are published at `/auth/.well-known/jwks.json`; the verifier caches them in-process for 10 minutes. The browser SDK talks to the broker over `fetch` with `credentials: 'include'` so cookies flow cross-subdomain.

## Environment configuration

| Option | Typical value |
|---|---|
| `brokerOrigin` | `https://kannegiesser.ai` |
| `appSlug` | The slug registered for this app in the broker's D1 database (e.g. `parts`, `admin`, `equipment`). |

`appSlug` must match exactly — it's the key the verifier looks up in `user.access[appSlug]` to determine whether this user is allowed into your app.

## Running the live-broker integration test

The server-side integration test is opt-in. Capture your `kai_session` cookie from DevTools on any `*.kannegiesser.ai` app:

```bash
KAI_LIVE_JWT='eyJhbGc...' KAI_APP_SLUG=parts pnpm -C packages/sso-client test live-broker
```

Without `KAI_LIVE_JWT`, the test is skipped.

## Troubleshooting

**"Session is always null" in the browser.**
The SDK calls `fetch` with `credentials: 'include'` for you, so cookies flow automatically. If you're testing with `curl`, you must pass `--cookie "kai_session=..."` yourself — the cookie is HttpOnly and won't be in your browser's JS.

**"CORS error on `/auth/session`".**
The broker only accepts `Origin` headers from `*.kannegiesser.ai` over HTTPS. Hitting it from `localhost:3000` won't work — develop against `*.kannegiesser.ai` subdomain via a hosts file or a preview domain.

**"Verifier returns `null` even though I have a valid session."**
Your `appSlug` probably doesn't match. The verifier requires `access[appSlug]` to be non-empty. Check the JWT payload at [jwt.io](https://jwt.io) and confirm the slug exists under `access`.

**"401 loop after login."**
Clock skew between your server and the broker. `jose` tolerates 30 seconds by default; beyond that the `exp` claim fails. Ensure both sides run NTP.

## License

UNLICENSED — internal Kannegiesser use only.
