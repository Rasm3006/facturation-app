import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Clients() {
  const { clients, ajouterClient, supprimerClient } = useApp()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')

  function handleAjouter() {
    if (!nom) return
    ajouterClient({ nom, telephone })
    setNom('')
    setTelephone('')
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Mes Clients</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{clients.length} client(s) enregistré(s)</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Nouveau client</p>
          <input
            style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Nom du client"
            value={nom}
            onChange={e => setNom(e.target.value)}
          />
          <input
            style={{ width: '100%', border: '1px solid #dce8f5', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Téléphone"
            value={telephone}
            onChange={e => setTelephone(e.target.value)}
          />
          <button
            onClick={handleAjouter}
            style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            + Ajouter
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {clients.length === 0 && (
            <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucun client ajouté</p>
          )}
          {clients.map(c => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A3C5E', fontWeight: 700, fontSize: 14 }}>
                  {c.nom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: 0 }}>{c.nom}</p>
                  <p style={{ fontSize: 13, color: '#4A90D9', margin: 0 }}>{c.telephone}</p>
                </div>
              </div>
              <button onClick={() => supprimerClient(c.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}