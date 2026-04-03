import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [factures, setFactures] = useState([])
  const [clients, setClients] = useState([])
  const [produits, setProduits] = useState([])

  useEffect(() => {
    chargerClients()
    chargerFactures()
    chargerProduits()
  }, [])

  async function chargerClients() {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (data) setClients(data)
  }

  async function chargerFactures() {
    const { data } = await supabase.from('factures').select('*').order('created_at', { ascending: false })
    if (data) setFactures(data)
  }

  async function chargerProduits() {
    const { data } = await supabase.from('produits').select('*').order('created_at', { ascending: false })
    if (data) setProduits(data)
  }

  async function ajouterFacture(facture) {
    const { data, error } = await supabase.from('factures').insert([{
      client: facture.client,
      objet: facture.objet,
      total: facture.total,
      lignes: facture.lignes,
      date: new Date().toLocaleDateString()
    }]).select()
    if (error) console.error('Erreur:', error)
    if (data) setFactures([data[0], ...factures])
  }

  async function ajouterClient(client) {
    const { data, error } = await supabase.from('clients').insert([{
      nom: client.nom,
      telephone: client.telephone
    }]).select()
    if (error) console.error('Erreur:', error)
    if (data) setClients([data[0], ...clients])
  }

  async function supprimerClient(id) {
    await supabase.from('clients').delete().eq('id', id)
    setClients(clients.filter(c => c.id !== id))
  }

  async function ajouterProduit(produit) {
    const { data, error } = await supabase.from('produits').insert([{
      nom: produit.nom,
      prix: produit.prix,
      unite: produit.unite
    }]).select()
    if (error) console.error('Erreur:', error)
    if (data) setProduits([data[0], ...produits])
  }

  async function supprimerProduit(id) {
    await supabase.from('produits').delete().eq('id', id)
    setProduits(produits.filter(p => p.id !== id))
  }

  return (
    <AppContext.Provider value={{ 
      factures, clients, produits,
      ajouterFacture, ajouterClient, supprimerClient,
      ajouterProduit, supprimerProduit
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}