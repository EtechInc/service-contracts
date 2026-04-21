import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f172a', fontFamily: "'Barlow Condensed', sans-serif"
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155', borderRadius: 12,
        padding: '40px 48px', width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.1em' }}>
            KANNEGIESSER
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, letterSpacing: '0.08em' }}>
            SERVICE CONTRACTS
          </div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: 6, color: '#f8fafc',
                fontSize: 13, boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 12px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: 6, color: '#f8fafc',
                fontSize: 13, boxSizing: 'border-box'
              }}
            />
          </div>
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#fca5a5' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
