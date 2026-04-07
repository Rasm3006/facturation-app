import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function TableauBoissons() {
  const [boissons, setBoissons] = useState([])
  const [ventes, setVentes] = useState([])
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    chargerDonnees()
  }, [])

  async function chargerDonnees() {
    const { data: b } = await supabase.from('boissons').select('*').order('nom')
    const { data: v } = await supabase.from('ventes_boissons').select('*, boissons(nom, prix_vente)').order('created_at', { ascending: false })
    if (b) setBoissons(b)
    if (v) setVentes(v)
  }

  const dateFormatee = new Date(dateSelectionnee).toLocaleDateString('fr-FR')
  const ventesJour = ventes.filter(v => v.date === dateFormatee)
  const totalJour = ventesJour.reduce((sum, v) => sum + Number(v.montant), 0)
  const totalAvoirs = ventesJour.reduce((sum, v) => sum + Number(v.avoir || 0), 0)
  const netEncaisser = totalJour - totalAvoirs

  const parBoisson = boissons.map(b => {
    const ventesB = ventesJour.filter(v => v.boisson_id === b.id)
    const qteVendue = ventesB.reduce((sum, v) => sum + Number(v.quantite), 0)
    const montant = ventesB.reduce((sum, v) => sum + Number(v.montant), 0)
    const avoir = ventesB.reduce((sum, v) => sum + Number(v.avoir || 0), 0)
    const marge = b.prix_achat > 0 ? (Number(b.prix_vente) - Number(b.prix_achat)) * qteVendue : null
    return { ...b, qteVendue, montant, avoir, marge }
  }).filter(b => b.qteVendue > 0 || b.stock_actuel <= b.seuil_alerte)

  const parServeuse = ventesJour.reduce((acc, v) => {
    const existing = acc.find(s => s.serveuse === v.serveuse)
    if (existing) {
      existing.quantite += Number(v.quantite)
      existing.montant += Number(v.montant)
      existing.avoir += Number(v.avoir || 0)
    } else {
      acc.push({ serveuse: v.serveuse, quantite: Number(v.quantite), montant: Number(v.montant), avoir: Number(v.avoir || 0) })
    }
    return acc
  }, []).sort((a, b) => b.montant - a.montant)

  const alertes = boissons.filter(b => b.stock_actuel <= b.seuil_alerte)

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Tableau de bord</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>Analyse des ventes boissons</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 13, margin: '0 0 8px' }}>Sélectionner une date</p>
          <input
            type="date"
            value={dateSelectionnee}
            onChange={e => setDateSelectionnee(e.target.value)}
            style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        {alertes.length > 0 && (
          <div style={{ background: '#FCEAEA', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '1px solid #e53e3e' }}>
            <p style={{ color: '#e53e3e', fontWeight: 700, fontSize: 14, margin: '0 0 8px' }}>⚠️ Alertes stock bas</p>
            {alertes.map(b => (
              <p key={b.id} style={{ color: '#e53e3e', fontSize: 13, margin: '0 0 4px' }}>
                {b.nom} : {b.stock_actuel} restant(s) (seuil : {b.seuil_alerte})
              </p>
            ))}
          </div>
        )}

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

        {parBoisson.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
            <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Par boisson</p>
            {parBoisson.map(b => (
              <div key={b.id} style={{ padding: '8px 0', borderBottom: '0.5px solid #dce8f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1A3C5E', margin: '0 0 2px' }}>{b.nom}</p>
                    <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>
                      Vendu : {b.qteVendue} | Stock : {b.stock_actuel}
                      {b.avoir > 0 && ` | Avoir : ${b.avoir.toLocaleString()} FCFA`}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#2E6DA4', margin: '0 0 2px' }}>{b.montant.toLocaleString()} FCFA</p>
                    {b.marge !== null && (
                      <p style={{ fontSize: 11, color: '#0F6E56', margin: 0 }}>Marge : {b.marge.toLocaleString()} FCFA</p>
                    )}
                    {b.stock_actuel <= b.seuil_alerte && (
                      <span style={{ background: '#FCEAEA', color: '#e53e3e', fontSize: 10, padding: '2px 6px', borderRadius: 20 }}>⚠️ Stock bas</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {parServeuse.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
            <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Par serveuse</p>
            {parServeuse.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid #dce8f5' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#1A3C5E', margin: '0 0 2px' }}>{s.serveuse}</p>
                  <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>
                    {s.quantite} bouteille(s)
                    {s.avoir > 0 && ` | Avoir : ${s.avoir.toLocaleString()} FCFA`}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#2E6DA4', margin: '0 0 2px' }}>{s.montant.toLocaleString()} FCFA</p>
                  {s.avoir > 0 && (
                    <p style={{ fontSize: 11, color: '#0F6E56', margin: 0 }}>Net : {(s.montant - s.avoir).toLocaleString()} FCFA</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {ventesJour.length === 0 && alertes.length === 0 && (
          <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune donnée pour cette date</p>
        )}

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Stock actuel</p>
          {boissons.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid #dce8f5' }}>
              <p style={{ fontWeight: 600, color: '#1A3C5E', margin: 0 }}>{b.nom}</p>
              <p style={{ fontWeight: 700, color: b.stock_actuel <= b.seuil_alerte ? '#e53e3e' : '#0F6E56', margin: 0, fontSize: 16 }}>
                {b.stock_actuel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}