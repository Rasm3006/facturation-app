import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [factures, setFactures] = useState([])
  const [clients, setClients] = useState([])
  const [produits, setProduits] = useState([])
  const [depenses, setDepenses] = useState([])

  useEffect(() => {
    chargerClients()
    chargerFactures()
    chargerProduits()
    chargerDepenses()
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

  async function chargerDepenses() {
    const { data } = await supabase.from('depenses').select('*').order('created_at', { ascending: false })
    if (data) setDepenses(data)
  }

  async function ajouterFacture(facture) {
    const { data, error } = await supabase.from('factures').insert([{
      client: facture.client,
      objet: facture.objet,
      total: facture.total,
      lignes: facture.lignes,
      tva: facture.tva,
      soustotal: facture.sousTotal,
      montanttva: facture.montantTVA,
      conditions: facture.conditions,
      typedoc: facture.typeDoc,
      signature: facture.signature,
      remise: facture.remise || 0,
montantremise: facture.montantRemise || 0,
      statut: 'En attente',
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
    prix_achat: produit.prixAchat || 0,
    unite: produit.unite
  }]).select()
  if (error) console.error('Erreur:', error)
  if (data) setProduits([data[0], ...produits])
}

  async function supprimerProduit(id) {
    await supabase.from('produits').delete().eq('id', id)
    setProduits(produits.filter(p => p.id !== id))
  }

  async function ajouterDepense(depense) {
    const { data, error } = await supabase.from('depenses').insert([{
      libelle: depense.libelle,
      montant: depense.montant,
      categorie: depense.categorie,
      date: depense.date
    }]).select()
    if (error) console.error('Erreur:', error)
    if (data) setDepenses([data[0], ...depenses])
  }

  async function supprimerDepense(id) {
    await supabase.from('depenses').delete().eq('id', id)
    setDepenses(depenses.filter(d => d.id !== id))
  }

  return (
    <AppContext.Provider value={{
      factures, setFactures, clients, produits, depenses,setDepenses,
      ajouterFacture, ajouterClient, supprimerClient,
      ajouterProduit, supprimerProduit,
      ajouterDepense, supprimerDepense
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}