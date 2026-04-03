import { useApp } from '../AppContext'
import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const { factures, clients } = useApp()
  const navigate = useNavigate()

  const totalFactures = factures.reduce((sum, f) => sum + f.total, 0)

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Factures</p>
          <p className="text-3xl font-bold text-blue-600">{factures.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Clients</p>
          <p className="text-3xl font-bold text-green-600">{clients.length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl col-span-2 p-4">
          <p className="text-sm text-gray-500">Total facturé</p>
          <p className="text-3xl font-bold text-purple-600">{totalFactures.toLocaleString()} FCFA</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/nouveau')}
        className="w-full bg-blue-600 text-white rounded-xl p-4 font-bold text-lg"
      >
        + Nouvelle Facture
      </button>
    </div>
  )
}