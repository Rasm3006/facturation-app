import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function VentesBoissons() {
  const [boissons, setBoissons] = useState([])
  const [serveuses, setServeuses] = useState([])
  const [ventes, setVentes] = useState([])
  const [userId, setUserId] = useState(null)
  const [boissonId, setBoissonId] = useState('')
  const [serveuse, setServeuse] = useState('')
  const [quantite, setQuantite] = useState('')
  const [avoir, setAvoir] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editVente, setEditVente] = useState(null)

  const today = new Date().toLocaleDateString()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id)
    })
    chargerBoissons()
    chargerServeuses()
    chargerVentes()
  }, [])

  async function chargerBoissons() {
    const { data } = await supabase.from('boissons').select('*').order('nom')
    if (data) setBoissons(data)
  }

  async function chargerServeuses() {
    const { data } = await supabase.from('serveuses').select('*').order('nom')
    if (data) setServeuses(data)
  }

  async function chargerVentes() {
    const { data } = await supabase.from('ventes_boissons').select('*, boissons(nom, prix_vente)').order('created_at', { ascending: false })
    if (data) setVentes(data)
  }

  async function enregistrerVente() {
    if (!boissonId || !serveuse || !quantite || !userId) return
    const boisson = boissons.find(b => b.id === boissonId)
    if (!boisson) return

    const montant = Number(quantite) * Number(boisson.prix_vente)

    const { data, error } = await supabase.from('ventes_boissons').insert([{
      user_id: userId,
      boisson_id: boissonId,
      serveuse: serveuse.trim(),
      quantite: Number(quantite),
      montant,
      avoir: Number(avoir) || 0,
      date: today
    }]).select('*, boissons(nom, prix_vente)')

    if (error) { console.error(error); return }

    await supabase.from('boissons').update({
      stock_actuel: boisson.stock_actuel - Number(quantite)
    }).eq('id', boissonId)

    setBoissons(boissons.map(b => b.id === boissonId ? { ...b, stock_actuel: b.stock_actuel - Number(quantite) } : b))
    if (data) setVentes([data[0], ...ventes])
    setBoissonId(''); setServeuse(''); setQuantite(''); setAvoir('')
    setShowForm(false)
  }

  async function modifierVente() {
    if (!editVente || !boissonId || !serveuse || !quantite) return
    const boisson = boissons.find(b => b.id === boissonId)
    if (!boisson) return

    const ancienneBoisson = boissons.find(b => b.id === editVente.boisson_id)
    const montant = Number(quantite) * Number(boisson.prix_vente)

    const { data, error } = await supabase.from('ventes_boissons').update({
      boisson_id: boissonId,
      serveuse: serveuse.trim(),
      quantite: Number(quantite),
      montant,
      avoir: Number(avoir) || 0
    }).eq('id', editVente.id).select('*, boissons(nom, prix_vente)')

    if (error) { console.error(error); return }

    if (ancienneBoisson) {
      await supabase.from('boissons').update({
        stock_actuel: ancienneBoisson.stock_actuel + Number(editVente.quantite)
      }).eq('id', ancienneBoisson.id)
    }

    await supabase.from('boissons').update({
      stock_actuel: boisson.stock_actuel - Number(quantite)
    }).eq('id', boissonId)

    await chargerBoissons()
    if (data) setVentes(ventes.map(v => v.id === editVente.id ? data[0] : v))
    setEditVente(null)
    setBoissonId(''); setServeuse(''); setQuantite(''); setAvoir('')
    setShowForm(false)
  }

  function ouvrirModification(v) {
    setEditVente(v)
    setBoissonId(v.boisson_id)
    setServeuse(v.serveuse)
    setQuantite(v.quantite)
    setAvoir(v.avoir || '')
    setShowForm(true)
  }

  const ventesAujourdhui = ventes.filter(v => v.date === today)
  const totalJour = ventesAujourdhui.reduce((sum, v) => sum + Number(v.montant), 0)
  const totalAvoirs = ventesAujourdhui.reduce((sum, v) => sum + Number(v.avoir || 0), 0)
  const netEncaisser = totalJour - totalAvoirs

  const inputStyle = {
    width: '100%', border: '1px solid #dce8f5', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Ventes du jour</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{today}</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#a0bcd8', fontSize: 10, margin: '0 0 4px' }}>VENTES</p>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{totalJour.toLocaleString()}</p>
            <p style={{ color: '#4A90D9', fontSize: 10, margin: 0 }}>FCFA</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '0.75rem', textAlign: 'center', border: '0.5px solid #dce8f5' }}>
            <p style={{ color: '#e53e3e', fontSize: 10, margin: '0 0 4px' }}>AVOIRS</p>
            <p style={{ color: '#1A3C5E', fontSize: 14, fontWeight: 700, margin: 0 }}>{totalAvoirs.toLocaleString()}</p>
            <p style={{ color: '#e53e3e', fontSize: 10, margin: 0 }}>FCFA</p>
          </div>
          <div style={{ background: '#0F6E56', borderRadius: 12, padding: '0.75rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '0 0 4px' }}>NET</p>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{netEncaisser.toLocaleString()}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: 0 }}>FCFA</p>
          </div>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); setEditVente(null); setBoissonId(''); setServeuse(''); setQuantite(''); setAvoir('') }}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
        >
          + Enregistrer une vente
        </button>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
            <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>
              {editVente ? 'Modifier la vente' : 'Nouvelle vente'}
            </p>
            <select style={{ ...inputStyle, color: boissonId ? '#1A3C5E' : '#a0bcd8' }} value={boissonId} onChange={e => setBoissonId(e.target.value)}>
              <option value="">Sélectionner une boisson</option>
              {boissons.map(b => (
                <option key={b.id} value={b.id}>{b.nom} — Stock : {b.stock_actuel}</option>
              ))}
            </select>
            <select style={{ ...inputStyle, color: serveuse ? '#1A3C5E' : '#a0bcd8' }} value={serveuse} onChange={e => setServeuse(e.target.value)}>
              <option value="">Sélectionner une serveuse</option>
              {serveuses.map(s => (
                <option key={s.id} value={s.nom}>{s.nom}</option>
              ))}
            </select>
            <input style={inputStyle} placeholder="Quantité vendue" type="number" inputMode="numeric" value={quantite} onChange={e => setQuantite(e.target.value)} />
            <input style={inputStyle} placeholder="Avoir (manque de monnaie) en FCFA" type="number" inputMode="numeric" value={avoir} onChange={e => setAvoir(e.target.value)} />
            {boissonId && quantite && (
              <p style={{ color: '#2E6DA4', fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>
                Montant : {(Number(quantite) * Number(boissons.find(b => b.id === boissonId)?.prix_vente || 0)).toLocaleString()} FCFA
                {avoir > 0 && ` | Avoir : ${Number(avoir).toLocaleString()} FCFA`}
              </p>
            )}
            <button
              onClick={editVente ? modifierVente : enregistrerVente}
              style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              {editVente ? 'Sauvegarder' : 'Enregistrer'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ventesAujourdhui.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune vente aujourd'hui</p>
          )}
          {ventesAujourdhui.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: '0 0 4px' }}>{v.boissons?.nom}</p>
                  <p style={{ fontSize: 13, color: '#4A90D9', margin: '0 0 2px' }}>Serveuse : {v.serveuse}</p>
                  <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>Qté : {v.quantite}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#2E6DA4', fontSize: 15, margin: '0 0 4px' }}>{Number(v.montant).toLocaleString()} FCFA</p>
                  {v.avoir > 0 && (
                    <p style={{ fontSize: 12, color: '#e53e3e', margin: 0 }}>Avoir : {Number(v.avoir).toLocaleString()} FCFA</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => ouvrirModification(v)}
                style={{ width: '100%', background: '#F0F7FF', color: '#2E6DA4', border: '1px solid #dce8f5', borderRadius: 8, padding: '6px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                ✏️ Modifier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}