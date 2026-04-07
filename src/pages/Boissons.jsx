import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Boissons() {
  const [boissons, setBoissons] = useState([])
  const [userId, setUserId] = useState(null)
  const [nom, setNom] = useState('')
  const [stockInitial, setStockInitial] = useState('')
  const [prixVente, setPrixVente] = useState('')
  const [prixAchat, setPrixAchat] = useState('')
  const [seuilAlerte, setSeuilAlerte] = useState(10)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id)
    })
    chargerBoissons()
  }, [])

  async function chargerBoissons() {
    const { data } = await supabase.from('boissons').select('*').order('nom')
    if (data) setBoissons(data)
  }

  async function ajouterBoisson() {
    if (!nom || !stockInitial || !prixVente || !userId) return
    const { data, error } = await supabase.from('boissons').insert([{
      user_id: userId,
      nom,
      stock_initial: Number(stockInitial),
      stock_actuel: Number(stockInitial),
      prix_vente: Number(prixVente),
      prix_achat: Number(prixAchat) || 0,
      seuil_alerte: Number(seuilAlerte)
    }]).select()
    if (error) { console.error(error); return }
    if (data) {
      setBoissons([...boissons, data[0]])
      setNom(''); setStockInitial(''); setPrixVente(''); setPrixAchat(''); setSeuilAlerte(10)
      setShowForm(false)
    }
  }

  async function supprimerBoisson(id) {
    await supabase.from('boissons').delete().eq('id', id)
    setBoissons(boissons.filter(b => b.id !== id))
  }

  const inputStyle = {
    width: '100%', border: '1px solid #dce8f5', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Boissons</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{boissons.length} type(s) de boisson</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
        >
          + Nouvelle boisson
        </button>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
            <input style={inputStyle} placeholder="Nom (ex: Brakina, Castel...)" value={nom} onChange={e => setNom(e.target.value)} />
            <input style={inputStyle} placeholder="Stock initial (nombre de bouteilles)" type="number" inputMode="numeric" value={stockInitial} onChange={e => setStockInitial(e.target.value)} />
            <input style={inputStyle} placeholder="Prix de vente unitaire" type="number" inputMode="numeric" value={prixVente} onChange={e => setPrixVente(e.target.value)} />
            <input style={inputStyle} placeholder="Prix d'achat unitaire (optionnel)" type="number" inputMode="numeric" value={prixAchat} onChange={e => setPrixAchat(e.target.value)} />
            <input style={inputStyle} placeholder="Seuil d'alerte (défaut: 10)" type="number" inputMode="numeric" value={seuilAlerte} onChange={e => setSeuilAlerte(e.target.value)} />
            <button
              onClick={ajouterBoisson}
              style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Enregistrer
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {boissons.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune boisson enregistrée</p>
          )}
          {boissons.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: b.stock_actuel <= b.seuil_alerte ? '1px solid #e53e3e' : '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: '0 0 4px', fontSize: 15 }}>{b.nom}</p>
                  <p style={{ fontSize: 13, color: '#2E6DA4', margin: '0 0 2px' }}>Vente : {Number(b.prix_vente).toLocaleString()} FCFA</p>
                  {b.prix_achat > 0 && (
                    <p style={{ fontSize: 12, color: '#a0bcd8', margin: '0 0 2px' }}>Achat : {Number(b.prix_achat).toLocaleString()} FCFA</p>
                  )}
                  <p style={{ fontSize: 13, color: '#a0bcd8', margin: 0 }}>Stock initial : {b.stock_initial}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 22, margin: '0 0 4px', color: b.stock_actuel <= b.seuil_alerte ? '#e53e3e' : '#0F6E56' }}>
                    {b.stock_actuel}
                  </p>
                  <p style={{ fontSize: 11, color: '#a0bcd8', margin: '0 0 8px' }}>en stock</p>
                  {b.stock_actuel <= b.seuil_alerte && (
                    <span style={{ background: '#FCEAEA', color: '#e53e3e', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                      ⚠️ Stock bas
                    </span>
                  )}
                  <br />
                  <button onClick={() => supprimerBoisson(b.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 16, cursor: 'pointer', marginTop: 4 }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}