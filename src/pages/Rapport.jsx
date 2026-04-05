import { useApp } from '../AppContext'
import { generateRapportPDF } from '../utils/generateRapportPDF'

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export default function Rapport() {
  const { factures, depenses } = useApp()

  const anneeActuelle = new Date().getFullYear()

  function filtrerParMois(items, mois, annee) {
    return items?.filter(item => {
      const parts = item.date?.split('/')
      if (!parts || parts.length < 3) return false
      return parseInt(parts[1]) - 1 === mois && parseInt(parts[2]) === annee
    }) || []
  }

  const rapports = MOIS.map((nom, index) => {
    const facturesMois = filtrerParMois(factures, index, anneeActuelle)
    const depensesMois = filtrerParMois(depenses, index, anneeActuelle)
    const ca = facturesMois.reduce((sum, f) => sum + Number(f.total), 0)
    const encaisse = facturesMois.filter(f => f.statut === 'Payée').reduce((sum, f) => sum + Number(f.total), 0)
    const totalDepenses = depensesMois.reduce((sum, d) => sum + Number(d.montant), 0)
    const benefice = encaisse - totalDepenses
    return { nom, index, ca, encaisse, totalDepenses, benefice, nbFactures: facturesMois.length }
  }).filter(r => r.ca > 0 || r.totalDepenses > 0)

  const caTotal = rapports.reduce((sum, r) => sum + r.ca, 0)
  const depensesTotal = rapports.reduce((sum, r) => sum + r.totalDepenses, 0)
  const beneficeTotal = rapports.reduce((sum, r) => sum + r.benefice, 0)

  const totaux = { ca: caTotal, depenses: depensesTotal, benefice: beneficeTotal }

  return (
    <div style={{ background: '#F0F7FF', minHeight: '100vh' }}>
      <div style={{ background: '#1A3C5E', padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Rapport {anneeActuelle}</h1>
            <p style={{ color: '#a0bcd8', fontSize: 13, margin: '4px 0 0' }}>Bilan mensuel</p>
          </div>
          <button
            onClick={() => generateRapportPDF(rapports, anneeActuelle, totaux)}
            style={{ background: '#2E6DA4', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            📄 PDF
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#1A3C5E', borderRadius: 12, padding: '1rem', marginBottom: 16 }}>
          <p style={{ color: '#a0bcd8', fontSize: 11, margin: '0 0 12px', fontWeight: 700 }}>BILAN ANNUEL</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a0bcd8', fontSize: 10, margin: '0 0 4px' }}>CA</p>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{caTotal.toLocaleString()}</p>
              <p style={{ color: '#4A90D9', fontSize: 10, margin: 0 }}>FCFA</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a0bcd8', fontSize: 10, margin: '0 0 4px' }}>DÉPENSES</p>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{depensesTotal.toLocaleString()}</p>
              <p style={{ color: '#e53e3e', fontSize: 10, margin: 0 }}>FCFA</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a0bcd8', fontSize: 10, margin: '0 0 4px' }}>BÉNÉFICE</p>
              <p style={{ color: beneficeTotal >= 0 ? '#5DCAA5' : '#e53e3e', fontSize: 14, fontWeight: 700, margin: 0 }}>{beneficeTotal.toLocaleString()}</p>
              <p style={{ color: beneficeTotal >= 0 ? '#5DCAA5' : '#e53e3e', fontSize: 10, margin: 0 }}>FCFA</p>
            </div>
          </div>
        </div>

        {rapports.length === 0 && (
          <p style={{ color: '#a0bcd8', textAlign: 'center', marginTop: 32 }}>Aucune donnée disponible</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rapports.map(r => (
            <div key={r.index} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '0.5px solid #dce8f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontWeight: 700, color: '#1A3C5E', margin: 0, fontSize: 15 }}>{r.nom}</p>
                <span style={{ background: '#E6F1FB', color: '#1A3C5E', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                  {r.nbFactures} facture(s)
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div style={{ background: '#F0F7FF', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#2E6DA4', fontSize: 10, margin: '0 0 4px' }}>CA</p>
                  <p style={{ color: '#1A3C5E', fontSize: 13, fontWeight: 700, margin: 0 }}>{r.ca.toLocaleString()}</p>
                </div>
                <div style={{ background: '#FFF0F0', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#e53e3e', fontSize: 10, margin: '0 0 4px' }}>DÉPENSES</p>
                  <p style={{ color: '#1A3C5E', fontSize: 13, fontWeight: 700, margin: 0 }}>{r.totalDepenses.toLocaleString()}</p>
                </div>
                <div style={{ background: r.benefice >= 0 ? '#E1F5EE' : '#FFF0F0', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <p style={{ color: r.benefice >= 0 ? '#0F6E56' : '#e53e3e', fontSize: 10, margin: '0 0 4px' }}>BÉNÉFICE</p>
                  <p style={{ color: '#1A3C5E', fontSize: 13, fontWeight: 700, margin: 0 }}>{r.benefice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}