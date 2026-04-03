import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email ou mot de passe incorrect')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #dce8f5',
    borderRadius: 8,
    padding: '12px',
    fontSize: 15,
    boxSizing: 'border-box',
    marginBottom: 12
  }

  return (
    <div style={{ background: '#1A3C5E', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>ProAppli Facture</h1>
        <p style={{ color: '#a0bcd8', fontSize: 14, margin: 0 }}>Connectez-vous pour continuer</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 400 }}>
        <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 16, margin: '0 0 16px' }}>Connexion</p>

        <input
          style={inputStyle}
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={{ color: '#e53e3e', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  )
}