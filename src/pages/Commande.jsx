import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const NUMERO_WHATSAPP = "221772323309";

// Genere un identifiant unique cote navigateur.
// Ainsi, on n'a pas besoin de relire la table clients (qui reste protegee).
function nouvelId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Commande() {
  const [panier, setPanier] = useState([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [modeLivraison, setModeLivraison] = useState("Livraison \u00e0 domicile");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("panier") || "[]");
    setPanier(data);
  }, []);

  const total = panier.reduce((somme, item) => somme + item.prix * item.quantite, 0);

  async function validerCommande(e) {
    e.preventDefault();
    setErreur(null);

    if (!nom.trim() || !telephone.trim() || !adresse.trim() || !ville.trim()) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }

    setEnvoiEnCours(true);

    try {
      // 1. R\u00e9cup\u00e9rer le S\u00e9n\u00e9gal comme pays par d\u00e9faut
      const { data: pays } = await supabase
        .from("pays")
        .select("id")
        .eq("code", "SN")
        .single();

      // 2. Cr\u00e9er le client (sans relire la table : les donn\u00e9es clients restent priv\u00e9es)
      const clientId = nouvelId();
      const { error: erreurClient } = await supabase
        .from("clients")
        .insert({ id: clientId, nom, telephone, adresse, ville, pays_id: pays?.id });

      if (erreurClient) throw erreurClient;

      // 3. Cr\u00e9er la commande
      const commandeId = nouvelId();
      const { error: erreurCommande } = await supabase
        .from("commandes")
        .insert({
          id: commandeId,
          client_id: clientId,
          statut: "nouvelle",
          mode_livraison: modeLivraison,
          total,
          pays_id: pays?.id,
        });

      if (erreurCommande) throw erreurCommande;

      // 4. Ajouter le d\u00e9tail des produits command\u00e9s
      const lignesCommande = panier.map((item) => ({
        commande_id: commandeId,
        produit_id: item.id,
        quantite: item.quantite,
        prix_unitaire: item.prix,
      }));

      const { error: erreurLignes } = await supabase
        .from("commande_produits")
        .insert(lignesCommande);

      if (erreurLignes) throw erreurLignes;

      // 5. Vider le panier
      localStorage.removeItem("panier");

      // 6. Construire le message WhatsApp
      const detailProduits = panier
        .map((item) => `- ${item.nom} x${item.quantite} (${(item.prix * item.quantite).toLocaleString()} FCFA)`)
        .join("\n");

      const texte =
        `Nouvelle commande Universal Boutique\n\n` +
        `Client : ${nom}\n` +
        `T\u00e9l\u00e9phone : ${telephone}\n` +
        `Adresse : ${adresse}, ${ville}\n` +
        `Livraison : ${modeLivraison}\n\n` +
        `Produits :\n${detailProduits}\n\n` +
        `Total : ${total.toLocaleString()} FCFA`;

      const lienWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texte)}`;
      const fenetre = window.open(lienWhatsApp, "_blank");

      // Si le t\u00e9l\u00e9phone bloque l'ouverture d'un nouvel onglet, on ouvre WhatsApp directement
      if (!fenetre) {
        window.location.href = lienWhatsApp;
        return;
      }

      // 7. Rediriger vers la confirmation
      navigate("/confirmation");
    } catch (err) {
      setErreur("Une erreur est survenue : " + err.message);
    } finally {
      setEnvoiEnCours(false);
    }
  }

  if (panier.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-medium mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Ajoutez des produits avant de passer commande.</p>
        <Link to="/catalogue" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-medium mb-6">Finaliser la commande</h1>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="font-medium text-sm mb-2">R\u00e9capitulatif</p>
        {panier.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{item.nom} x{item.quantite}</span>
            <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
          </div>
        ))}
        <div className="flex justify-between font-medium text-primary pt-2 border-t border-gray-200 mt-2">
          <span>Total</span>
          <span>{total.toLocaleString()} FCFA</span>
        </div>
      </div>

      <form onSubmit={validerCommande} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">T\u00e9l\u00e9phone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="77 000 00 00"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ville</label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mode de livraison</label>
          <select
            value={modeLivraison}
            onChange={(e) => setModeLivraison(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          >
            <option>Livraison \u00e0 domicile</option>
            <option>Retrait en boutique</option>
          </select>
        </div>

        {erreur && <p className="text-red-500 text-sm">{erreur}</p>}

        <button
          type="submit"
          disabled={envoiEnCours}
          className="w-full bg-accent text-white py-3 rounded-md font-medium disabled:opacity-50"
        >
          {envoiEnCours ? "Envoi en cours..." : "Confirmer la commande"}
        </button>
      </form>
    </div>
  );
}
