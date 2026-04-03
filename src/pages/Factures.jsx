import { useApp } from '../AppContext'

export default function Factures() {
  const { factures } = useApp()

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes Factures</h1>

      {factures.length === 0 && (
        <p className="text-gray-400 text-center">Aucune facture enregistrée</p>
      )}

      <div className="space-y-3">
        {factures.map(f => (
          <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{f.client}</p>
                <p className="text-sm text-gray-500">{f.objet}</p>
                <p className="text-xs text-gray-400 mt-1">{f.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{f.total.toLocaleString()} FCFA</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Payée</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}