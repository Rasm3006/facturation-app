import { useApp } from '../AppContext'
import { generatePDF } from '../utils/generatePDF'

export default function Factures() {
  const { factures } = useApp()

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
          {factures.map(f => (
            <div key={f.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1A3C5E', margin: '0 0 4px', fontSize: 15 }}>{f.client}</p>
                  <p style={{ fontSize: 13, color: '#4A90D9', margin: '0 0 4px' }}>{f.objet}</p>
                  <p style={{ fontSize: 12, color: '#a0bcd8', margin: 0 }}>{f.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#2E6DA4', margin: '0 0 6px', fontSize: 15 }}>{f.total?.toLocaleString()} FCFA</p>
                  <span style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Payée</span>
                </div>
              </div>
              <button
                onClick={() => generatePDF(f)}
                style={{ width: '100%', background: '#F0F7FF', color: '#2E6DA4', border: '1px solid #4A90D9', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Télécharger PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}