import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const location = useLocation()

  const liens = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/factures', label: 'Factures', icon: '🧾' },
    { path: '/nouveau', label: 'Nouveau', icon: '➕' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/catalogue', label: 'Catalogue', icon: '📦' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 z-50"
      style={{ background: '#1A3C5E', borderTop: '1px solid #2E6DA4' }}>
      {liens.map((lien) => (
        <Link
          key={lien.path}
          to={lien.path}
          className="flex flex-col items-center text-xs gap-1 px-2 py-2 rounded-lg"
          style={{
            color: location.pathname === lien.path ? '#4A90D9' : '#a0bcd8',
            fontWeight: location.pathname === lien.path ? '700' : '400'
          }}
        >
          <span style={{ fontSize: 18 }}>{lien.icon}</span>
          <span>{lien.label}</span>
        </Link>
      ))}
    </div>
  )
}