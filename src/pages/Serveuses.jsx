import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Serveuses() {
  const [serveuses, setServeuses] = useState([])
  const [userId, setUserId] = useState(null)
  const [nom, setNom] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id)
    })
    chargerServeuses()
  }, [])

  async function chargerServeuses() {
    const { data } = await supabase.from('serveuses').select('*').order('nom')
    if (data) setServeuses(data)
  }

  async function ajouterServeuse() {
    if (!nom || !userId) return
    const { data } = await supabase.from('serveuses').insert([{
      user_id: userId, nom: nom.trim()
    }]).select()
    if (data) {
      setServeuses([...serveuses, data[0]])
      setNom('')
    }
  }

  async function supprimerServeuse(id) {
    await supabase.from('serveuses').delete().eq('id', id)
    setServeuses(serveuses.filter(s => s.id !== id))
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Serveuses</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{serveuses.length} serveuse(s)</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Ajouter une serveuse</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', fontSize: 14 }}
              placeholder="Nom de la serveuse"
              value={nom}
              onChange={e => setNom(e.target.value)}
            />
            <button
              onClick={ajouterServeuse}
              style={{ background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {serveuses.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune serveuse enregistrée</p>
          )}
          {serveuses.map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A3C5E', fontWeight: 700, fontSize: 14 }}>
                  {s.nom.charAt(0).toUpperCase()}
                </div>
                <p style={{ fontWeight: 600, color: '#1A3C5E', margin: 0 }}>{s.nom}</p>
              </div>
              <button onClick={() => supprimerServeuse(s.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}