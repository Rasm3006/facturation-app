import { useState } from 'react'
import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'

export default function Nouveau() {
  const { ajouterFacture, clients, produits } = useApp()
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [objet, setObjet] = useState('')
  const [typeDoc, setTypeDoc] = useState('Facture')
  const [tva, setTva] = useState(false)
  const [conditions, setConditions] = useState('')
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
      setLignes(lignes.map(l => l.id === id ? { ...l, description: produit.nom, prix: Number(produit.prix) } : l))
    }
  }

  function supprimerLigne(id) {
    setLignes(lignes.filter(l => l.id !== id))
  }

  const sousTotal = lignes.reduce((sum, l) => sum + (Number(l.quantite) * Number(l.prix)), 0)
  const montantTVA = tva ? sousTotal * 0.18 : 0
  const total = sousTotal + montantTVA

  function enregistrer() {
    if (!client) return
    ajouterFacture({ client, objet, typeDoc, tva, conditions, lignes, sousTotal, montantTVA, total })
    navigate('/factures')
  }

  const inputStyle = {
    width: '100%', border: '1px solid #dce8f5', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Nouveau Document</h1>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Type de document</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Facture', 'Devis', 'Proforma'].map(t => (
              <button
                key={t}
                onClick={() => setTypeDoc(t)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: typeDoc === t ? '#1A3C5E' : '#F0F7FF',
                  color: typeDoc === t ? '#fff' : '#2E6DA4',
                  border: typeDoc === t ? 'none' : '1px solid #dce8f5'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

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
            placeholder="Objet du document"
            value={objet}
            onChange={e => setObjet(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Conditions de paiement (ex: 30 jours)"
            value={conditions}
            onChange={e => setConditions(e.target.value)}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Lignes</p>
          {lignes.map((l, i) => (
            <div key={l.id} style={{ background: '#F0F7FF', borderRadius: 10, padding: '0.75rem', marginBottom: 8 }}>
              <p style={{ color: '#2E6DA4', fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>Ligne {i + 1}</p>
              <select
                style={{ ...inputStyle, background: '#fff' }}
                onChange={e => choisirProduit(l.id, e.target.value)}
              >
                <option value="">Choisir du catalogue</option>
                {produits.map(p => (
                  <option key={p.id} value={p.id}>{p.nom} — {Number(p.prix).toLocaleString()} FCFA</option>
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
                  inputMode="numeric"
                  value={l.quantite}
                  onChange={e => modifierLigne(l.id, 'quantite', Number(e.target.value) || 0)}
                />
                <input
                  style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, background: '#fff' }}
                  placeholder="Prix unitaire"
                  type="number"
                  inputMode="numeric"
                  value={l.prix}
                  onChange={e => modifierLigne(l.id, 'prix', Number(e.target.value) || 0)}
                />
              </div>
              <p style={{ color: '#2E6DA4', fontSize: 13, fontWeight: 600, margin: '8px 0 4px', textAlign: 'right' }}>
                Sous-total : {(Number(l.quantite) * Number(l.prix)).toLocaleString()} FCFA
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

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>TVA</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setTva(!tva)}
              style={{
                width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: tva ? '#2E6DA4' : '#dce8f5', position: 'relative'
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: tva ? 25 : 3, transition: '0.2s'
              }} />
            </button>
            <span style={{ color: '#1A3C5E', fontSize: 14 }}>
              {tva ? 'TVA 18% activée' : 'Sans TVA'}
            </span>
          </div>
        </div>

        <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ color: '#a0bcd8', margin: 0, fontSize: 13 }}>Sous-total HT</p>
            <p style={{ color: '#fff', margin: 0, fontSize: 13 }}>{sousTotal.toLocaleString()} FCFA</p>
          </div>
          {tva && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ color: '#a0bcd8', margin: 0, fontSize: 13 }}>TVA (18%)</p>
              <p style={{ color: '#fff', margin: 0, fontSize: 13 }}>{Math.round(montantTVA).toLocaleString()} FCFA</p>
            </div>
          )}
          <div style={{ borderTop: '1px solid #2E6DA4', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: '#a0bcd8', margin: 0, fontSize: 14 }}>Total TTC</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: 0 }}>{Math.round(total).toLocaleString()} FCFA</p>
          </div>
        </div>

        <button
          onClick={enregistrer}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}