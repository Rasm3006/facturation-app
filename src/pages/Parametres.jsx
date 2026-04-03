import { useState, useEffect } from 'react'

export default function Parametres() {
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [ifu, setIfu] = useState('')
  const [rccm, setRccm] = useState('')
  const [logo, setLogo] = useState('')
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
      setRccm(e.rccm || '')
      setLogo(e.logo || '')
    }
  }, [])

  function handleLogo(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    const entreprise = { nom, adresse, telephone, email, ifu, rccm, logo }
    localStorage.setItem('entreprise', JSON.stringify(entreprise))
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const inputStyle = {
    width: '100%', border: '1px solid #dce8f5', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', marginBottom: 8
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Paramètres</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>Informations de votre entreprise</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: 12, border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Logo de l'entreprise</p>
          
          {logo && (
            <div style={{ marginBottom: 12, textAlign: 'center' }}>
              <img src={logo} alt="Logo" style={{ maxHeight: 80, maxWidth: 200, objectFit: 'contain' }} />
            </div>
          )}

          <label style={{ display: 'block', background: '#F0F7FF', border: '2px dashed #4A90D9', borderRadius: 8, padding: '12px', textAlign: 'center', cursor: 'pointer', marginBottom: 8 }}>
            <span style={{ color: '#2E6DA4', fontSize: 13, fontWeight: 600 }}>
              {logo ? 'Changer le logo' : '+ Charger le logo (PNG/JPG)'}
            </span>
            <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
          <p style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>Mon entreprise</p>
          <input style={inputStyle} placeholder="Nom de l'entreprise" value={nom} onChange={e => setNom(e.target.value)} />
          <input style={inputStyle} placeholder="Adresse" value={adresse} onChange={e => setAdresse(e.target.value)} />
          <input style={inputStyle} placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} />
          <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={inputStyle} placeholder="IFU (optionnel)" value={ifu} onChange={e => setIfu(e.target.value)} />
          <input style={inputStyle} placeholder="RCCM (optionnel)" value={rccm} onChange={e => setRccm(e.target.value)} />

          {success && (
            <p style={{ color: '#0F6E56', background: '#E1F5EE', padding: '8px 12px', borderRadius: 8, fontSize: 13, margin: '0 0 12px' }}>
              ✓ Informations sauvegardées
            </p>
          )}

          <button
            onClick={handleSave}
            style={{ width: '100%', background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )
}