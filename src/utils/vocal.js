export function demarrerEcoute(onResultat) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas supportée. Utilisez Chrome.")
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'fr-FR'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const texte = event.results[0][0].transcript
    onResultat(texte)
  }

  recognition.onerror = (event) => {
    console.error('Erreur:', event.error)
  }

  recognition.start()
  return recognition
}

export function analyserTexteVocal(texte) {
  const result = { client: '', objet: '', lignes: [] }
  const t = texte.toLowerCase()

  const partiesVirgule = t.split(',').map(p => p.trim())

  if (partiesVirgule[0]) {
    result.client = partiesVirgule[0]
      .replace(/^(client|pour|destinataire)\s+/i, '')
      .trim()
  }

  if (partiesVirgule[1]) {
    result.objet = partiesVirgule[1]
      .replace(/^(objet|pour)\s+/i, '')
      .trim()
  }

  for (let i = 2; i < partiesVirgule.length; i++) {
    const partie = partiesVirgule[i]
    const match = partie.match(/(\d+)\s+(.+?)\s+(?:à|a)\s+(\d+)/i)
    if (match) {
      result.lignes.push({
        id: Date.now() + i,
        description: match[2].trim(),
        quantite: parseInt(match[1]),
        prix: parseInt(match[3])
      })
    }
  }

  return result
}