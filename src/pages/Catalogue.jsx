import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Catalogue() {
  const { produits, ajouterProduit, supprimerProduit } = useApp()
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [unite, setUnite] = useState('')

  function handleAjouter() {
    if (!nom || !prix) return
    ajouterProduit({ nom, prix: Number(prix), unite })
    setNom('')
    setPrix('')
    setUnite('')
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Catalogue</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{produits?.length} produit(s)/service(s)</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Nouveau produit/service</p>
          <input
            style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Nom du produit/service"
            value={nom}
            onChange={e => setNom(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
              placeholder="Prix unitaire"
              type="number"
              value={prix}
              onChange={e => setPrix(e.target.value)}
            />
            <input
              style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
              placeholder="Unité (kg, m, h...)"
              value={unite}
              onChange={e => setUnite(e.target.value)}
            />
          </div>
          <button
            onClick={handleAjouter}
            style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            + Ajouter
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {produits?.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucun produit ajouté</p>
          )}
          {produits?.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  📦
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: 0 }}>{p.nom}</p>
                  <p style={{ fontSize: 13, color: '#2E6DA4', margin: 0 }}>{p.prix?.toLocaleString()} FCFA {p.unite && `/ ${p.unite}`}</p>
                </div>
              </div>
              <button onClick={() => supprimerProduit(p.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}