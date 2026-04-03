import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatMontant(n) {
  return Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

function getNumero(facture) {
  const annee = new Date().getFullYear()
  const prefix = facture.typeDoc === 'Devis' ? 'DEV' : facture.typeDoc === 'Proforma' ? 'PRO' : 'FAC'
  const cle = `compteur_${prefix}_${annee}`
  const compteur = parseInt(localStorage.getItem(cle) || '0') + 1
  localStorage.setItem(cle, compteur)
  return `${prefix}-${annee}-${String(compteur).padStart(3, '0')}`
}

export function generatePDF(facture) {
  const doc = new jsPDF()
  const entreprise = JSON.parse(localStorage.getItem('entreprise') || '{}')

  doc.setFillColor(26, 60, 94)
  doc.rect(0, 0, 210, 45, 'F')

  if (entreprise.logo) {
    try {
      doc.addImage(entreprise.logo, 'PNG', 14, 6, 30, 30)
    } catch (e) {}
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(entreprise.nom || '', 48, 16)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 188, 216)
    if (entreprise.adresse) doc.text(entreprise.adresse, 48, 24)
    if (entreprise.telephone) doc.text(`Tél : ${entreprise.telephone}`, 48, 30)
    if (entreprise.email) doc.text(entreprise.email, 48, 36)
  } else {
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(entreprise.nom || 'ProAppli Facture', 14, 16)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 188, 216)
    if (entreprise.adresse) doc.text(entreprise.adresse, 14, 24)
    if (entreprise.telephone) doc.text(`Tél : ${entreprise.telephone}`, 14, 30)
    if (entreprise.email) doc.text(entreprise.email, 14, 36)
  }

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  if (entreprise.ifu) doc.text(`IFU : ${entreprise.ifu}`, 130, 24)
  if (entreprise.rccm) doc.text(`RCCM : ${entreprise.rccm}`, 130, 30)

  doc.setTextColor(26, 60, 94)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text((facture.typeDoc || 'FACTURE').toUpperCase(), 14, 58)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`N° : ${getNumero(facture)}`, 14, 66)
  doc.text(`Date : ${facture.date}`, 14, 72)
  if (facture.conditions) doc.text(`Conditions : ${facture.conditions}`, 14, 78)

  doc.setFillColor(240, 247, 255)
  doc.rect(120, 55, 76, 28, 'F')
  doc.setTextColor(26, 60, 94)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Destinataire :', 124, 63)
  doc.setFont('helvetica', 'normal')
  doc.text(facture.client, 124, 71)

  const startY = facture.conditions ? 88 : 82

  const lignes = (facture.lignes || []).filter(l => l.description && l.description.trim() !== '')
  const rows = lignes.map(l => [
    l.description,
    l.quantite,
    formatMontant(l.prix),
    formatMontant(l.quantite * l.prix)
  ])

  autoTable(doc, {
    startY,
    head: [['Description', 'Qté', 'Prix unitaire', 'Montant HT']],
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

  let finalY = doc.lastAutoTable.finalY + 8

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Sous-total HT :', 130, finalY)
  doc.text(formatMontant(facture.sousTotal || facture.total), 196, finalY, { align: 'right' })
  finalY += 7

  if (facture.tva) {
    doc.text('TVA (18%) :', 130, finalY)
    doc.text(formatMontant(facture.montantTVA || 0), 196, finalY, { align: 'right' })
    finalY += 7
  }

  doc.setFillColor(26, 60, 94)
  doc.rect(120, finalY, 76, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL TTC :', 124, finalY + 9)
  doc.text(formatMontant(facture.total), 194, finalY + 9, { align: 'right' })

  finalY += 24

 doc.setDrawColor(26, 60, 94)
doc.setLineWidth(0.3)
doc.line(14, finalY, 90, finalY)
doc.setTextColor(100, 100, 100)
doc.setFontSize(9)
doc.setFont('helvetica', 'normal')
doc.text('Signature & Cachet', 14, finalY + 6)

if (facture.signature) {
  try {
    doc.addImage(facture.signature, 'PNG', 14, finalY - 25, 60, 22)
  } catch (e) {}
}
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text('Merci pour votre confiance.', 105, 285, { align: 'center' })
  if (entreprise.nom) {
    doc.text(`${entreprise.nom} — ${entreprise.adresse || ''} — Tél : ${entreprise.telephone || ''}`, 105, 290, { align: 'center' })
  }

  doc.save(`${facture.typeDoc || 'Facture'}-${facture.client}-${facture.date}.pdf`)
}