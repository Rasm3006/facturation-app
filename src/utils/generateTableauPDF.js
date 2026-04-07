import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatMontant(n) {
  return Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

export function generateTableauPDF(date, parBoisson, parServeuse, totaux, boissons) {
  const doc = new jsPDF()
  const entreprise = JSON.parse(localStorage.getItem('entreprise') || '{}')

  doc.setFillColor(26, 60, 94)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(entreprise.nom || 'ProAppli Commerce', 14, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 188, 216)
  if (entreprise.telephone) doc.text(`Tél : ${entreprise.telephone}`, 14, 24)

  doc.setTextColor(26, 60, 94)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`RAPPORT BUVETTE — ${date}`, 14, 52)

  doc.setFillColor(240, 247, 255)
  doc.rect(14, 58, 182, 18, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(26, 60, 94)
  doc.text(`Ventes : ${formatMontant(totaux.totalJour)}`, 18, 66)
  doc.text(`Avoirs : ${formatMontant(totaux.totalAvoirs)}`, 80, 66)
  doc.text(`Net : ${formatMontant(totaux.netEncaisser)}`, 150, 66)

  if (parBoisson.length > 0) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 60, 94)
    doc.text('Ventes par boisson', 14, 84)

    autoTable(doc, {
      startY: 88,
      head: [['Boisson', 'Vendu', 'Montant', 'Avoir', 'Stock']],
      body: parBoisson.map(b => [
        b.nom,
        b.qteVendue,
        formatMontant(b.montant),
        formatMontant(b.avoir || 0),
        b.stock_actuel
      ]),
      headStyles: { fillColor: [26, 60, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 247, 255] },
      styles: { fontSize: 9 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'center' }
      }
    })
  }

  const y2 = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 90

  if (parServeuse.length > 0) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 60, 94)
    doc.text('Ventes par serveuse', 14, y2)

    autoTable(doc, {
      startY: y2 + 4,
      head: [['Serveuse', 'Bouteilles', 'Montant', 'Avoir', 'Net']],
      body: parServeuse.map(s => [
        s.serveuse,
        s.quantite,
        formatMontant(s.montant),
        formatMontant(s.avoir || 0),
        formatMontant(s.montant - (s.avoir || 0))
      ]),
      headStyles: { fillColor: [26, 60, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 247, 255] },
      styles: { fontSize: 9 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    })
  }

  const y3 = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y2 + 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 60, 94)
  doc.text('Stock actuel', 14, y3)

  autoTable(doc, {
    startY: y3 + 4,
    head: [['Boisson', 'Stock actuel', 'Seuil alerte']],
    body: boissons.map(b => [
      b.nom,
      b.stock_actuel,
      b.seuil_alerte
    ]),
    headStyles: { fillColor: [26, 60, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' }
    }
  })

  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text('Document généré par ProAppli Commerce', 105, 285, { align: 'center' })

  doc.save(`Tableau-Buvette-${date}.pdf`)
}