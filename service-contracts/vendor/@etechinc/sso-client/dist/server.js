import { jwtVerify, createRemoteJWKSet } from 'jose';

// src/server/verifier.ts
var TEN_MIN = 10 * 60 * 1e3;
var cache = /* @__PURE__ */ new Map();
function getJwks(jwksUri) {
  const now = Date.now();
  const e = cache.get(jwksUri);
  if (e && now - e.fetchedAt < TEN_MIN) return e.jwks;
  const jwks = createRemoteJWKSet(new URL(jwksUri), { cacheMaxAge: TEN_MIN });
  cache.set(jwksUri, { jwks, fetchedAt: now });
  return jwks;
}

// src/server/verifier.ts
var ISS = "https://kannegiesser.ai/auth";
function createKaiVerifier(opts) {
  const jwksUri = `${opts.brokerOrigin}/auth/.well-known/jwks.json`;
  return async function verify(jwt) {
    if (!jwt) return null;
    try {
      const { payload } = await jwtVerify(jwt, getJwks(jwksUri), { issuer: ISS });
      const p = payload;
      const roles = p.access?.[opts.appSlug];
      if (!roles || roles.length === 0) return null;
      return {
        sub: p.sub,
        email: p.email,
        name: p.name,
        access: p.access,
        groups: p.groups,
        expiresAt: p.exp
      };
    } catch {
      return null;
    }
  };
}

export { createKaiVerifier };
//# sourceMappingURL=server.js.map
//# sourceMappingURL=server.js.map