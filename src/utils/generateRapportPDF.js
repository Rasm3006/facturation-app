import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatMontant(n) {
  return Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

export function generateRapportPDF(rapports, annee, totaux) {
  const doc = new jsPDF()
  const entreprise = JSON.parse(localStorage.getItem('entreprise') || '{}')

  doc.setFillColor(26, 60, 94)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(entreprise.nom || 'ProAppli Facture', 14, 16)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 188, 216)
  if (entreprise.adresse) doc.text(entreprise.adresse, 14, 24)
  if (entreprise.telephone) doc.text(`Tél : ${entreprise.telephone}`, 14, 30)

  doc.setTextColor(26, 60, 94)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`RAPPORT ANNUEL ${annee}`, 14, 55)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Généré le : ${new Date().toLocaleDateString()}`, 14, 63)

  doc.setFillColor(240, 247, 255)
  doc.rect(14, 70, 182, 20, 'F')
  doc.setTextColor(26, 60, 94)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('BILAN ANNUEL', 16, 79)
  doc.setFont('helvetica', 'normal')
  doc.text(`CA : ${formatMontant(totaux.ca)}`, 60, 79)
  doc.text(`Dépenses : ${formatMontant(totaux.depenses)}`, 110, 79)
  doc.text(`Bénéfice : ${formatMontant(totaux.benefice)}`, 155, 79)

  const rows = rapports.map(r => [
    r.nom,
    r.nbFactures,
    formatMontant(r.ca),
    formatMontant(r.totalDepenses),
    formatMontant(r.benefice)
  ])

  autoTable(doc, {
    startY: 98,
    head: [['Mois', 'Factures', 'CA', 'Dépenses', 'Bénéfice']],
    body: rows,
    headStyles: { fillColor: [26, 60, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
    foot: [[
      'TOTAL', '',
      formatMontant(totaux.ca),
      formatMontant(totaux.depenses),
      formatMontant(totaux.benefice)
    ]],
    footStyles: { fillColor: [26, 60, 94], textColor: 255, fontStyle: 'bold' }
  })

  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text('Document généré par ProAppli Facture', 105, 285, { align: 'center' })

  doc.save(`Rapport-${annee}.pdf`)
}