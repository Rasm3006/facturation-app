import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Catalogue() {
  const { produits, ajouterProduit, supprimerProduit } = useApp()
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [prixAchat, setPrixAchat] = useState('')
  const [unite, setUnite] = useState('')

  function handleAjouter() {
    if (!nom || !prix) return
    ajouterProduit({ nom, prix: Number(prix), prixAchat: Number(prixAchat) || 0, unite })
    setNom('')
    setPrix('')
    setPrixAchat('')
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
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
              placeholder="Prix de vente"
              type="number"
              inputMode="numeric"
              value={prix}
              onChange={e => setPrix(e.target.value)}
            />
            <input
              style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
              placeholder="Prix d'achat (optionnel)"
              type="number"
              inputMode="numeric"
              value={prixAchat}
              onChange={e => setPrixAchat(e.target.value)}
            />
          </div>
          <input
            style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Unité (kg, m, h...) optionnel"
            value={unite}
            onChange={e => setUnite(e.target.value)}
          />
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
          {produits?.map(p => {
            const marge = p.prix_achat > 0 ? Number(p.prix) - Number(p.prix_achat) : null
            const margePercent = marge ? Math.round((marge / Number(p.prix)) * 100) : null
            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      📦
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1A3C5E', margin: 0 }}>{p.nom}</p>
                      <p style={{ fontSize: 13, color: '#2E6DA4', margin: '2px 0 0' }}>
                        Vente : {Number(p.prix).toLocaleString()} FCFA {p.unite && `/ ${p.unite}`}
                      </p>
                      {p.prix_achat > 0 && (
                        <p style={{ fontSize: 12, color: '#a0bcd8', margin: '2px 0 0' }}>
                          Achat : {Number(p.prix_achat).toLocaleString()} FCFA
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {marge !== null && (
                      <span style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                        +{marge.toLocaleString()} ({margePercent}%)
                      </span>
                    )}
                    <br />
                    <button onClick={() => supprimerProduit(p.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 18, cursor: 'pointer', marginTop: 4 }}>✕</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}