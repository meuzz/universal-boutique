import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useSEO } from "../lib/useSEO.js";

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const categorieSlug = searchParams.get("categorie") || "";
  const tri = searchParams.get("tri") || "recent";

  useSEO({
    titre: categorieSlug ? `Catalogue — ${categorieSlug.replace(/-/g, " ")}` : "Catalogue",
    description: "Découvrez tous les produits Universal Boutique : électronique, maison, mode, auto, moto, beauté, solaire et plus, livrés au Sénégal.",
  });

  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerCategories() {
      const { data } = await supabase
        .from("categories")
        .select("nom, slug, ordre")
        .order("ordre", { ascending: true });
      if (data) setCategories(data);
    }
    chargerCategories();
  }, []);

  useEffect(() => {
    async function chargerProduits() {
      setChargement(true);
      setErreur(null);

      let requete = supabase
        .from("produits")
        .select("id, nom, slug, prix, prix_promo, photos, stock, est_nouveau, est_promo, categorie_id, categories(slug)")
        .eq("actif", true);

      if (q) {
        requete = requete.ilike("nom", `%${q}%`);
      }

      if (categorieSlug) {
        const cat = categories.find((c) => c.slug === categorieSlug);
        if (cat) requete = requete.eq("categorie_id", cat.id);
      }

      if (tri === "prix_asc") requete = requete.order("prix", { ascending: true });
      else if (tri === "prix_desc") requete = requete.order("prix", { ascending: false });
      else requete = requete.order("created_at", { ascending: false });

      const { data, error } = await requete;

      if (error) setErreur(error.message);
      else setProduits(data || []);
      setChargement(false);
    }
    chargerProduits();
  }, [q, categorieSlug, tri, categories]);

  function mettreAJourFiltre(cle, valeur) {
    const params = new URLSearchParams(searchParams);
    if (valeur) params.set(cle, valeur);
    else params.delete(cle);
    setSearchParams(params);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-medium mb-6">
        Catalogue{q ? ` — résultats pour "${q}"` : ""}
      </h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={categorieSlug}
          onChange={(e) => mettreAJourFiltre("categorie", e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.nom}</option>
          ))}
        </select>

        <select
          value={tri}
          onChange={(e) => mettreAJourFiltre("tri", e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="recent">Nouveautés d'abord</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>

        {(q || categorieSlug) && (
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-gray-500 underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {chargement && (
        <p className="text-center text-gray-400 py-12">Chargement des produits...</p>
      )}

      {erreur && (
        <p className="text-center text-red-500 py-12">
          Impossible de charger les produits : {erreur}
        </p>
      )}

      {!chargement && !erreur && produits.length === 0 && (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-1">Aucun produit ne correspond pour le moment.</p>
          <p className="text-sm text-gray-400">
            Les produits ajoutés depuis l'administration apparaîtront automatiquement ici.
          </p>
        </div>
      )}

      {!chargement && !erreur && produits.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {produits.map((p) => (
            <Link
              key={p.id}
              to={`/produit/${p.slug}`}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="bg-gray-50 h-32 flex items-center justify-center text-3xl relative">
                🛍️
                {p.est_nouveau && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                    Nouveau
                  </span>
                )}
                {p.est_promo && (
                  <span className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-0.5 rounded">
                    Promo
                  </span>
                )}
                {p.stock === 0 && (
                  <span className="absolute bottom-2 left-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded">
                    Rupture de stock
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-700 truncate">{p.nom}</p>
                {p.prix_promo ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-medium text-sm">{p.prix_promo.toLocaleString()} FCFA</span>
                    <span className="text-gray-400 text-xs line-through">{p.prix.toLocaleString()} FCFA</span>
                  </div>
                ) : (
                  <p className="text-primary font-medium text-sm mt-1">{p.prix.toLocaleString()} FCFA</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
