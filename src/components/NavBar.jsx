import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const liens = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/factures', label: 'Factures', icon: '🧾' },
    { path: '/nouveau', label: 'Nouveau', icon: '➕' },
    { path: '/clients', label: 'Clients', icon: '👥' },
  ]

const plusLiens = [
  { path: '/rapport', label: 'Rapport', icon: '📊' },
  { path: '/depenses', label: 'Dépenses', icon: '💸' },
  { path: '/catalogue', label: 'Catalogue', icon: '📦' },
  { path: '/boissons', label: 'Boissons', icon: '🍺' },
  { path: '/ventes-boissons', label: 'Ventes', icon: '🛒' },
  { path: '/tableau-boissons', label: 'Tableau', icon: '📈' },
  { path: '/parametres', label: 'Paramètres', icon: '⚙️' },
]
  return (
    <>
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
        />
      )}

      {showMenu && (
        <div style={{
          position: 'fixed', bottom: 70, right: 16, background: '#fff',
          borderRadius: 16, padding: '8px', zIndex: 50,
          border: '0.5px solid #dce8f5', minWidth: 180,
          boxShadow: '0 4px 20px rgba(26,60,94,0.15)'
        }}>
          {plusLiens.map(l => (
            <button
              key={l.path}
              onClick={() => { navigate(l.path); setShowMenu(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 16px', background: location.pathname === l.path ? '#F0F7FF' : 'none',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                color: location.pathname === l.path ? '#1A3C5E' : '#444',
                fontWeight: location.pathname === l.path ? 700 : 400,
                fontSize: 14
              }}
            >
              <span style={{ fontSize: 18 }}>{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#1A3C5E', borderTop: '1px solid #2E6DA4',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: 64, zIndex: 50
      }}>
        {liens.map((lien) => (
          <Link
            key={lien.path}
            to={lien.path}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '8px 12px', borderRadius: 10, textDecoration: 'none',
              color: location.pathname === lien.path ? '#fff' : '#a0bcd8',
              background: location.pathname === lien.path ? 'rgba(74,144,217,0.2)' : 'none'
            }}
          >
            <span style={{ fontSize: 20 }}>{lien.icon}</span>
            <span style={{ fontSize: 11, fontWeight: location.pathname === lien.path ? 700 : 400 }}>{lien.label}</span>
          </Link>
        ))}

        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '8px 12px', borderRadius: 10, border: 'none',
            background: showMenu ? 'rgba(74,144,217,0.2)' : 'none',
            color: showMenu ? '#fff' : '#a0bcd8', cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: 20 }}>☰</span>
          <span style={{ fontSize: 11 }}>Plus</span>
        </button>
      </div>
    </>
  )
}