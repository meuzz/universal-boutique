import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

const CATEGORIE_VIDE = { id: null, nom: "", slug: "", image: "", ordre: "" };

function creerSlug(nom) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [formulaire, setFormulaire] = useState(CATEGORIE_VIDE);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [enregistrement, setEnregistrement] = useState(false);

  async function chargerCategories() {
    setChargement(true);
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("ordre", { ascending: true });
    setCategories(data || []);
    setChargement(false);
  }

  useEffect(() => {
    chargerCategories();
  }, []);

  function ouvrirAjout() {
    const ordreSuivant = categories.length > 0 ? Math.max(...categories.map((c) => c.ordre || 0)) + 1 : 1;
    setFormulaire({ ...CATEGORIE_VIDE, ordre: ordreSuivant });
    setFormulaireOuvert(true);
  }

  function ouvrirModification(cat) {
    setFormulaire(cat);
    setFormulaireOuvert(true);
  }

  async function enregistrerCategorie(e) {
    e.preventDefault();
    setErreur(null);

    if (!formulaire.nom.trim()) {
      setErreur("Le nom est obligatoire.");
      return;
    }

    setEnregistrement(true);

    const donnees = {
      nom: formulaire.nom,
      slug: formulaire.slug || creerSlug(formulaire.nom),
      image: formulaire.image || null,
      ordre: formulaire.ordre ? Number(formulaire.ordre) : 0,
    };

    let resultat;
    if (formulaire.id) {
      resultat = await supabase.from("categories").update(donnees).eq("id", formulaire.id);
    } else {
      resultat = await supabase.from("categories").insert(donnees);
    }

    setEnregistrement(false);

    if (resultat.error) {
      setErreur(
        resultat.error.code === "23505"
          ? "Ce nom de catégorie (ou son identifiant d'URL) existe déjà."
          : "Erreur : " + resultat.error.message
      );
    } else {
      setFormulaireOuvert(false);
      chargerCategories();
    }
  }

  async function supprimerCategorie(id) {
    if (!confirm("Supprimer cette catégorie ? Les produits liés resteront mais sans catégorie.")) return;
    await supabase.from("produits").update({ categorie_id: null }).eq("categorie_id", id);
    await supabase.from("categories").delete().eq("id", id);
    chargerCategories();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-sm text-gray-500">← Retour</Link>
          <h1 className="text-2xl font-heading font-medium">Catégories</h1>
        </div>
        <button
          onClick={ouvrirAjout}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Ajouter une catégorie
        </button>
      </div>

      {formulaireOuvert && (
        <form onSubmit={enregistrerCategorie} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la catégorie</label>
            <input
              type="text"
              value={formulaire.nom}
              onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
              <input
                type="number"
                value={formulaire.ordre}
                onChange={(e) => setFormulaire({ ...formulaire, ordre: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image (lien, optionnel)</label>
              <input
                type="text"
                value={formulaire.image || ""}
                onChange={(e) => setFormulaire({ ...formulaire, image: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
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
            <button type="button" onClick={() => setFormulaireOuvert(false)} className="text-sm text-gray-500">
              Annuler
            </button>
          </div>
        </form>
      )}

      {chargement ? (
        <p className="text-center text-gray-400 py-10">Chargement...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4"
            >
              <div>
                <p className="font-medium text-sm">{cat.nom}</p>
                <p className="text-xs text-gray-500">Ordre : {cat.ordre} · /{cat.slug}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => ouvrirModification(cat)} className="text-sm text-primary">
                  Modifier
                </button>
                <button onClick={() => supprimerCategorie(cat.id)} className="text-sm text-red-500">
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
