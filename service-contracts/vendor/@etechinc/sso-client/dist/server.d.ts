import { S as SessionUser } from './types-BzRkj-4K.js';
export { a as SsoConfig } from './types-BzRkj-4K.js';

interface VerifierOptions {
    /** Broker origin, e.g., https://kannegiesser.ai */
    brokerOrigin: string;
    /** Require access[appSlug] to be non-empty. */
    appSlug: string;
}
/**
 * Factory for a JWT verifier bound to a broker origin + app slug.
 * Returns a function that takes a raw compact JWT and resolves to a
 * SessionUser if the token is valid, issued by the expected broker,
 * and grants any role on this appSlug; otherwise null.
 */
declare function createKaiVerifier(opts: VerifierOptions): (jwt: string | undefined | null) => Promise<SessionUser | null>;

export { SessionUser, type VerifierOptions, createKaiVerifier };
