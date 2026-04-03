import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './AppContext'
import Accueil from './pages/Accueil'
import Factures from './pages/Factures'
import Clients from './pages/Clients'
import Nouveau from './pages/Nouveau'
import Catalogue from './pages/Catalogue'
import NavBar from './components/NavBar'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="pb-16">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/nouveau" element={<Nouveau />} />
            <Route path="/catalogue" element={<Catalogue />} />
          </Routes>
        </div>
        <NavBar />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App