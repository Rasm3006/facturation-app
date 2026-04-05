import { useApp } from '../AppContext'
import { generatePDF } from '../utils/generatePDF'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Factures() {
  const { factures, setFactures } = useApp()
  const navigate = useNavigate()

  async function changerStatut(id, statut) {
    await supabase.from('factures').update({ statut }).eq('id', id)
    setFactures(factures.map(f => f.id === id ? { ...f, statut } : f))
  }

  function couleurStatut(statut) {
    if (statut === 'Payée') return { bg: '#E1F5EE', color: '#0F6E56' }
    if (statut === 'Annulée') return { bg: '#FCEAEA', color: '#e53e3e' }
    return { bg: '#FFF8E7', color: '#854F0B' }
  }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Mes Factures</h1>
        <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>{factures.length} facture(s)</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {factures.length === 0 && (
          <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune facture enregistrée</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {factures.map(f => {
            const s = couleurStatut(f.statut || 'En attente')
            return (
              <div key={f.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A3C5E', margin: '0 0 4px', fontSize: 15 }}>{f.client}</p>
                    <p style={{ fontSize: 13, color: '#4A90D9', margin: '0 0 4px' }}>{f.objet}</p>
                    <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>{f.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#2E6DA4', margin: '0 0 6px', fontSize: 15 }}>{f.total?.toLocaleString()} FCFA</p>
                    <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      {f.statut || 'En attente'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {['En attente', 'Payée', 'Annulée'].map(st => (
                    <button
                      key={st}
                      onClick={() => changerStatut(f.id, st)}
                      style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        background: (f.statut || 'En attente') === st ? '#1A3C5E' : '#F0F7FF',
                        color: (f.statut || 'En attente') === st ? '#fff' : '#2E6DA4',
                        border: 'none'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => navigate(`/modifier/${f.id}`)}
                    style={{ flex: 1, background: '#F0F7FF', color: '#1A3C5E', border: '1px solid #dce8f5', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => generatePDF(f)}
                    style={{ flex: 1, background: '#F0F7FF', color: '#2E6DA4', border: '1px solid #4A90D9', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => {
                      const entreprise = JSON.parse(localStorage.getItem('entreprise') || '{}')
                      const message = `Bonjour ${f.client},\n\nVeuillez trouver ci-joint votre ${f.typedoc || 'facture'} N° FAC-${f.id?.toString().slice(-4).toUpperCase()} d'un montant de ${f.total?.toLocaleString()} FCFA.\n\n📎 Pour recevoir le document PDF, merci de nous contacter.\n\nCordialement,\n${entreprise.nom || 'Notre entreprise'}\n${entreprise.telephone || ''}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                    style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    📱 WA
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}