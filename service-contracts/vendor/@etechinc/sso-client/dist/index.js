import { createContext, useState, useRef, useCallback, useEffect, useContext } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/browser/SsoProvider.tsx

// src/browser/api.ts
async function fetchSession(brokerOrigin) {
  const res = await fetch(`${brokerOrigin}/auth/session`, { credentials: "include" });
  if (res.status === 200) return await res.json();
  return null;
}
async function postRefresh(brokerOrigin) {
  const res = await fetch(`${brokerOrigin}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });
  return res.ok;
}

// src/browser/redirect.ts
function redirectToLogin(brokerOrigin, returnTo = window.location.href) {
  const url = new URL(`${brokerOrigin}/auth/login`);
  url.searchParams.set("returnTo", returnTo);
  window.location.assign(url.toString());
}
function redirectToLogout(brokerOrigin) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${brokerOrigin}/auth/logout`;
  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
}
var SsoContext = createContext(null);
function SsoProvider({
  children,
  brokerOrigin,
  appSlug
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const load = useCallback(async () => {
    try {
      const s = await fetchSession(brokerOrigin);
      if (mounted.current) setUser(s);
    } catch (e) {
      if (mounted.current) setError(e);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [brokerOrigin]);
  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
    };
  }, [load]);
  useEffect(() => {
    function onFocus() {
      if (!user) return;
      const secondsLeft = user.expiresAt - Math.floor(Date.now() / 1e3);
      if (secondsLeft < 60) {
        void postRefresh(brokerOrigin).then((ok) => ok ? load() : setUser(null));
      }
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user, brokerOrigin, load]);
  const value = {
    user,
    loading,
    error,
    appSlug,
    brokerOrigin,
    login: (returnTo) => redirectToLogin(brokerOrigin, returnTo),
    logout: () => redirectToLogout(brokerOrigin),
    hasRole: (role) => !!user?.access[appSlug]?.includes(role),
    refresh: load
  };
  return /* @__PURE__ */ jsx(SsoContext.Provider, { value, children });
}
function useSession() {
  const ctx = useContext(SsoContext);
  if (!ctx) throw new Error("useSession must be used within an <SsoProvider>");
  return ctx;
}
var BRAND_DARK = "#275DA1";
var defaultStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.625rem",
  width: "100%",
  padding: "0.75rem 1rem",
  backgroundColor: BRAND_DARK,
  color: "#FFFFFF",
  fontWeight: 500,
  fontSize: "1rem",
  lineHeight: 1.25,
  fontFamily: "inherit",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  transition: "background-color 0.15s ease, filter 0.15s ease"
};
function SignInButton(props) {
  const { login } = useSession();
  const {
    label = "Sign in with Kannegiesser SSO",
    className,
    style,
    children,
    returnTo,
    hideIcon = false,
    ariaLabel
  } = props;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-label": ariaLabel ?? label,
      onClick: () => login(returnTo),
      className,
      style: { ...defaultStyle, ...style },
      onMouseEnter: (e) => {
        e.currentTarget.style.filter = "brightness(0.92)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.filter = "";
      },
      children: children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
        !hideIcon && /* @__PURE__ */ jsx(LockIcon, {}),
        /* @__PURE__ */ jsx("span", { children: label })
      ] })
    }
  );
}
function LockIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      style: { flexShrink: 0 },
      children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
      ]
    }
  );
}
async function getSupabaseToken(brokerOrigin, appSlug) {
  try {
    const res = await fetch(`${brokerOrigin}/auth/supabase-token`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appSlug })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
function useSupabaseSession(supabase) {
  const ctx = useContext(SsoContext);
  if (!ctx) {
    throw new Error("useSupabaseSession must be used within an <SsoProvider>");
  }
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const refreshTimerRef = useRef(null);
  const currentExpiryRef = useRef(0);
  const mountedRef = useRef(true);
  const { user, appSlug, brokerOrigin } = ctx;
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (!user) {
      if (ready) {
        void supabase.auth.signOut().catch(() => {
        });
        setReady(false);
      }
      return;
    }
    let cancelled = false;
    const fetchAndSet = async () => {
      const result = await getSupabaseToken(brokerOrigin, appSlug);
      if (cancelled || !mountedRef.current) return;
      if (!result) {
        setError(new Error("Failed to obtain Supabase token"));
        return;
      }
      try {
        await supabase.auth.setSession({
          access_token: result.access_token,
          refresh_token: ""
        });
      } catch (e) {
        if (cancelled || !mountedRef.current) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        return;
      }
      if (cancelled || !mountedRef.current) return;
      currentExpiryRef.current = result.expires_at;
      setReady(true);
      setError(null);
      const nowMs = Date.now();
      const expiryMs = result.expires_at * 1e3;
      const refreshInMs = Math.max(expiryMs - nowMs - 5 * 60 * 1e3, 30 * 1e3);
      refreshTimerRef.current = setTimeout(() => {
        if (mountedRef.current && !cancelled) void fetchAndSet();
      }, refreshInMs);
    };
    void fetchAndSet();
    const onFocus = () => {
      if (!mountedRef.current) return;
      const secondsLeft = currentExpiryRef.current - Math.floor(Date.now() / 1e3);
      if (secondsLeft < 5 * 60) void fetchAndSet();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [user, appSlug, brokerOrigin, supabase]);
  return { ready, error };
}

// src/browser/supabase-fetch.ts
function createBrokerAuthedFetch(options) {
  const { anonKey } = options;
  let currentToken = null;
  const authedFetch = (input, init) => {
    const headers = new Headers(
      init?.headers ?? (input instanceof Request ? input.headers : void 0)
    );
    if (!headers.has("apikey")) {
      headers.set("apikey", anonKey);
    }
    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }
    const nextInit = { ...init ?? {}, headers };
    return fetch(input, nextInit);
  };
  return {
    fetch: authedFetch,
    setToken: (token) => {
      currentToken = token;
    },
    getToken: () => currentToken
  };
}

export { SignInButton, SsoProvider, createBrokerAuthedFetch, getSupabaseToken, useSession, useSupabaseSession };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map