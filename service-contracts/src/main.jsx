import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { SsoProvider, useSession, getSupabaseToken } from '@etechinc/sso-client'
import { setBrokerToken } from './supabaseClient.js'
import App from './App.jsx'

function SupabaseTokenRefresher() {
  const { user } = useSession()
  useEffect(() => {
    if (!user) {
      setBrokerToken(null)
      return
    }
    let timer
    let cancelled = false
    const refresh = async () => {
      const result = await getSupabaseToken('https://kannegiesser.ai', 'service-contracts')
      if (cancelled || !result) return
      setBrokerToken(result.access_token)
      const msUntilRefresh = Math.max(0, (result.expires_at * 1000 - Date.now()) - 5 * 60 * 1000)
      timer = window.setTimeout(refresh, msUntilRefresh)
    }
    refresh()
    return () => { cancelled = true; if (timer) clearTimeout(timer) }
  }, [user])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SsoProvider brokerOrigin="https://kannegiesser.ai" appSlug="service-contracts">
      <SupabaseTokenRefresher />
      <App />
    </SsoProvider>
  </StrictMode>,
)
