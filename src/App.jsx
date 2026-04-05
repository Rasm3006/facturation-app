import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './AppContext'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Accueil from './pages/Accueil'
import Factures from './pages/Factures'
import Clients from './pages/Clients'
import Nouveau from './pages/Nouveau'
import Catalogue from './pages/Catalogue'
import Parametres from './pages/Parametres'
import Depenses from './pages/Depenses'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import Rapport from './pages/Rapport'
import ModifierFacture from './pages/ModifierFacture'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div style={{ background: '#1A3C5E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#fff' }}>Chargement...</p>
    </div>
  )

  if (!session) return <Login />

  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ paddingBottom: 64 }}>
          <Routes>
  <Route path="/" element={<Accueil />} />
  <Route path="/factures" element={<Factures />} />
  <Route path="/clients" element={<Clients />} />
  <Route path="/nouveau" element={<Nouveau />} />
  <Route path="/catalogue" element={<Catalogue />} />
  <Route path="/depenses" element={<Depenses />} />
  <Route path="/parametres" element={<Parametres />} />
  <Route path="/rapport" element={<Rapport />} />
  <Route path="/modifier/:id" element={<ModifierFacture />} />
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
        </div>
        <NavBar />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App