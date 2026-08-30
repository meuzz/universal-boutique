import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Panier() {
  const [panier, setPanier] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("panier") || "[]");
    setPanier(data);
  }, []);

  function enregistrer(nouveauPanier) {
    setPanier(nouveauPanier);
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
  }

  function modifierQuantite(id, quantite) {
    if (quantite < 1) return;
    const nouveauPanier = panier.map((item) =>
      item.id === id ? { ...item, quantite } : item
    );
    enregistrer(nouveauPanier);
  }

  function supprimerProduit(id) {
    enregistrer(panier.filter((item) => item.id !== id));
  }

  const total = panier.reduce((somme, item) => somme + item.prix * item.quantite, 0);

  if (panier.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-medium mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Parcourez le catalogue pour ajouter des produits.</p>
        <Link to="/catalogue" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-medium mb-6">Votre panier</h1>

      <div className="space-y-3 mb-6">
        {panier.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-sm">{item.nom}</p>
              <p className="text-primary text-sm">{item.prix.toLocaleString()} FCFA</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-md">
                <button
                  onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                  className="px-2 py-1 text-gray-600"
                >
                  −
                </button>
                <span className="px-3 text-sm">{item.quantite}</span>
                <button
                  onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                  className="px-2 py-1 text-gray-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => supprimerProduit(item.id)}
                className="text-red-500 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 mb-6">
        <span className="font-medium">Total</span>
        <span className="text-xl font-semibold text-primary">{total.toLocaleString()} FCFA</span>
      </div>

      <button
        onClick={() => navigate("/commande")}
        className="w-full bg-accent text-white py-3 rounded-md font-medium"
      >
        Passer la commande
      </button>
    </div>
  );
}
