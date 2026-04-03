import { useState } from 'react'
import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'

export default function Nouveau() {
  const { ajouterFacture, clients, produits } = useApp()
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [objet, setObjet] = useState('')
  const [lignes, setLignes] = useState([
    { id: Date.now(), description: '', quantite: 1, prix: 0 }
  ])

  function ajouterLigne() {
    setLignes([...lignes, { id: Date.now(), description: '', quantite: 1, prix: 0 }])
  }

  function modifierLigne(id, champ, valeur) {
    setLignes(lignes.map(l => l.id === id ? { ...l, [champ]: valeur } : l))
  }

  function choisirProduit(id, produitId) {
    const produit = produits.find(p => p.id === produitId)
    if (produit) {
      setLignes(lignes.map(l => l.id === id ? { ...l, description: produit.nom, prix: produit.prix } : l))
    }
  }

  function supprimerLigne(id) {
    setLignes(lignes.filter(l => l.id !== id))
  }

  const total = lignes.reduce((sum, l) => sum + (l.quantite * l.prix), 0)

  function enregistrer() {
    if (!client) return
    ajouterFacture({ client, objet, lignes, total })
    navigate('/factures')
  }

  const inputStyle = { width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8 }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Nouvelle Facture</h1>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Informations</p>
          <select
            style={{ ...inputStyle, color: client ? '#1A3C5E' : '#a0bcd8' }}
            value={client}
            onChange={e => setClient(e.target.value)}
          >
            <option value="">Sélectionner un client</option>
            {clients.map(c => (
              <option key={c.id} value={c.nom}>{c.nom}</option>
            ))}
          </select>
          <input
            style={inputStyle}
            placeholder="Objet de la facture"
            value={objet}
            onChange={e => setObjet(e.target.value)}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Lignes de facture</p>
          {lignes.map((l, i) => (
            <div key={l.id} style={{ background: '#F0F7FF', borderRadius: 10, padding: '0.75rem', marginBottom: 8 }}>
              <p style={{ color: '#2E6DA4', fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>Ligne {i + 1}</p>
              <select
                style={{ ...inputStyle, background: '#fff' }}
                onChange={e => choisirProduit(l.id, e.target.value)}
              >
                <option value="">Choisir du catalogue</option>
                {produits.map(p => (
                  <option key={p.id} value={p.id}>{p.nom} — {p.prix?.toLocaleString()} FCFA</option>
                ))}
              </select>
              <input
                style={{ ...inputStyle, background: '#fff' }}
                placeholder="Description"
                value={l.description}
                onChange={e => modifierLigne(l.id, 'description', e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#fff' }}
                  placeholder="Qté"
                  type="number"
                  value={l.quantite}
                  onChange={e => modifierLigne(l.id, 'quantite', Number(e.target.value))}
                />
                <input
                  style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#fff' }}
                  placeholder="Prix unitaire"
                  type="number"
                  value={l.prix}
                  onChange={e => modifierLigne(l.id, 'prix', Number(e.target.value))}
                />
              </div>
              <p style={{ color: '#2E6DA4', fontSize: 13, fontWeight: 600, margin: '8px 0 4px', textAlign: 'right' }}>
                Sous-total : {(l.quantite * l.prix).toLocaleString()} FCFA
              </p>
              {lignes.length > 1 && (
                <button onClick={() => supprimerLigne(l.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 13, cursor: 'pointer', padding: 0 }}>
                  Supprimer cette ligne
                </button>
              )}
            </div>
          ))}
          <button
            onClick={ajouterLigne}
            style={{ width: '100%', background: 'none', border: '2px dashed #4A90D9', color: '#2E6DA4', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            + Ajouter une ligne
          </button>
        </div>

        <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#a0bcd8', margin: 0, fontSize: 14 }}>Total</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>{total.toLocaleString()} FCFA</p>
          </div>
        </div>

        <button
          onClick={enregistrer}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          Enregistrer la facture
        </button>
      </div>
    </div>
  )
}