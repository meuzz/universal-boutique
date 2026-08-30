import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useSEO } from "../lib/useSEO.js";

const EMOJIS = {
  "electronique-high-tech": "📱",
  "maison-cuisine": "🍳",
  "accessoires-auto": "🚗",
  "accessoires-moto": "🏍️",
  "beaute-soins": "💄",
  "mode-accessoires": "👗",
  "solaire-energie": "☀️",
  "outils-bricolage": "🛠️",
  "bebe-enfants": "🍼",
  "vie-quotidienne": "🧴",
  promotions: "🏷️",
  nouveautes: "✨",
};

const AVANTAGES = [
  { titre: "Livraison au Sénégal", texte: "Livraison rapide à Dakar et dans les autres régions." },
  { titre: "Paiement à la livraison", texte: "Payez en espèces ou par mobile money à la réception." },
  { titre: "Support WhatsApp", texte: "Une question ? Écrivez-nous directement sur WhatsApp." },
  { titre: "Large choix", texte: "Des produits pour toute la maison et le quotidien." },
];

const TEMOIGNAGES = [
  { nom: "Awa D.", ville: "Dakar", texte: "Commande reçue rapidement, produit conforme à la description." },
  { nom: "Moussa S.", ville: "Thiès", texte: "Très bon service, réponse rapide sur WhatsApp." },
  { nom: "Fatou N.", ville: "Rufisque", texte: "Prix corrects et livraison sans problème." },
];

export default function Accueil() {
  useSEO({
    titre: "Boutique généraliste au Sénégal",
    description: "Universal Boutique : électronique, maison, mode, auto, moto, beauté, solaire et plus. Livraison au Sénégal, commande facile par WhatsApp.",
  });

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerCategories() {
      // On exclut Promotions et Nouveautés de la grille de catégories :
      // elles sont déjà mises en avant plus bas sur la page.
      const { data, error } = await supabase
        .from("categories")
        .select("nom, slug, image, ordre")
        .not("slug", "in", '("promotions","nouveautes")')
        .order("ordre", { ascending: true });

      if (error) {
        setErreur(error.message);
      } else {
        setCategories(data);
      }
      setChargement(false);
    }
    chargerCategories();
  }, []);

  return (
    <div>
      <section className="bg-primary text-white py-16 md:py-24 px-4 text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-semibold mb-4">
          Universal Boutique
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
          Électronique, maison, mode, auto, moto, beauté et bien plus —
          tout ce dont vous avez besoin, livré au Sénégal.
        </p>
        <Link
          to="/catalogue"
          className="inline-block bg-accent px-6 py-3 rounded-md font-medium hover:bg-accent-dark transition"
        >
          Commander maintenant
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">
          Nos catégories
        </h2>

        {chargement && (
          <p className="text-center text-gray-400">Chargement des catégories...</p>
        )}

        {erreur && (
          <p className="text-center text-red-500">
            Impossible de charger les catégories : {erreur}
          </p>
        )}

        {!chargement && !erreur && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogue?categorie=${cat.slug}`}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="text-3xl mb-2">{EMOJIS[cat.slug] || "🛍️"}</div>
                <div className="text-sm font-medium text-gray-700">{cat.nom}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-6 text-center">
            Produits populaires
          </h2>
          <p className="text-center text-gray-500">
            Les produits populaires s'afficheront ici automatiquement une fois ajoutés dans l'administration.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">
          Nouveautés
        </h2>
        <p className="text-center text-gray-500">
          Les nouveaux produits apparaîtront ici dès qu'ils seront ajoutés.
        </p>
      </section>

      <section className="bg-primary-dark py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-heading font-medium mb-6 text-white">
            Nos promotions
          </h2>
          <p className="text-gray-200">
            Les articles en promotion seront mis en avant ici, avec le prix barré et le nouveau prix.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-8 text-center">
          Pourquoi choisir Universal Boutique ?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AVANTAGES.map((a) => (
            <div key={a.titre} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 font-heading font-semibold">
                ✓
              </div>
              <p className="font-medium text-sm mb-1">{a.titre}</p>
              <p className="text-xs text-gray-500">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-8 text-center">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 italic mb-3">« {t.texte} »</p>
                <p className="text-sm font-medium">{t.nom} — <span className="text-gray-400 font-normal">{t.ville}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
