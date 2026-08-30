import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

const STATUTS = ["nouvelle", "en cours", "livrée", "annulée"];

const COULEURS_STATUT = {
  nouvelle: "bg-blue-100 text-blue-700",
  "en cours": "bg-amber-100 text-amber-700",
  livrée: "bg-green-100 text-green-700",
  annulée: "bg-red-100 text-red-700",
};

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [commandeOuverte, setCommandeOuverte] = useState(null);
  const [chargement, setChargement] = useState(true);

  async function chargerCommandes() {
    setChargement(true);
    const { data } = await supabase
      .from("commandes")
      .select("*, clients(nom, telephone, adresse, ville), commande_produits(quantite, prix_unitaire, produits(nom))")
      .order("created_at", { ascending: false });
    setCommandes(data || []);
    setChargement(false);
  }

  useEffect(() => {
    chargerCommandes();
  }, []);

  async function changerStatut(id, statut) {
    await supabase.from("commandes").update({ statut }).eq("id", id);
    chargerCommandes();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-gray-500">← Retour</Link>
        <h1 className="text-2xl font-heading font-medium">Commandes</h1>
      </div>

      {chargement ? (
        <p className="text-center text-gray-400 py-10">Chargement...</p>
      ) : commandes.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Aucune commande reçue pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {commandes.map((cmd) => {
            const ouverte = commandeOuverte === cmd.id;
            return (
              <div key={cmd.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <button
                  onClick={() => setCommandeOuverte(ouverte ? null : cmd.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-medium text-sm">{cmd.clients?.nom || "Client inconnu"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(cmd.created_at).toLocaleDateString("fr-FR")} · {cmd.total.toLocaleString()} FCFA
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${COULEURS_STATUT[cmd.statut] || "bg-gray-100 text-gray-600"}`}>
                    {cmd.statut}
                  </span>
                </button>

                {ouverte && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Téléphone</p>
                      <p>{cmd.clients?.telephone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Adresse</p>
                      <p>{cmd.clients?.adresse}, {cmd.clients?.ville}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Livraison</p>
                      <p>{cmd.mode_livraison}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Produits</p>
                      {cmd.commande_produits.map((ligne, i) => (
                        <p key={i} className="text-gray-700">
                          {ligne.produits?.nom || "Produit supprimé"} x{ligne.quantite} — {(ligne.prix_unitaire * ligne.quantite).toLocaleString()} FCFA
                        </p>
                      ))}
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Changer le statut</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUTS.map((statut) => (
                          <button
                            key={statut}
                            onClick={() => changerStatut(cmd.id, statut)}
                            className={`text-xs px-3 py-1.5 rounded-md border ${
                              cmd.statut === statut
                                ? "border-primary bg-primary text-white"
                                : "border-gray-200 text-gray-600"
                            }`}
                          >
                            {statut}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
