import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, CSSProperties } from 'react';
import { S as SessionUser, a as SsoConfig } from './types-BzRkj-4K.js';

interface SsoContextValue {
    user: SessionUser | null;
    loading: boolean;
    error: Error | null;
    login: (returnTo?: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    refresh: () => Promise<void>;
    appSlug: string;
    brokerOrigin: string;
}
declare function SsoProvider({ children, brokerOrigin, appSlug, }: SsoConfig & {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

declare function useSession(): SsoContextValue;

interface SignInButtonProps {
    /**
     * Button label. Default: "Sign in with Kannegiesser SSO".
     * Ignored when `children` is provided.
     */
    label?: string;
    /**
     * Extra className appended after the built-in one. Use this to add
     * Tailwind modifiers, spacing, or override width in your app's styling.
     */
    className?: string;
    /**
     * Inline style overrides. Merged on top of the default style object,
     * so any key here wins (e.g. `{backgroundColor: '#000'}`).
     */
    style?: CSSProperties;
    /**
     * If provided, renders these contents instead of the default
     * icon + label. Useful for custom layouts.
     */
    children?: ReactNode;
    /**
     * Optional returnTo URL forwarded to the broker's /auth/login endpoint.
     * Defaults to the current page (handled by the SDK).
     */
    returnTo?: string;
    /**
     * Hide the lock icon. Default: false.
     */
    hideIcon?: boolean;
    /**
     * Optional `aria-label` override. Defaults to the resolved label.
     */
    ariaLabel?: string;
}
/**
 * Branded "Sign in with Kannegiesser SSO" button. Click handler calls
 * `login(returnTo)` from `useSession`, so this component must be rendered
 * inside an `<SsoProvider>`.
 *
 * @example
 * import { useSession, SignInButton } from '@etechinc/sso-client';
 *
 * function Gate() {
 *   const { user, loading } = useSession();
 *   if (loading) return <Spinner />;
 *   if (!user) return <SignInButton />;
 *   return <App />;
 * }
 */
declare function SignInButton(props: SignInButtonProps): react_jsx_runtime.JSX.Element;

interface SupabaseTokenResult {
    access_token: string;
    expires_at: number;
    token_type: 'Bearer';
}
/**
 * Ask the broker to mint a short-lived Supabase-compatible JWT for this user
 * and app. The user must be signed in (kai_session cookie present) AND admitted
 * to the target app (Door 2). Returns null on 401/403/404 or network failure.
 *
 * Caller is responsible for handing the result to `supabase.auth.setSession()`.
 * Prefer `useSupabaseSession` for the full lifecycle.
 */
declare function getSupabaseToken(brokerOrigin: string, appSlug: string): Promise<SupabaseTokenResult | null>;
/** Minimal structural type for a Supabase client — avoids hard dep on supabase-js. */
interface SupabaseLike {
    auth: {
        setSession: (args: {
            access_token: string;
            refresh_token: string;
        }) => Promise<unknown>;
        signOut: () => Promise<unknown>;
    };
}
interface UseSupabaseSessionResult {
    /** True once a Supabase session has been set at least once. */
    ready: boolean;
    /** Non-null if the last token fetch failed for a non-auth reason. */
    error: Error | null;
}
/**
 * ⚠️ DEPRECATED — prefer `createBrokerAuthedFetch` for new apps.
 *
 * This hook calls `supabase.auth.setSession({access_token})` which resolves
 * successfully but does NOT reliably apply the token to subsequent requests
 * (supabase-js's internal session state wins). Apps using this hook may see
 * queries go out with the anon key in the Authorization header and 401 on
 * role-gated RLS policies, especially when persistSession is false.
 *
 * The reliable alternative: `createBrokerAuthedFetch` from this same package
 * returns a custom `fetch` that you pass to `createClient({global:{fetch}})`.
 * It overwrites the Authorization header on every outgoing request with the
 * current broker token, bypassing GoTrueClient entirely.
 *
 * This hook is kept for backwards compatibility (apps already using it may
 * work if supabase-js's session state happens to align), but new apps should
 * use `createBrokerAuthedFetch`.
 *
 * Wire a Supabase client to the broker's session. Call once at the top of
 * your app tree, inside `<SsoProvider>`, passing your supabase-js client.
 *
 * Behavior (legacy):
 * - When the broker session is present, fetches a Supabase token from the
 *   broker and calls `supabase.auth.setSession({ access_token })`.
 * - Sets a timer to refresh 5 minutes before expiry.
 * - Re-fetches on window focus if the current token is near expiry.
 * - When the broker session goes away (logout), calls `supabase.auth.signOut`
 *   to clear any stale client-side state.
 *
 * @deprecated Use `createBrokerAuthedFetch` + `getSupabaseToken` instead.
 */
declare function useSupabaseSession(supabase: SupabaseLike): UseSupabaseSessionResult;

/**
 * createBrokerAuthedFetch — the reliable way to route Supabase queries
 * through a broker-minted JWT.
 *
 * Why this exists: supabase-js's `supabase.auth.setSession({access_token})`
 * is not a reliable mechanism for applying externally-signed JWTs. The call
 * resolves successfully, but subsequent queries often go out with only the
 * anon key in the Authorization header — GoTrueClient's internal session
 * state wins over the externally-provided one. The
 * `useSupabaseSession` hook uses setSession and therefore has the same bug.
 *
 * This helper sidesteps GoTrueClient entirely: it returns a custom `fetch`
 * you pass to `createClient({ global: { fetch } })`. On every outgoing
 * request the custom fetch overwrites the `Authorization` header with the
 * current broker token (stored in a closure). A `setToken` setter lets the
 * rest of the app publish the latest token without importing React.
 *
 * Typical wiring:
 *
 * ```ts
 * // lib/supabase.ts
 * import { createClient } from '@supabase/supabase-js';
 * import { createBrokerAuthedFetch } from '@etechinc/sso-client';
 *
 * const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 * const { fetch: authedFetch, setToken } = createBrokerAuthedFetch({ anonKey });
 *
 * export const supabase = createClient(url, anonKey, {
 *   auth: {
 *     persistSession: false,
 *     autoRefreshToken: false,
 *     detectSessionInUrl: false,
 *   },
 *   global: { fetch: authedFetch },
 * });
 * export { setToken };
 *
 * // In your auth provider / context:
 * import { getSupabaseToken } from '@etechinc/sso-client';
 * import { setToken } from './lib/supabase';
 *
 * const result = await getSupabaseToken('https://kannegiesser.ai', 'your-app-slug');
 * setToken(result?.access_token ?? null);
 * ```
 *
 * Before setToken is called (app loading / user signed out), outgoing
 * requests fall back to the anon key in both the apikey and Authorization
 * headers — same behavior as a vanilla anonymous Supabase client.
 */
interface CreateBrokerAuthedFetchOptions {
    /** The Supabase anon key for this project. Used as the apikey header on every
     *  request and as the fallback Authorization Bearer when no broker token is set. */
    anonKey: string;
}
interface BrokerAuthedFetch {
    /** Pass this to createClient's `global.fetch` option. */
    fetch: typeof fetch;
    /** Call with the latest broker-minted JWT after getSupabaseToken() resolves.
     *  Pass null to clear (e.g., on logout). */
    setToken: (token: string | null) => void;
    /** For diagnostics — returns the currently-installed token or null. */
    getToken: () => string | null;
}
declare function createBrokerAuthedFetch(options: CreateBrokerAuthedFetchOptions): BrokerAuthedFetch;

export { type BrokerAuthedFetch, type CreateBrokerAuthedFetchOptions, SessionUser, SignInButton, type SignInButtonProps, SsoConfig, type SsoContextValue, SsoProvider, type SupabaseLike, type SupabaseTokenResult, type UseSupabaseSessionResult, createBrokerAuthedFetch, getSupabaseToken, useSession, useSupabaseSession };
