import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const { factures, clients } = useApp()
  const navigate = useNavigate()
  const totalFactures = factures.reduce((sum, f) => sum + f.total, 0)

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: 0 }}>Bienvenue sur</p>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '4px 0 0' }}>ProAppli Facture</h1>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #2E6DA4' }}>
            <p style={{ color: '#2E6DA4', fontSize: 12, margin: '0 0 4px' }}>FACTURES</p>
            <p style={{ color: '#1A3C5E', fontSize: 28, fontWeight: 700, margin: 0 }}>{factures.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #4A90D9' }}>
            <p style={{ color: '#4A90D9', fontSize: 12, margin: '0 0 4px' }}>CLIENTS</p>
            <p style={{ color: '#1A3C5E', fontSize: 28, fontWeight: 700, margin: 0 }}>{clients.length}</p>
          </div>
        </div>

        <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#a0bcd8', fontSize: 12, margin: '0 0 4px' }}>TOTAL FACTURÉ</p>
          <p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{totalFactures.toLocaleString()} FCFA</p>
        </div>

        <button
          onClick={() => navigate('/nouveau')}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          + Nouvelle Facture
        </button>
      </div>
    </div>
  )
}