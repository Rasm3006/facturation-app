import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Parametres() {
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [ifu, setIfu] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('entreprise')
    if (data) {
      const e = JSON.parse(data)
      setNom(e.nom || '')
      setAdresse(e.adresse || '')
      setTelephone(e.telephone || '')
      setEmail(e.email || '')
      setIfu(e.ifu || '')
    }
  }, [])

  function handleSave() {
    setSaving(true)
    const entreprise = { nom, adresse, telephone, email, ifu }
    localStorage.setItem('entreprise', JSON.stringify(entreprise))
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #dce8f5',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 14,
    boxSizing: 'border-box',
    marginBottom: 8
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Paramètres</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>Informations de votre entreprise</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Mon entreprise</p>

          <input style={inputStyle} placeholder="Nom de l'entreprise" value={nom} onChange={e => setNom(e.target.value)} />
          <input style={inputStyle} placeholder="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} />
          <input style={inputStyle} placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} />
          <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={inputStyle} placeholder="IFU (optionnel)" value={ifu} onChange={e => setIfu(e.target.value)} />

          {success && (
            <p style={{ color: '#0F6E56', background: '#E1F5EE', padding: '8px 12px', borderRadius: 8, fontSize: 13, margin: '0 0 12px' }}>
              ✓ Informations sauvegardées
            </p>
          )}

          <button
            onClick={handleSave}
            style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}