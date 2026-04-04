import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Accueil() {
  const { factures, clients, depenses, produits } = useApp()
  const navigate = useNavigate()

  const totalFactures = factures.reduce((sum, f) => sum + Number(f.total), 0)
  const totalPayees = factures.filter(f => f.statut === 'Payée').reduce((sum, f) => sum + Number(f.total), 0)
  const totalDepenses = depenses?.reduce((sum, d) => sum + Number(d.montant), 0) || 0

  const margeVentes = factures
    .filter(f => f.statut === 'Payée')
    .reduce((sum, f) => {
      const lignes = f.lignes || []
      return sum + lignes.reduce((s, l) => {
        const produit = produits.find(p => p.nom === l.description)
        const prixAchat = produit?.prix_achat > 0 ? Number(produit.prix_achat) : 0
        return s + ((Number(l.prix) - prixAchat) * Number(l.quantite))
      }, 0)
    }, 0)

  const benefice = margeVentes - totalDepenses

  async function handleDeconnexion() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#a0bcd8', fontSize: 13, margin: 0 }}>Bienvenue sur</p>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '4px 0 0' }}>ProAppli Facture</h1>
          </div>
          <button
            onClick={handleDeconnexion}
            style={{ background: 'none', border: '1px solid #4A90D9', color: '#a0bcd8', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #2E6DA4' }}>
            <p style={{ color: '#2E6DA4', fontSize: 11, margin: '0 0 4px' }}>FACTURES</p>
            <p style={{ color: '#1A3C5E', fontSize: 26, fontWeight: 700, margin: 0 }}>{factures.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #4A90D9' }}>
            <p style={{ color: '#4A90D9', fontSize: 11, margin: '0 0 4px' }}>CLIENTS</p>
            <p style={{ color: '#1A3C5E', fontSize: 26, fontWeight: 700, margin: 0 }}>{clients.length}</p>
          </div>
        </div>

        <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <p style={{ color: '#a0bcd8', fontSize: 11, margin: '0 0 4px' }}>CHIFFRE D'AFFAIRES</p>
          <p style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{totalFactures.toLocaleString()} FCFA</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #0F6E56' }}>
            <p style={{ color: '#0F6E56', fontSize: 11, margin: '0 0 4px' }}>ENCAISSÉ</p>
            <p style={{ color: '#1A3C5E', fontSize: 16, fontWeight: 700, margin: 0 }}>{totalPayees.toLocaleString()}</p>
            <p style={{ color: '#0F6E56', fontSize: 10, margin: 0 }}>FCFA</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', borderLeft: '4px solid #e53e3e' }}>
            <p style={{ color: '#e53e3e', fontSize: 11, margin: '0 0 4px' }}>DÉPENSES</p>
            <p style={{ color: '#1A3C5E', fontSize: 16, fontWeight: 700, margin: 0 }}>{totalDepenses.toLocaleString()}</p>
            <p style={{ color: '#e53e3e', fontSize: 10, margin: 0 }}>FCFA</p>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontSize: 11, fontWeight: 700, margin: '0 0 8px' }}>MARGE BRUTE</p>
          <p style={{ color: '#2E6DA4', fontSize: 18, fontWeight: 700, margin: 0 }}>{Math.round(margeVentes).toLocaleString()} FCFA</p>
          <p style={{ color: '#a0bcd8', fontSize: 11, margin: '4px 0 0' }}>Après déduction des coûts d'achat</p>
        </div>

        <div style={{ background: benefice >= 0 ? '#0F6E56' : '#e53e3e', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, margin: '0 0 4px' }}>BÉNÉFICE NET</p>
          <p style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{Math.round(benefice).toLocaleString()} FCFA</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: '4px 0 0' }}>Marge brute - Dépenses</p>
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