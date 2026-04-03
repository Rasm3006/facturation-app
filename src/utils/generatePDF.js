import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatMontant(n) {
  return Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

export function generatePDF(facture) {
  const doc = new jsPDF()

  doc.setFillColor(26, 60, 94)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ProAppli Facture', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('www.proappli.com', 14, 30)

  doc.setTextColor(26, 60, 94)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURE', 14, 55)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Date : ${facture.date}`, 14, 65)
  doc.text(`N° : FAC-${facture.id?.toString().slice(-6).toUpperCase()}`, 14, 72)

  doc.setTextColor(26, 60, 94)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Client :', 14, 85)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(facture.client, 14, 93)

  if (facture.objet) {
    doc.setFont('helvetica', 'bold')
    doc.text('Objet :', 14, 103)
    doc.setFont('helvetica', 'normal')
    doc.text(facture.objet, 14, 111)
  }

  const lignes = (facture.lignes || []).filter(l => l.description && l.description.trim() !== '')

  const rows = lignes.map(l => [
    l.description,
    l.quantite,
    formatMontant(l.prix),
    formatMontant(l.quantite * l.prix)
  ])

  autoTable(doc, {
    startY: 120,
    head: [['Description', 'Qté', 'Prix unitaire', 'Total']],
    body: rows,
    headStyles: { fillColor: [26, 60, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  })

  const finalY = doc.lastAutoTable.finalY + 10

  doc.setFillColor(26, 60, 94)
  doc.rect(120, finalY, 76, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL :', 124, finalY + 9)
  doc.text(formatMontant(facture.total), 194, finalY + 9, { align: 'right' })

  doc.setTextColor(150, 150, 150)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Merci pour votre confiance.', 105, 285, { align: 'center' })

  doc.save(`Facture-${facture.client}-${facture.date}.pdf`)
}