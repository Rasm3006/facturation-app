import { useState } from 'react'
import { useApp } from '../AppContext'
import { supabase } from '../supabase'

const CATEGORIES = ['Loyer', 'Salaires', 'Fournitures', 'Transport', 'Communication', 'Autres']

export default function Depenses() {
  const { depenses, setDepenses, ajouterDepense, supprimerDepense } = useApp()
  const [libelle, setLibelle] = useState('')
  const [montant, setMontant] = useState('')
  const [categorie, setCategorie] = useState('Autres')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editMontant, setEditMontant] = useState('')

  function handleAjouter() {
    if (!libelle || !montant) return
    ajouterDepense({ libelle, montant: Number(montant), categorie, date: new Date().toLocaleDateString() })
    setLibelle('')
    setMontant('')
    setCategorie('Autres')
    setShowForm(false)
  }

  async function handleModifier(id) {
    const { data } = await supabase.from('depenses').update({ montant: Number(editMontant) }).eq('id', id).select()
    if (data) {
      setDepenses(depenses.map(d => d.id === id ? { ...d, montant: Number(editMontant) } : d))
      setEditId(null)
      setEditMontant('')
    }
  }

  const total = depenses?.reduce((sum, d) => sum + Number(d.montant), 0) || 0

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Dépenses</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>Total : {total.toLocaleString()} FCFA</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
        >
          + Nouvelle dépense
        </button>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
            <input
              style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8 }}
              placeholder="Libellé (ex: Loyer bureau)"
              value={libelle}
              onChange={e => setLibelle(e.target.value)}
            />
            <input
              style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8 }}
              placeholder="Montant"
              type="number"
              inputMode="numeric"
              value={montant}
              onChange={e => setMontant(e.target.value)}
            />
            <select
              style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }}
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={handleAjouter}
              style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Enregistrer
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {depenses?.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune dépense enregistrée</p>
          )}
          {depenses?.map(d => (
            <div key={d.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: '0 0 4px' }}>{d.libelle}</p>
                  <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>{d.categorie} — {d.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#e53e3e', margin: '0 0 6px' }}>{Number(d.montant).toLocaleString()} FCFA</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => { setEditId(d.id); setEditMontant(d.montant) }}
                      style={{ background: '#F0F7FF', border: '1px solid #dce8f5', color: '#2E6DA4', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => supprimerDepense(d.id)}
                      style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 16, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {editId === d.id && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
                    type="number"
                    inputMode="numeric"
                    value={editMontant}
                    onChange={e => setEditMontant(e.target.value)}
                  />
                  <button
                    onClick={() => handleModifier(d.id)}
                    style={{ background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    style={{ background: '#F0F7FF', color: '#e53e3e', border: '1px solid #dce8f5', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}