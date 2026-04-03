import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Catalogue() {
  const { produits, ajouterProduit, supprimerProduit } = useApp()
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [unite, setUnite] = useState('')

  function handleAjouter() {
    if (!nom || !prix) return
    ajouterProduit({ nom, prix: Number(prix), unite })
    setNom('')
    setPrix('')
    setUnite('')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catalogue</h1>

      <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-2">
        <input
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Nom du produit/service"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            className="w-1/2 border border-gray-300 rounded-lg p-2"
            placeholder="Prix unitaire"
            type="number"
            value={prix}
            onChange={e => setPrix(e.target.value)}
          />
          <input
            className="w-1/2 border border-gray-300 rounded-lg p-2"
            placeholder="Unité (kg, m, h...)"
            value={unite}
            onChange={e => setUnite(e.target.value)}
          />
        </div>
        <button
          onClick={handleAjouter}
          className="w-full bg-blue-600 text-white rounded-lg p-2 font-bold"
        >
          + Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {produits?.length === 0 && (
          <p className="text-gray-400 text-center">Aucun produit ajouté</p>
        )}
        {produits?.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3">
            <div>
              <p className="font-bold">{p.nom}</p>
              <p className="text-sm text-gray-500">{p.prix.toLocaleString()} FCFA {p.unite && `/ ${p.unite}`}</p>
            </div>
            <button
              onClick={() => supprimerProduit(p.id)}
              className="text-red-500 font-bold text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}