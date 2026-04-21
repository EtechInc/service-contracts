import { createClient } from '@supabase/supabase-js'
import { createBrokerAuthedFetch } from '@etechinc/sso-client'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const { fetch: brokerFetch, setToken: setBrokerToken } = createBrokerAuthedFetch({ anonKey })
export { setBrokerToken }

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: 'service-contracts-main-auth',
  },
  global: { fetch: brokerFetch },
})
