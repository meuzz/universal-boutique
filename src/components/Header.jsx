import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function chargerCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("nom, slug, ordre")
        .not("slug", "in", '("promotions","nouveautes")')
        .order("ordre", { ascending: true });

      if (!error) setCategories(data);
    }
    chargerCategories();
  }, []);

  function soumettreRecherche(e) {
    e.preventDefault();
    navigate(`/catalogue?q=${encodeURIComponent(recherche)}`);
  }

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
            UB
          </div>
          <span className="hidden sm:block text-white font-heading font-semibold text-lg">
            Universal <span className="text-accent font-normal">Boutique</span>
          </span>
        </Link>

        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="hidden md:flex items-center gap-1 text-white text-sm bg-primary-dark px-3 py-2 rounded-md"
        >
          Catégories
          <span className={`transition-transform ${menuOuvert ? "rotate-180" : ""}`}>▾</span>
        </button>

        <form onSubmit={soumettreRecherche} className="flex-1 hidden sm:flex">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full rounded-md px-3 py-2 text-sm focus:outline-none"
          />
        </form>

        <Link
          to="/panier"
          className="bg-accent text-white text-sm px-4 py-2 rounded-md font-medium shrink-0"
        >
          Panier
        </Link>
      </div>

      <form onSubmit={soumettreRecherche} className="sm:hidden px-4 pb-3">
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full rounded-md px-3 py-2 text-sm focus:outline-none"
        />
      </form>

      {menuOuvert && (
        <div className="hidden md:block bg-white border-t border-gray-100 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogue?categorie=${cat.slug}`}
                onClick={() => setMenuOuvert(false)}
                className="text-sm text-gray-700 hover:text-accent px-2 py-1.5 rounded hover:bg-gray-50"
              >
                {cat.nom}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
