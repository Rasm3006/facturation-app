import { useState } from 'react'
import { useApp } from '../AppContext'

export default function Clients() {
  const { clients, ajouterClient, supprimerClient } = useApp()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')

  function handleAjouter() {
    if (!nom) return
    ajouterClient({ nom, telephone })
    setNom('')
    setTelephone('')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes Clients</h1>

      <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-2">
        <input
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Nom du client"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Téléphone"
          value={telephone}
          onChange={e => setTelephone(e.target.value)}
        />
        <button
          onClick={handleAjouter}
          className="w-full bg-blue-600 text-white rounded-lg p-2 font-bold"
        >
          + Ajouter
        </button>
      </div>

      <div className="space-y-2">
        {clients.length === 0 && (
          <p className="text-gray-400 text-center">Aucun client ajouté</p>
        )}
        {clients.map(c => (
          <div key={c.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3">
            <div>
              <p className="font-bold">{c.nom}</p>
              <p className="text-sm text-gray-500">{c.telephone}</p>
            </div>
            <button
              onClick={() => supprimerClient(c.id)}
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