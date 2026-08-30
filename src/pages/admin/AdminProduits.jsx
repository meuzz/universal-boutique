import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

const PRODUIT_VIDE = {
  id: null,
  nom: "",
  slug: "",
  description: "",
  caracteristiques: "",
  prix: "",
  prix_promo: "",
  stock: "",
  categorie_id: "",
  photos: "",
  est_nouveau: false,
  est_populaire: false,
  est_promo: false,
  actif: true,
};

function creerSlug(nom) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formulaire, setFormulaire] = useState(PRODUIT_VIDE);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [enregistrement, setEnregistrement] = useState(false);

  async function chargerDonnees() {
    setChargement(true);
    const [{ data: produitsData }, { data: categoriesData }] = await Promise.all([
      supabase.from("produits").select("*, categories(nom)").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, nom, ordre").order("ordre", { ascending: true }),
    ]);
    setProduits(produitsData || []);
    setCategories(categoriesData || []);
    setChargement(false);
  }

  useEffect(() => {
    chargerDonnees();
  }, []);

  function ouvrirAjout() {
    setFormulaire(PRODUIT_VIDE);
    setFormulaireOuvert(true);
  }

  function ouvrirModification(produit) {
    setFormulaire({
      ...produit,
      photos: (produit.photos || []).join(", "),
      prix_promo: produit.prix_promo || "",
      categorie_id: produit.categorie_id || "",
    });
    setFormulaireOuvert(true);
  }

  async function enregistrerProduit(e) {
    e.preventDefault();
    setErreur(null);

    if (!formulaire.nom.trim() || !formulaire.prix) {
      setErreur("Le nom et le prix sont obligatoires.");
      return;
    }

    setEnregistrement(true);

    const donnees = {
      nom: formulaire.nom,
      slug: formulaire.slug || creerSlug(formulaire.nom),
      description: formulaire.description || null,
      caracteristiques: formulaire.caracteristiques || null,
      prix: Number(formulaire.prix),
      prix_promo: formulaire.prix_promo ? Number(formulaire.prix_promo) : null,
      stock: formulaire.stock ? Number(formulaire.stock) : 0,
      categorie_id: formulaire.categorie_id || null,
      photos: formulaire.photos
        ? formulaire.photos.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
      est_nouveau: formulaire.est_nouveau,
      est_populaire: formulaire.est_populaire,
      est_promo: formulaire.est_promo,
      actif: formulaire.actif,
    };

    let resultat;
    if (formulaire.id) {
      resultat = await supabase.from("produits").update(donnees).eq("id", formulaire.id);
    } else {
      resultat = await supabase.from("produits").insert(donnees);
    }

    setEnregistrement(false);

    if (resultat.error) {
      setErreur("Erreur : " + resultat.error.message);
    } else {
      setFormulaireOuvert(false);
      chargerDonnees();
    }
  }

  async function supprimerProduit(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    await supabase.from("produits").delete().eq("id", id);
    chargerDonnees();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-gray-500">← Retour</Link>
          <h1 className="text-2xl font-heading font-medium">Produits</h1>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Ajouter un produit
        </button>
      </div>

      {formulaireOuvert && (
        <form onSubmit={enregistrerProduit} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du produit</label>
              <input
                type="text"
                value={formulaire.nom}
                onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={formulaire.categorie_id}
                onChange={(e) => setFormulaire({ ...formulaire, categorie_id: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Aucune catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formulaire.description}
              onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Caractéristiques</label>
            <textarea
              value={formulaire.caracteristiques}
              onChange={(e) => setFormulaire({ ...formulaire, caracteristiques: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              rows={2}
              placeholder="Une caractéristique par ligne"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
              <input
                type="number"
                value={formulaire.prix}
                onChange={(e) => setFormulaire({ ...formulaire, prix: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix promo (optionnel)</label>
              <input
                type="number"
                value={formulaire.prix_promo}
                onChange={(e) => setFormulaire({ ...formulaire, prix_promo: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formulaire.stock}
                onChange={(e) => setFormulaire({ ...formulaire, stock: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photos (liens séparés par une virgule)</label>
            <input
              type="text"
              value={formulaire.photos}
              onChange={(e) => setFormulaire({ ...formulaire, photos: e.target.value })}
              placeholder="https://... , https://..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formulaire.est_nouveau}
                onChange={(e) => setFormulaire({ ...formulaire, est_nouveau: e.target.checked })}
              />
              Nouveau
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formulaire.est_populaire}
                onChange={(e) => setFormulaire({ ...formulaire, est_populaire: e.target.checked })}
              />
              Populaire
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formulaire.est_promo}
                onChange={(e) => setFormulaire({ ...formulaire, est_promo: e.target.checked })}
              />
              Promotion
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formulaire.actif}
                onChange={(e) => setFormulaire({ ...formulaire, actif: e.target.checked })}
              />
              Visible sur le site
            </label>
          </div>

          {erreur && <p className="text-red-500 text-sm">{erreur}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={enregistrement}
              className="bg-primary text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {enregistrement ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setFormulaireOuvert(false)}
              className="text-sm text-gray-500"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {chargement ? (
        <p className="text-center text-gray-400 py-10">Chargement...</p>
      ) : produits.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Aucun produit pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {produits.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4"
            >
              <div>
                <p className="font-medium text-sm">{p.nom}</p>
                <p className="text-xs text-gray-500">
                  {p.categories?.nom || "Sans catégorie"} · {p.prix.toLocaleString()} FCFA · Stock : {p.stock}
                  {!p.actif && <span className="text-red-500"> · Masqué</span>}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => ouvrirModification(p)} className="text-sm text-primary">
                  Modifier
                </button>
                <button onClick={() => supprimerProduit(p.id)} className="text-sm text-red-500">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
