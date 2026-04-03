import { useState } from 'react'
import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'

export default function Nouveau() {
  const { ajouterFacture, clients, produits } = useApp()
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [objet, setObjet] = useState('')
  const [lignes, setLignes] = useState([
    { id: Date.now(), description: '', quantite: 1, prix: 0 }
  ])

  function ajouterLigne() {
    setLignes([...lignes, { id: Date.now(), description: '', quantite: 1, prix: 0 }])
  }

  function modifierLigne(id, champ, valeur) {
    setLignes(lignes.map(l => l.id === id ? { ...l, [champ]: valeur } : l))
  }

  function choisirProduit(id, produitId) {
    const produit = produits.find(p => p.id === produitId)
    if (produit) {
      setLignes(lignes.map(l => l.id === id ? { ...l, description: produit.nom, prix: produit.prix } : l))
    }
  }

  function supprimerLigne(id) {
    setLignes(lignes.filter(l => l.id !== id))
  }

  const total = lignes.reduce((sum, l) => sum + (l.quantite * l.prix), 0)

  function enregistrer() {
    if (!client) return
    ajouterFacture({ client, objet, lignes, total })
    navigate('/factures')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nouvelle Facture</h1>

      <div className="space-y-3 mb-4">
        <select
          className="w-full border border-gray-300 rounded-lg p-2"
          value={client}
          onChange={e => setClient(e.target.value)}
        >
          <option value="">Sélectionner un client</option>
          {clients.map(c => (
            <option key={c.id} value={c.nom}>{c.nom}</option>
          ))}
        </select>
        <input
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Objet de la facture"
          value={objet}
          onChange={e => setObjet(e.target.value)}
        />
      </div>

      <h2 className="font-bold mb-2">Lignes de la facture</h2>
      <div className="space-y-2 mb-3">
        {lignes.map(l => (
          <div key={l.id} className="bg-gray-50 p-3 rounded-xl space-y-2">
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              onChange={e => choisirProduit(l.id, e.target.value)}
            >
              <option value="">Choisir du catalogue</option>
              {produits.map(p => (
                <option key={p.id} value={p.id}>{p.nom} — {p.prix.toLocaleString()} FCFA</option>
              ))}
            </select>
            <input
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Description"
              value={l.description}
              onChange={e => modifierLigne(l.id, 'description', e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="w-1/2 border border-gray-300 rounded-lg p-2"
                placeholder="Quantité"
                type="number"
                value={l.quantite}
                onChange={e => modifierLigne(l.id, 'quantite', Number(e.target.value))}
              />
              <input
                className="w-1/2 border border-gray-300 rounded-lg p-2"
                placeholder="Prix unitaire"
                type="number"
                value={l.prix}
                onChange={e => modifierLigne(l.id, 'prix', Number(e.target.value))}
              />
            </div>
            <button
              onClick={() => supprimerLigne(l.id)}
              className="text-red-500 text-sm"
            >
              Supprimer cette ligne
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={ajouterLigne}
        className="w-full border-2 border-dashed border-blue-400 text-blue-600 rounded-xl p-2 mb-4"
      >
        + Ajouter une ligne
      </button>

      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-right font-bold text-xl">Total : {total.toLocaleString()} FCFA</p>
      </div>

      <button
        onClick={enregistrer}
        className="w-full bg-blue-600 text-white rounded-xl p-3 font-bold text-lg"
      >
        Enregistrer la facture
      </button>
    </div>
  )
}